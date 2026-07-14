import { getDb } from '@/lib/db'
import bcrypt from 'bcryptjs'

function looksLikePhone(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed.includes('@')) return false
  const digits = trimmed.replace(/\D/g, '')
  return digits.length >= 9 && /^[\d+\s()-]+$/.test(trimmed)
}

/** Build Kenyan phone lookup variants: 07..., 2547..., +2547... */
function phoneVariants(raw: string): string[] {
  const digits = raw.replace(/\D/g, '')
  const variants = new Set<string>([raw.trim(), digits])

  let national = digits
  if (digits.startsWith('254') && digits.length >= 12) {
    national = digits.slice(3)
  } else if (digits.startsWith('0') && digits.length >= 10) {
    national = digits.slice(1)
  }

  if (national.length >= 9) {
    variants.add(national)
    variants.add(`0${national}`)
    variants.add(`254${national}`)
    variants.add(`+254${national}`)
  }

  return Array.from(variants)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const password = body.password
    const identifier = String(body.identifier ?? body.email ?? '').trim()

    if (!identifier || !password) {
      return Response.json(
        { error: 'Email/phone and password are required' },
        { status: 400 }
      )
    }

    const db = getDb()
    let user: Record<string, unknown> | undefined

    if (looksLikePhone(identifier)) {
      const variants = phoneVariants(identifier)
      const placeholders = variants.map(() => '?').join(', ')
      user = db
        .prepare(
          `SELECT * FROM users WHERE phone IN (${placeholders}) OR email = ?`
        )
        .get(...variants, identifier) as Record<string, unknown> | undefined
    } else {
      user = db
        .prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE')
        .get(identifier) as Record<string, unknown> | undefined
    }

    if (!user) {
      db.close()
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isValidPassword = bcrypt.compareSync(
      password,
      user.password as string
    )

    if (!isValidPassword) {
      db.close()
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const { password: _, ...userWithoutPassword } = user

    db.close()

    return Response.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
    })
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to login',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

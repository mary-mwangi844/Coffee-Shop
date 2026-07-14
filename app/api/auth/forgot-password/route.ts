import {
  getDb,
  createToken,
  findUserByIdentifier,
  looksLikePhone,
} from '@/lib/db'
import { deliverPasswordReset } from '@/lib/notify'

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json()
    const value = String(identifier || '').trim()

    if (!value) {
      return Response.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      )
    }

    // Always return a generic success to avoid account enumeration
    const generic = {
      success: true,
      message:
        'If an account exists for that email or phone, reset instructions were sent.',
    }

    const db = getDb()
    const user = findUserByIdentifier(db, value)

    if (!user) {
      db.close()
      return Response.json(generic)
    }

    db.prepare(
      `UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0`
    ).run(user.id)

    const token = createToken(32)
    db.prepare(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES (?, ?, datetime('now', '+30 minutes'))`
    ).run(user.id, token)

    const email = String(user.email || '')
    const phone = String(user.phone || '')
    db.close()

    try {
      await deliverPasswordReset({
        email: email.includes('@') && !email.endsWith('@facebook.local')
          ? email
          : null,
        phone: phone || null,
        token,
        preferPhone: looksLikePhone(value),
      })
    } catch (err) {
      // In development, still expose that delivery failed but keep generic messaging in production style
      const details = err instanceof Error ? err.message : 'Delivery failed'
      return Response.json(
        {
          ...generic,
          delivered: false,
          warning: details,
        },
        { status: 200 }
      )
    }

    return Response.json({ ...generic, delivered: true })
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to start password reset',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

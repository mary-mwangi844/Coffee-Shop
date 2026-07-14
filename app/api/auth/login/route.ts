import { getDb, findUserByIdentifier, toPublicUser } from '@/lib/db'
import bcrypt from 'bcryptjs'

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
    const user = findUserByIdentifier(db, identifier)

    if (!user || !user.password) {
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

    const publicUser = toPublicUser(user)
    db.close()

    return Response.json({
      success: true,
      message: 'Login successful',
      user: publicUser,
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

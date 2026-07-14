import { getDb } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    const resetToken = String(token || '').trim()
    const nextPassword = String(password || '')

    if (!resetToken || nextPassword.length < 6) {
      return Response.json(
        { error: 'Valid token and a password of at least 6 characters are required' },
        { status: 400 }
      )
    }

    const db = getDb()
    const row = db
      .prepare(
        `SELECT * FROM password_reset_tokens
         WHERE token = ? AND used = 0 AND expires_at > datetime('now')`
      )
      .get(resetToken) as { id: number; user_id: number } | undefined

    if (!row) {
      db.close()
      return Response.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 }
      )
    }

    const hashed = bcrypt.hashSync(nextPassword, 10)
    db.prepare(`UPDATE users SET password = ?, provider = 'local' WHERE id = ?`).run(
      hashed,
      row.user_id
    )
    db.prepare(`UPDATE password_reset_tokens SET used = 1 WHERE id = ?`).run(row.id)
    db.close()

    return Response.json({
      success: true,
      message: 'Password updated. You can log in now.',
    })
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to reset password',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

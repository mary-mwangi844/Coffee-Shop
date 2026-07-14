import { getDb } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { code } = await req.json()
    if (!code) {
      return Response.json({ error: 'Missing code' }, { status: 400 })
    }

    const db = getDb()
    const row = db
      .prepare(
        `SELECT * FROM oauth_handoffs
         WHERE code = ? AND expires_at > datetime('now')`
      )
      .get(code) as { user_json: string } | undefined

    if (!row) {
      db.close()
      return Response.json({ error: 'Invalid or expired code' }, { status: 400 })
    }

    db.prepare('DELETE FROM oauth_handoffs WHERE code = ?').run(code)
    db.close()

    return Response.json({
      success: true,
      user: JSON.parse(row.user_json),
    })
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to complete OAuth login',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

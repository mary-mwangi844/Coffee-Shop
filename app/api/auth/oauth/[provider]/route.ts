import { getDb, createToken } from '@/lib/db'

function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.FRONTEND_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

function oauthConfigured(provider: 'google' | 'facebook') {
  if (provider === 'google') {
    return Boolean(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    )
  }
  return Boolean(
    process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET
  )
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params
  if (provider !== 'google' && provider !== 'facebook') {
    return Response.json({ error: 'Unsupported provider' }, { status: 400 })
  }

  if (!oauthConfigured(provider)) {
    return Response.redirect(
      `${appUrl()}/login?oauth_error=${encodeURIComponent(
        `${provider} login is not configured. Add ${
          provider === 'google'
            ? 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET'
            : 'FACEBOOK_APP_ID and FACEBOOK_APP_SECRET'
        } to .env`
      )}`
    )
  }

  const state = createToken(16)
  const redirectUri = `${appUrl()}/api/auth/oauth/${provider}/callback`

  const db = getDb()
  db.prepare(
    `INSERT INTO oauth_handoffs (code, user_json, expires_at)
     VALUES (?, ?, datetime('now', '+10 minutes'))`
  ).run(`state:${state}`, JSON.stringify({ provider, purpose: 'oauth_state' }))
  db.close()

  if (provider === 'google') {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!)
    url.searchParams.set('redirect_uri', redirectUri)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', 'openid email profile')
    url.searchParams.set('state', state)
    url.searchParams.set('access_type', 'online')
    url.searchParams.set('prompt', 'select_account')
    return Response.redirect(url.toString())
  }

  const url = new URL('https://www.facebook.com/v19.0/dialog/oauth')
  url.searchParams.set('client_id', process.env.FACEBOOK_APP_ID!)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('state', state)
  url.searchParams.set('scope', 'email,public_profile')
  return Response.redirect(url.toString())
}

import {
  getDb,
  createToken,
  toPublicUser,
} from '@/lib/db'
import bcrypt from 'bcryptjs'

function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.FRONTEND_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

type OAuthProfile = {
  provider: 'google' | 'facebook'
  providerId: string
  email: string
  firstName: string
  lastName: string
}

async function exchangeGoogle(code: string, redirectUri: string): Promise<OAuthProfile> {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  const tokenJson = await tokenRes.json()
  if (!tokenRes.ok) {
    throw new Error(tokenJson.error_description || 'Google token exchange failed')
  }

  const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` },
  })
  const profile = await profileRes.json()
  if (!profileRes.ok || !profile.email) {
    throw new Error('Could not load Google profile')
  }

  return {
    provider: 'google',
    providerId: profile.sub,
    email: String(profile.email).toLowerCase(),
    firstName: profile.given_name || profile.name?.split(' ')[0] || 'Guest',
    lastName:
      profile.family_name ||
      profile.name?.split(' ').slice(1).join(' ') ||
      'User',
  }
}

async function exchangeFacebook(
  code: string,
  redirectUri: string
): Promise<OAuthProfile> {
  const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token')
  tokenUrl.searchParams.set('client_id', process.env.FACEBOOK_APP_ID!)
  tokenUrl.searchParams.set('client_secret', process.env.FACEBOOK_APP_SECRET!)
  tokenUrl.searchParams.set('redirect_uri', redirectUri)
  tokenUrl.searchParams.set('code', code)

  const tokenRes = await fetch(tokenUrl)
  const tokenJson = await tokenRes.json()
  if (!tokenRes.ok || !tokenJson.access_token) {
    throw new Error(tokenJson.error?.message || 'Facebook token exchange failed')
  }

  const profileUrl = new URL('https://graph.facebook.com/me')
  profileUrl.searchParams.set('fields', 'id,email,first_name,last_name,name')
  profileUrl.searchParams.set('access_token', tokenJson.access_token)

  const profileRes = await fetch(profileUrl)
  const profile = await profileRes.json()
  if (!profileRes.ok || !profile.id) {
    throw new Error('Could not load Facebook profile')
  }

  const email =
    profile.email ||
    `${profile.id}@facebook.local`

  return {
    provider: 'facebook',
    providerId: String(profile.id),
    email: String(email).toLowerCase(),
    firstName: profile.first_name || profile.name?.split(' ')[0] || 'Guest',
    lastName:
      profile.last_name ||
      profile.name?.split(' ').slice(1).join(' ') ||
      'User',
  }
}

function upsertOAuthUser(profile: OAuthProfile) {
  const db = getDb()

  let user = db
    .prepare(
      `SELECT * FROM users WHERE provider = ? AND provider_id = ?`
    )
    .get(profile.provider, profile.providerId) as
    | Record<string, unknown>
    | undefined

  if (!user) {
    user = db
      .prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE')
      .get(profile.email) as Record<string, unknown> | undefined
  }

  if (user) {
    db.prepare(
      `UPDATE users
       SET provider = ?, provider_id = ?, first_name = COALESCE(NULLIF(first_name,''), ?),
           last_name = COALESCE(NULLIF(last_name,''), ?)
       WHERE id = ?`
    ).run(
      profile.provider,
      profile.providerId,
      profile.firstName,
      profile.lastName,
      user.id
    )
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id) as Record<
      string,
      unknown
    >
  } else {
    const result = db
      .prepare(
        `INSERT INTO users (first_name, last_name, email, phone, password, provider, provider_id)
         VALUES (?, ?, ?, '', ?, ?, ?)`
      )
      .run(
        profile.firstName,
        profile.lastName,
        profile.email,
        bcrypt.hashSync(createToken(24), 10),
        profile.provider,
        profile.providerId
      )
    user = db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(result.lastInsertRowid) as Record<string, unknown>
  }

  const handoff = createToken(24)
  db.prepare(
    `INSERT INTO oauth_handoffs (code, user_json, expires_at)
     VALUES (?, ?, datetime('now', '+5 minutes'))`
  ).run(handoff, JSON.stringify(toPublicUser(user)))
  db.close()
  return handoff
}

export async function GET(
  req: Request,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const oauthError = url.searchParams.get('error')

  if (oauthError) {
    return Response.redirect(
      `${appUrl()}/login?oauth_error=${encodeURIComponent(oauthError)}`
    )
  }

  if (provider !== 'google' && provider !== 'facebook') {
    return Response.redirect(`${appUrl()}/login?oauth_error=unsupported_provider`)
  }

  if (!code || !state) {
    return Response.redirect(`${appUrl()}/login?oauth_error=missing_code`)
  }

  const db = getDb()
  const stateRow = db
    .prepare(
      `SELECT * FROM oauth_handoffs
       WHERE code = ? AND expires_at > datetime('now')`
    )
    .get(`state:${state}`)
  db.prepare(`DELETE FROM oauth_handoffs WHERE code = ?`).run(`state:${state}`)
  db.close()

  if (!stateRow) {
    return Response.redirect(`${appUrl()}/login?oauth_error=invalid_state`)
  }

  try {
    const redirectUri = `${appUrl()}/api/auth/oauth/${provider}/callback`
    const profile =
      provider === 'google'
        ? await exchangeGoogle(code, redirectUri)
        : await exchangeFacebook(code, redirectUri)

    const handoff = upsertOAuthUser(profile)
    return Response.redirect(
      `${appUrl()}/login/oauth-complete?code=${encodeURIComponent(handoff)}`
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'OAuth login failed'
    return Response.redirect(
      `${appUrl()}/login?oauth_error=${encodeURIComponent(message)}`
    )
  }
}

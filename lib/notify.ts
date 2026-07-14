import { Resend } from 'resend'

function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.FRONTEND_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  const resend = new Resend(key)
  const resetUrl = `${appUrl()}/reset-password?token=${encodeURIComponent(token)}`
  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: "Reset your Maya's Coffee Shop password",
    text: `Reset your password using this link (expires in 30 minutes):\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family: Georgia, serif; color: #1E120E; line-height: 1.6;">
        <h2 style="margin-bottom: 8px;">Reset your password</h2>
        <p>We received a request to reset your Maya's Coffee Shop password.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#C6A15B;color:#120B08;text-decoration:none;border-radius:999px;font-weight:600;">Reset password</a></p>
        <p style="font-size: 13px; color: #7D6556;">This link expires in 30 minutes. If you did not request it, ignore this email.</p>
      </div>
    `,
  })

  if (error) {
    throw new Error(error.message || 'Failed to send reset email')
  }

  return { channel: 'email' as const, resetUrl }
}

/** Africa's Talking SMS (Kenya). Optional — skipped if env is missing. */
export async function sendPasswordResetSms(toPhone: string, token: string) {
  const apiKey = process.env.AT_API_KEY
  const username = process.env.AT_USERNAME
  const sender = process.env.AT_SENDER_ID || 'MAYA'

  if (!apiKey || !username) {
    throw new Error('SMS is not configured (AT_API_KEY / AT_USERNAME)')
  }

  const digits = toPhone.replace(/\D/g, '')
  let msisdn = digits
  if (digits.startsWith('0') && digits.length >= 10) {
    msisdn = `254${digits.slice(1)}`
  } else if (!digits.startsWith('254')) {
    msisdn = `254${digits}`
  }

  const resetUrl = `${appUrl()}/reset-password?token=${encodeURIComponent(token)}`
  const message = `Maya's Coffee: Reset your password here (expires in 30 min): ${resetUrl}`

  const body = new URLSearchParams({
    username,
    to: `+${msisdn}`,
    message,
    from: sender,
  })

  const response = await fetch('https://api.africastalking.com/version1/messaging', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      apiKey,
    },
    body,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`SMS failed: ${text}`)
  }

  return { channel: 'sms' as const, resetUrl }
}

export async function deliverPasswordReset(opts: {
  email?: string | null
  phone?: string | null
  token: string
  preferPhone?: boolean
}) {
  const attempts: string[] = []

  if (opts.preferPhone && opts.phone) {
    try {
      const result = await sendPasswordResetSms(opts.phone, opts.token)
      return result
    } catch (err) {
      attempts.push(err instanceof Error ? err.message : 'SMS failed')
    }
  }

  if (opts.email && opts.email.includes('@')) {
    const result = await sendPasswordResetEmail(opts.email, opts.token)
    return result
  }

  if (opts.phone) {
    const result = await sendPasswordResetSms(opts.phone, opts.token)
    return result
  }

  throw new Error(
    attempts[0] || 'No email or phone available to deliver reset instructions'
  )
}

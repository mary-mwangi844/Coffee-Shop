'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [warning, setWarning] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setWarning('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      })
      const data = await response.json()
      if (data.warning) setWarning(data.warning)
      setSubmitted(true)
    } catch {
      setWarning('Could not send reset instructions. Please try again.')
      setSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Forgot Password</h1>
        <p className="auth-subtitle">
          Enter the email or phone number linked to your account. We&apos;ll send
          a reset link by email (or SMS if configured).
        </p>

        {submitted ? (
          <div className="auth-success">
            <p>
              If an account exists for <strong>{identifier.trim()}</strong>,
              you will receive password reset instructions shortly.
            </p>
            {warning && (
              <p className="contact-error">
                Delivery note: {warning}. Check RESEND_API_KEY / Africa&apos;s
                Talking env vars if nothing arrives.
              </p>
            )}
            <Link href="/login" className="btn btn-primary btn-auth">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="identifier">Email or Phone Number *</label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
                placeholder="Email or 07XXXXXXXX"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-auth"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>Remember your password?</p>
          <Link href="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

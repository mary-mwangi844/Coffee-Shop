'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Placeholder: no email/SMS delivery in this pass
    await new Promise((resolve) => setTimeout(resolve, 400))
    setSubmitted(true)
    setIsLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Forgot Password</h1>
        <p className="auth-subtitle">
          Enter the email or phone number linked to your account
        </p>

        {submitted ? (
          <div className="auth-success">
            <p>
              If an account exists for <strong>{identifier.trim()}</strong>,
              you will receive password reset instructions shortly.
            </p>
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
              {isLoading ? 'Sending...' : 'Reset Password'}
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

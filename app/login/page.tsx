'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const oauthError = searchParams.get('oauth_error')
    if (oauthError) setError(oauthError)
    const next = searchParams.get('next')
    if (next && next.startsWith('/') && !next.startsWith('//')) {
      try {
        sessionStorage.setItem('loginNext', next)
      } catch {
        /* ignore */
      }
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.identifier.trim(),
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        window.dispatchEvent(new Event('auth-change'))
        const next = searchParams.get('next')
        const safeNext =
          next && next.startsWith('/') && !next.startsWith('//') ? next : '/'
        router.push(safeNext)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <aside className="auth-aside" aria-hidden="true">
          <p className="section-eyebrow">Welcome back</p>
          <h2>Maya&apos;s</h2>
          <p>Email, phone, or continue with Google / Facebook.</p>
        </aside>
        <div className="auth-container">
          <h1>Login</h1>
          <p className="auth-subtitle">
            Enter your email or phone number to continue
          </p>

          {error && <p className="error-message">{error}</p>}

          <div className="oauth-row">
            <a
              href={`/api/auth/oauth/google${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next')!)}` : ''}`}
              className="oauth-btn oauth-google"
            >
              Continue with Google
            </a>
            <a
              href={`/api/auth/oauth/facebook${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next')!)}` : ''}`}
              className="oauth-btn oauth-facebook"
            >
              Continue with Facebook
            </a>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="identifier">Email or Phone Number</label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleInputChange}
                required
                autoComplete="username"
                placeholder="Email or 07XXXXXXXX"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </div>

            <div className="form-actions">
              <Link href="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-auth btn-shine"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don&apos;t have an account?</p>
            <Link href="/signup" className="text-link">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page" />}>
      <LoginForm />
    </Suspense>
  )
}

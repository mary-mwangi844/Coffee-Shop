'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function OAuthCompleteInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setError('Missing OAuth code')
      return
    }

    ;(async () => {
      try {
        const response = await fetch('/api/auth/oauth/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })
        const data = await response.json()
        if (!response.ok) {
          setError(data.error || 'OAuth login failed')
          return
        }
        localStorage.setItem('user', JSON.stringify(data.user))
        window.dispatchEvent(new Event('auth-change'))
        let next = '/'
        try {
          const stored = sessionStorage.getItem('loginNext')
          if (stored && stored.startsWith('/') && !stored.startsWith('//')) {
            next = stored
          }
          sessionStorage.removeItem('loginNext')
        } catch {
          /* ignore */
        }
        router.replace(next)
      } catch {
        setError('OAuth login failed')
      }
    })()
  }, [router, searchParams])

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Signing you in…</h1>
        <p className="auth-subtitle">
          {error || 'Finishing social login. One moment.'}
        </p>
        {error && (
          <a href="/login" className="btn btn-primary btn-auth">
            Back to Login
          </a>
        )}
      </div>
    </div>
  )
}

export default function OAuthCompletePage() {
  return (
    <Suspense fallback={<div className="auth-page" />}>
      <OAuthCompleteInner />
    </Suspense>
  )
}

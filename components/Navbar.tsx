'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cartCount, readCart, readUser, type StoredUser } from '@/lib/cart'

function CartIcon() {
  return (
    <svg
      className="nav-cart-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h2l1.6 9.2a1.4 1.4 0 0 0 1.4 1.1h8.3a1.4 1.4 0 0 0 1.4-1.1L20 8H7" />
      <circle cx="10" cy="19.2" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="19.2" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contacts', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<StoredUser | null>(null)
  const [count, setCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sync = () => {
      setUser(readUser())
      setCount(cartCount(readCart()))
    }
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('auth-change', sync)
    window.addEventListener('cart-change', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('auth-change', sync)
      window.removeEventListener('cart-change', sync)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}
    >
      <nav className="navbar" aria-label="Primary">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">M</span>
          <span className="logo-text">
            Maya&apos;s
            <em>Coffee</em>
          </span>
        </Link>

        <button
          type="button"
          className={`nav-toggle ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <ul className={`nav-links ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? 'is-active' : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <Link
                href="/account"
                className={pathname.startsWith('/account') ? 'is-active' : undefined}
                onClick={() => setOpen(false)}
              >
                Account
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/cart"
              className="nav-cart"
              aria-label={`Shopping cart${count ? `, ${count} items` : ''}`}
              onClick={() => setOpen(false)}
            >
              <CartIcon />
              {count > 0 && <span className="nav-cart-badge">{count}</span>}
            </Link>
          </li>
          {!user && (
            <li>
              <Link
                href="/login"
                className="nav-login"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

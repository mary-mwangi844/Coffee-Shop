import Link from 'next/link'

export default function Navbar() {
  return (
    <nav>
      <Link href="/" className="logo">
        <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop" alt="Coffee" className="logo-icon" />
        <span className="logo-text">MAYA'S COFFEE</span>
      </Link>
      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/coffee">Coffee</Link></li>
        <li><Link href="/equipment">Equipment</Link></li>
        <li><Link href="/gifts">Gifts</Link></li>
        <li><Link href="/order">Order</Link></li>
        <li><Link href="/contacts">Contacts</Link></li>
      </ul>
    </nav>
  )
}

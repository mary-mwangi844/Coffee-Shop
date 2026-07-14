import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="logo">
        <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop" alt="Coffee" className="logo-icon" />
        <span className="logo-text">MAYA'S COFFEE SHOP</span>
      </Link>
      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/menu">Menu</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/signup">Sign Up</Link></li>
      </ul>
    </nav>
  )
}

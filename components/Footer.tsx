import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-glow" aria-hidden="true" />
      <div className="site-footer-inner">
        <div className="footer-brand-block">
          <p className="footer-eyebrow">Westlands · Nairobi</p>
          <Link href="/" className="footer-brand">
            Maya&apos;s Coffee Shop
          </Link>
          <p className="footer-tagline">Brewed slowly. Served with intention.</p>
        </div>
        <div className="footer-cols">
          <div>
            <h3>Visit</h3>
            <p>Menu</p>
            <p>
              <Link href="/menu">Order online</Link>
            </p>
            <p>
              <Link href="/about">Our story</Link>
            </p>
          </div>
          <div>
            <h3>Connect</h3>
            <p>
              <Link href="/contacts">Contact</Link>
            </p>
            <p>
              <a href="tel:0701637878">0701 637 878</a>
            </p>
            <p>
              <a href="mailto:mayamwangi2004@gmail.com">Email us</a>
            </p>
          </div>
        </div>
      </div>
      <div className="footer-bar">
        <span>© 2026 Maya&apos;s Coffee Shop</span>
        <span className="footer-mark">M</span>
      </div>
    </footer>
  )
}

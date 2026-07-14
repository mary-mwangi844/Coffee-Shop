'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import Reveal from '@/components/Reveal'
import TiltMedia from '@/components/TiltMedia'
import {
  MENU_CATEGORIES,
  getMenuByCategory,
  type MenuCategory,
  type MenuItem,
} from '@/lib/menu-catalog'
import { addToCart as pushCart, cartCount, readCart } from '@/lib/cart'

type Filter = MenuCategory | 'all'

export default function MenuPage() {
  const [count, setCount] = useState(0)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [addedId, setAddedId] = useState<number | null>(null)

  useEffect(() => {
    const sync = () => setCount(cartCount(readCart()))
    sync()
    window.addEventListener('cart-change', sync)
    return () => window.removeEventListener('cart-change', sync)
  }, [])

  const visible = useMemo(() => {
    const base = getMenuByCategory(filter)
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter((item) => {
      const hay = [
        item.name,
        item.description,
        item.note,
        item.origin || '',
        item.category,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [filter, query])

  const signatures = useMemo(
    () => visible.filter((item) => item.signature),
    [visible]
  )
  const featured = signatures[0] ?? visible[0]
  const rest = useMemo(
    () => visible.filter((item) => item.id !== featured?.id),
    [visible, featured]
  )

  const handleAdd = (product: MenuItem) => {
    pushCart(product, 1)
    setAddedId(product.id)
    window.setTimeout(
      () => setAddedId((id) => (id === product.id ? null : id)),
      1400
    )
  }

  return (
    <div className="menu-page">
      <section className="menu-hero-stage">
        <div className="menu-hero-media" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=2000&h=1200&fit=crop"
            alt=""
          />
          <div className="menu-hero-veil" />
        </div>
        <div className="menu-hero-copy">
          <p className="section-eyebrow anim-rise">Maison selection</p>
          <h1 className="anim-rise anim-rise-2">
            The <em>Menu</em>
          </h1>
          <p className="anim-rise anim-rise-3">
            Espresso classics, house signatures, a cold bar, and a pastry case
            built around what we roast and bake each morning.
          </p>
          <div className="menu-hero-meta anim-rise anim-rise-4">
            <span>{visible.length} offerings</span>
            <span>·</span>
            <span>Westlands</span>
            <span>·</span>
            <span>Daily roast</span>
          </div>
        </div>
      </section>

      <div className="menu-toolbar">
        <div className="menu-filters" role="tablist" aria-label="Menu categories">
          {MENU_CATEGORIES.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              className={`menu-filter ${filter === tab.id ? 'is-active' : ''}`}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="menu-toolbar-end">
          <label className="menu-search">
            <span className="sr-only">Search menu</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search drinks & pastries"
              aria-label="Search menu"
            />
          </label>
          <p className="menu-count">
            {visible.length} item{visible.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {signatures.length > 0 && filter === 'all' && (
        <section className="menu-signature-strip" aria-label="Signatures">
          <Reveal>
            <header className="section-head section-head-row">
              <div>
                <p className="section-eyebrow">Chef&apos;s marks</p>
                <h2>House signatures</h2>
              </div>
              <p className="menu-signature-hint">Hover to pause</p>
            </header>
          </Reveal>

          <div className="menu-signature-marquee" aria-hidden={false}>
            <div className="menu-signature-track">
              {[...signatures, ...signatures].map((item, index) => (
                <article
                  key={`${item.id}-${index}`}
                  className={`menu-signature-card float-${(index % 3) + 1}`}
                  style={{ animationDelay: `${(index % 6) * 0.35}s` }}
                >
                  <Link
                    href={`/product/${item.id}`}
                    className="menu-signature-link"
                  >
                    <div className="menu-signature-media">
                      <img src={item.image} alt={item.name} loading="lazy" />
                      <span className="menu-badge">Signature</span>
                    </div>
                    <div className="menu-signature-body">
                      <h3>{item.name}</h3>
                      <p>{item.note}</p>
                      <span className="price">KES {item.price}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {featured && (
        <section className="menu-featured">
          <Reveal className="menu-featured-card" variant="clip">
            <TiltMedia className="menu-featured-media">
              <Link href={`/product/${featured.id}`}>
                <img src={featured.image} alt={featured.name} />
              </Link>
              <span className="product-note">{featured.note}</span>
              {featured.signature && (
                <span className="menu-badge menu-badge-featured">Signature</span>
              )}
            </TiltMedia>
            <div className="menu-featured-body">
              <p className="section-eyebrow">
                {featured.category === 'pastry'
                  ? 'From the case'
                  : featured.category === 'cold'
                    ? 'Cold bar'
                    : featured.category === 'specialty'
                      ? 'Signature'
                      : 'Espresso bar'}
              </p>
              <h2>{featured.name}</h2>
              {featured.origin && (
                <p className="menu-origin">{featured.origin}</p>
              )}
              <p>{featured.description}</p>
              <div className="menu-featured-actions">
                <span className="price">KES {featured.price}</span>
                <div className="menu-featured-buttons">
                  <button
                    type="button"
                    className="btn btn-primary btn-shine"
                    onClick={() => handleAdd(featured)}
                  >
                    {addedId === featured.id ? 'Added' : 'Add to Cart'}
                  </button>
                  <Link
                    href={`/product/${featured.id}`}
                    className="btn btn-ghost-dark"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {visible.length === 0 ? (
        <section className="menu-empty anim-rise">
          <h2>No matches</h2>
          <p>
            Nothing on the menu matches “{query.trim()}”. Try another word or
            clear the search.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setQuery('')}
          >
            Clear search
          </button>
        </section>
      ) : (
        <section className="menu-gallery">
          <Reveal>
            <header className="section-head">
              <p className="section-eyebrow">Full selection</p>
              <h2>
                {filter === 'all'
                  ? 'Everything we serve'
                  : MENU_CATEGORIES.find((c) => c.id === filter)?.label}
              </h2>
            </header>
          </Reveal>
          <div className="menu-mosaic">
            {rest.map((item, index) => (
              <Reveal
                key={item.id}
                as="article"
                className={`menu-card ${index % 7 === 0 ? 'is-wide' : ''} ${index % 5 === 2 ? 'is-tall' : ''}`}
                delay={Math.min(index, 10) * 55}
                variant="clip"
              >
                <TiltMedia className="menu-card-media" maxTilt={6}>
                  <Link href={`/product/${item.id}`}>
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <span className="product-note">{item.note}</span>
                  {item.signature && (
                    <span className="menu-badge">Signature</span>
                  )}
                </TiltMedia>
                <div className="menu-card-body">
                  <div className="menu-card-top">
                    <h3>{item.name}</h3>
                    <span className="price">KES {item.price}</span>
                  </div>
                  {item.origin && <p className="menu-origin">{item.origin}</p>}
                  <p>{item.description}</p>
                  <div className="menu-card-actions">
                    <button
                      type="button"
                      className="menu-add"
                      onClick={() => handleAdd(item)}
                    >
                      {addedId === item.id ? 'Added ✓' : 'Add to cart'}
                    </button>
                    <Link href={`/product/${item.id}`} className="menu-more">
                      View
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {count > 0 && (
        <div className="menu-dock">
          <div className="menu-dock-inner">
            <div>
              <strong>{count}</strong> in cart
            </div>
            <Link href="/cart" className="btn btn-primary btn-shine">
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

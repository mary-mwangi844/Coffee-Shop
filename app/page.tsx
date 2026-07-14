'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import TiltMedia from '@/components/TiltMedia'

const featuredProducts = [
  {
    id: 1,
    name: 'Espresso',
    price: 200,
    image:
      'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=900&h=1200&fit=crop',
    note: 'Short · intense',
  },
  {
    id: 2,
    name: 'Cappuccino',
    price: 300,
    image:
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=900&h=1200&fit=crop',
    note: 'Foam · balanced',
  },
  {
    id: 4,
    name: 'Latte',
    price: 350,
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&h=1200&fit=crop',
    note: 'Silk · steamed',
  },
  {
    id: 3,
    name: 'Chocolate Cake',
    price: 450,
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&h=1200&fit=crop',
    note: 'Slice · rich',
  },
]

const promises = [
  {
    title: 'Fresh beans',
    text: 'Small-batch roast profiles dialed for aroma, sweetness, and clean finish.',
  },
  {
    title: 'Quiet tables',
    text: 'A room that holds conversation, deadlines, and the last quiet sip.',
  },
  {
    title: 'Careful delivery',
    text: 'Hot, sealed, and on time—from our counter to yours.',
  },
]

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const media = mediaRef.current
    if (!hero || !media) return

    const onScroll = () => {
      const y = window.scrollY
      media.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(${1 + y * 0.00008})`
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="home-page">
      <section ref={heroRef} className="hero-section" aria-label="Welcome">
        <div ref={mediaRef} className="hero-media" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=2000&h=1400&fit=crop"
            alt=""
            className="hero-media-img"
          />
          <div className="hero-media-veil" />
          <div className="hero-orb hero-orb-a" />
          <div className="hero-orb hero-orb-b" />
        </div>

        <div className="hero-copy">
          <p className="hero-brand anim-rise">
            <span>Maya&apos;s</span>
            <span className="hero-brand-line">Coffee Shop</span>
          </p>
          <h1 className="anim-rise anim-rise-2">Where every cup tells a story</h1>
          <p className="hero-lead anim-rise anim-rise-3">
            Specialty blends, patient technique, and a room built for lingering.
          </p>
          <div className="hero-buttons anim-rise anim-rise-4">
            <Link href="/menu" className="btn btn-primary btn-shine">
              Order Now
            </Link>
            <Link href="/menu" className="btn btn-ghost">
              Explore the Menu
            </Link>
          </div>
        </div>

        <div className="hero-scroll-hint anim-rise anim-rise-5" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </section>

      <section className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="marquee-row">
              <span>Single origin</span>
              <span>·</span>
              <span>Westlands</span>
              <span>·</span>
              <span>Hand poured</span>
              <span>·</span>
              <span>Daily roast</span>
              <span>·</span>
              <span>Maya&apos;s</span>
              <span>·</span>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-products" aria-labelledby="featured-heading">
        <Reveal>
          <header className="section-head section-head-row">
            <div>
              <p className="section-eyebrow">On the bar</p>
              <h2 id="featured-heading">Featured today</h2>
            </div>
            <Link href="/menu" className="text-link">
              Full menu →
            </Link>
          </header>
        </Reveal>

        <div className="products-rail">
          {featuredProducts.map((product, index) => (
            <Reveal
              key={product.id}
              as="article"
              delay={index * 100}
              className="product-tile"
              variant="clip"
            >
              <Link href={`/product/${product.id}`} className="product-tile-link">
                <TiltMedia className="product-tile-media">
                  <img src={product.image} alt={product.name} />
                  <span className="product-note">{product.note}</span>
                </TiltMedia>
                <div className="product-tile-body">
                  <h3>{product.name}</h3>
                  <span className="price">KES {product.price}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="atmosphere-band" aria-label="The room">
        <div className="atmosphere-media">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&h=1000&fit=crop"
            alt="Interior of a warm coffee shop"
          />
        </div>
        <Reveal className="atmosphere-copy" variant="fade">
          <p className="section-eyebrow">The room</p>
          <h2>Come for the coffee. Stay for the quiet.</h2>
          <p>
            Soft light, wood warmth, and the soft percussion of the machine—
            a small ritual in Westlands.
          </p>
          <Link href="/about" className="btn btn-ghost-dark">
            Our story
          </Link>
        </Reveal>
      </section>

      <section className="why-choose-us" aria-labelledby="why-heading">
        <Reveal>
          <header className="section-head">
            <p className="section-eyebrow">Return visits</p>
            <h2 id="why-heading">Why guests come back</h2>
          </header>
        </Reveal>

        <div className="features-grid">
          {promises.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 110}
              className="feature-row"
              variant="up"
            >
              <span className="feature-index">0{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

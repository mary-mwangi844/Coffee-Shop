'use client'

import Reveal from '@/components/Reveal'

const values = [
  {
    title: 'Quality',
    text: 'We never compromise on the coffee or the ingredients that meet it.',
  },
  {
    title: 'Community',
    text: 'A welcoming room for work, friendship, and quiet mornings.',
  },
  {
    title: 'Sustainability',
    text: 'Ethical sourcing and practices that respect growers and place.',
  },
  {
    title: 'Craft',
    text: 'We keep refining roast profiles and brewing technique.',
  },
]

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="page-hero about-hero">
        <div className="page-hero-media" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&h=900&fit=crop"
            alt=""
          />
          <div className="page-hero-veil" />
        </div>
        <div className="page-hero-copy anim-rise">
          <p className="page-kicker">Our house</p>
          <h1>Maya&apos;s Coffee Shop</h1>
          <p>Where every cup tells a story</p>
        </div>
      </section>

      <div className="about-body">
        <Reveal className="about-block">
          <h2>Our story</h2>
          <p>
            Welcome to Maya&apos;s Coffee Shop, a calm corner for coffee in
            Westlands. We started with a simple wish: a place where people can
            step out of the rush and sit with a carefully made cup.
          </p>
          <p>
            We source from growers who share that care, roasting for flavour,
            aroma, and freshness—then serving it in a room that feels like it
            was made for lingering.
          </p>
        </Reveal>

        <Reveal className="about-block" delay={80}>
          <h2>Our mission</h2>
          <p>
            To serve exceptional coffee and memorable moments—cup by cup—while
            supporting fair trade and the people who grow what we brew.
          </p>
        </Reveal>

        <Reveal>
          <header className="section-head">
            <h2>What we stand for</h2>
            <p>Four promises we keep every day on the floor.</p>
          </header>
        </Reveal>

        <div className="values-list">
          {values.map((value, index) => (
            <Reveal
              key={value.title}
              className="value-row"
              delay={index * 80}
            >
              <span className="feature-index">0{index + 1}</span>
              <div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

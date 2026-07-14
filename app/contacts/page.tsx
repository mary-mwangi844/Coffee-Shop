'use client'

import { useState } from 'react'
import Reveal from '@/components/Reveal'

const contactItems = [
  { type: 'Phone', value: '0701637878', href: 'tel:0701637878' },
  {
    type: 'Email',
    value: 'mayamwangi2004@gmail.com',
    href: 'mailto:mayamwangi2004@gmail.com',
  },
  { type: 'Location', value: 'Westlands, Nairobi', href: undefined },
]

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setTimeout(() => setSubmitStatus('idle'), 3000)
      } else {
        setSubmitStatus('error')
        setTimeout(() => setSubmitStatus('idle'), 3000)
      }
    } catch {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }
  }

  return (
    <div className="contact-page">
      <section className="page-hero contact-hero">
        <div className="page-hero-media" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1920&h=900&fit=crop"
            alt=""
          />
          <div className="page-hero-veil" />
        </div>
        <div className="page-hero-copy anim-rise">
          <p className="page-kicker">Say hello</p>
          <h1>Contact us</h1>
          <p>Questions, catering, or a quiet table—we&apos;re here.</p>
        </div>
      </section>

      <div className="contact-body">
        <div className="contact-channels">
          {contactItems.map((item, index) => (
            <Reveal key={item.type} delay={index * 80} className="contact-channel">
              <span className="contact-channel-type">{item.type}</span>
              {item.href ? (
                <a href={item.href}>{item.value}</a>
              ) : (
                <span>{item.value}</span>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal className="contact-panel" delay={120}>
          <h2>Send a message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your@email.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="How can we help?"
                rows={5}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-auth"
              disabled={submitStatus === 'loading'}
            >
              {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
            {submitStatus === 'success' && (
              <p className="contact-success">Message sent successfully.</p>
            )}
            {submitStatus === 'error' && (
              <p className="contact-error">
                Failed to send. Please try again.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import ContactCard from '@/components/ContactCard'

const contactItems = [
  {
    type: 'Phone',
    value: '0701637878',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
    alt: 'Phone'
  },
  {
    type: 'Email',
    value: 'mayamwangi2004@gmail.com',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=200&fit=crop',
    alt: 'Email'
  },
  {
    type: 'Location',
    value: 'Westlands',
    image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=200&h=200&fit=crop',
    alt: 'Location'
  }
]

export default function Contacts() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('loading')

    try {
      const response = await fetch('/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }
  }

  return (
    <>
      <section id="contacts" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1920&h=1080&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', paddingTop: '100px' }}>
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">Get in touch with us</p>

        <div className="contacts-container">
          {contactItems.map((item) => (
            <ContactCard key={item.type} {...item} />
          ))}
        </div>

        <div className="contact-form-container">
          <h3 className="contact-form-title">Send us a message</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your message"
                rows={5}
              />
            </div>
            <button type="submit" className="contact-submit-btn" disabled={submitStatus === 'loading'}>
              {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
            {submitStatus === 'success' && (
              <p className="contact-success">Message sent successfully!</p>
            )}
            {submitStatus === 'error' && (
              <p className="contact-error">Failed to send message. Please try again.</p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

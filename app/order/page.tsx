'use client'

import { useState } from 'react'

const coffeeTypes = [
  'Espresso',
  'Americano',
  'Cappuccino',
  'Latte',
  'Mocha',
  'Macchiato',
  'Flat White',
  'Cold Brew',
  'Iced Coffee',
  'Affogato'
]

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coffeeType: '',
    quantity: 1,
    deliveryOption: 'pickup',
    address: ''
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('loading')

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          coffeeType: '',
          quantity: 1,
          deliveryOption: 'pickup',
          address: ''
        })
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        setSubmitStatus('error')
        setTimeout(() => setSubmitStatus('idle'), 5000)
      }
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  return (
    <section className="order-section">
      <div className="order-container">
        <h1 className="order-title">Place Your Order</h1>
        <p className="order-subtitle">Fill in your details below to order your favorite coffee</p>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
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
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="07XXXXXXXX"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coffeeType">Coffee Type *</label>
            <select
              id="coffeeType"
              required
              value={formData.coffeeType}
              onChange={(e) => setFormData({ ...formData, coffeeType: e.target.value })}
            >
              <option value="">Select a coffee type</option>
              {coffeeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="deliveryOption">Delivery Option *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="pickup"
                  checked={formData.deliveryOption === 'pickup'}
                  onChange={(e) => setFormData({ ...formData, deliveryOption: e.target.value })}
                />
                <span>Pickup</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="delivery"
                  checked={formData.deliveryOption === 'delivery'}
                  onChange={(e) => setFormData({ ...formData, deliveryOption: e.target.value })}
                />
                <span>Delivery</span>
              </label>
            </div>
          </div>

          {formData.deliveryOption === 'delivery' && (
            <div className="form-group">
              <label htmlFor="address">Delivery Address *</label>
              <textarea
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your delivery address"
                rows={3}
              />
            </div>
          )}

          <button type="submit" className="order-submit-btn" disabled={submitStatus === 'loading'}>
            {submitStatus === 'loading' ? 'Placing Order...' : 'Place Order'}
          </button>

          {submitStatus === 'success' && (
            <div className="order-success">
              <p>Order placed successfully! We'll contact you shortly.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="order-error">
              <p>Failed to place order. Please try again.</p>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

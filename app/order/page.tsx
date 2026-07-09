'use client'

import { useState } from 'react'

const coffeeTypes = [
  { name: 'Espresso', price: 200 },
  { name: 'Americano', price: 250 },
  { name: 'Cappuccino', price: 300 },
  { name: 'Latte', price: 350 },
  { name: 'Mocha', price: 400 },
  { name: 'Macchiato', price: 320 },
  { name: 'Flat White', price: 380 },
  { name: 'Cold Brew', price: 280 },
  { name: 'Iced Coffee', price: 260 },
  { name: 'Affogato', price: 450 }
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
  const [orderDetails, setOrderDetails] = useState<{ orderNumber: string; totalPrice: number } | null>(null)

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

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setOrderDetails({ orderNumber: result.orderNumber, totalPrice: result.totalPrice })
        setFormData({
          name: '',
          email: '',
          phone: '',
          coffeeType: '',
          quantity: 1,
          deliveryOption: 'pickup',
          address: ''
        })
        setTimeout(() => {
          setSubmitStatus('idle')
          setOrderDetails(null)
        }, 10000)
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
                <option key={type.name} value={type.name}>
                  {type.name} - KES {type.price}
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
              <p>Order placed successfully!</p>
              {orderDetails && (
                <div className="order-confirmation">
                  <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
                  <p><strong>Total Price:</strong> KES {orderDetails.totalPrice}</p>
                  <p>A confirmation email has been sent to your email address.</p>
                </div>
              )}
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

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type CartItem = {
  name: string
  quantity: number
  totalPrice: number
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'mpesa',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) setCart(JSON.parse(savedCart))
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.totalPrice, 0) + 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cart,
          total: calculateTotal(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.removeItem('cart')
        window.dispatchEvent(new Event('cart-change'))
        setStatus('Order placed successfully. Redirecting…')
        setTimeout(() => router.push('/'), 900)
      } else {
        setStatus(data.error || 'Failed to place order')
      }
    } catch {
      setStatus('Error placing order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!ready) {
    return <div className="checkout-page page-loading" />
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <header className="page-intro anim-rise">
          <h1>Checkout</h1>
          <p>Your cart is empty.</p>
          <Link href="/menu" className="btn btn-primary">
            Browse Menu
          </Link>
        </header>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <header className="page-intro anim-rise">
        <h1>Checkout</h1>
        <p>Confirm details and place your order.</p>
      </header>

      <div className="checkout-container">
        <form className="checkout-form anim-rise" onSubmit={handleSubmit}>
          <h2>Customer information</h2>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={3}
            />
          </div>

          <h2>Payment method</h2>
          <div className="payment-options">
            {[
              { value: 'mpesa', label: 'M-Pesa' },
              { value: 'cash', label: 'Cash' },
              { value: 'card', label: 'Card' },
            ].map((option) => (
              <label key={option.value} className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={formData.paymentMethod === option.value}
                  onChange={handleInputChange}
                />
                <span className="payment-label">{option.label}</span>
              </label>
            ))}
          </div>

          {status && <p className="checkout-status">{status}</p>}

          <button
            type="submit"
            className="btn btn-primary btn-place-order"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>

          <Link href="/cart" className="btn btn-secondary">
            Back to Cart
          </Link>
        </form>

        <aside className="order-summary anim-rise anim-rise-2">
          <h2>Order summary</h2>
          <div className="summary-items">
            {cart.map((item, index) => (
              <div key={index} className="summary-item">
                <span>
                  {item.name} ×{item.quantity}
                </span>
                <span>KES {item.totalPrice}</span>
              </div>
            ))}
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              KES {cart.reduce((total, item) => total + item.totalPrice, 0)}
            </span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>KES 100</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>KES {calculateTotal()}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}

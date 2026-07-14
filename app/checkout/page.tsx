'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'mpesa'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0) + 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: cart,
          total: calculateTotal()
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.removeItem('cart')
        alert('Order placed successfully!')
        router.push('/')
      } else {
        alert('Failed to place order: ' + data.error)
      }
    } catch (error) {
      alert('Error placing order')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty</p>
        <Link href="/menu" className="btn btn-primary">Browse Menu</Link>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Customer Information</h2>
          
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
          
          <h2>Payment Method</h2>
          
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="mpesa"
                checked={formData.paymentMethod === 'mpesa'}
                onChange={handleInputChange}
              />
              <span className="payment-label">M-Pesa</span>
            </label>
            
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleInputChange}
              />
              <span className="payment-label">Cash</span>
            </label>
            
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleInputChange}
              />
              <span className="payment-label">Card</span>
            </label>
          </div>
          
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
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-items">
            {cart.map((item, index) => (
              <div key={index} className="summary-item">
                <span>{item.name} x{item.quantity}</span>
                <span>KES {item.totalPrice}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>KES {cart.reduce((total, item) => total + item.totalPrice, 0)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee:</span>
            <span>KES 100</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>KES {calculateTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

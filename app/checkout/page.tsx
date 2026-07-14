'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  cartSubtotal,
  clearCart,
  readCart,
  readUser,
  type CartItem,
  type StoredUser,
} from '@/lib/cart'

function userDisplayName(user: StoredUser) {
  const first = user.first_name || user.firstName || ''
  const last = user.last_name || user.lastName || ''
  return `${first} ${last}`.trim()
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [user, setUser] = useState<StoredUser | null>(null)
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState('')
  const [mpesaPhone, setMpesaPhone] = useState('')
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
    const stored = readUser()
    if (!stored) {
      router.replace('/login?next=/checkout')
      return
    }
    setUser(stored)
    setCart(readCart())
    setFormData((prev) => ({
      ...prev,
      name: userDisplayName(stored) || prev.name,
      email: stored.email || prev.email,
      phone: stored.phone || prev.phone,
    }))
    setMpesaPhone(stored.phone || '')
    setReady(true)
  }, [router])

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

  const subtotal = cartSubtotal(cart)
  const total = subtotal + 100

  const placeOrder = async (extra: {
    status: string
    paymentRef?: string
  }) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        userId: user?.id,
        items: cart,
        total,
        status: extra.status,
        paymentRef: extra.paymentRef,
      }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to place order')
    }
    return data as { orderNumber: string }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('')

    try {
      let orderStatus = 'pending'
      let paymentRef: string | undefined

      if (formData.paymentMethod === 'mpesa') {
        setStatus('Sending M-Pesa STK push…')
        const payRes = await fetch('/api/payments/mpesa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: mpesaPhone || formData.phone,
            amount: total,
          }),
        })
        const payData = await payRes.json()
        if (!payRes.ok) {
          throw new Error(payData.error || 'M-Pesa payment failed')
        }
        paymentRef = payData.paymentRef
        orderStatus = 'confirmed'
        setStatus('Payment confirmed. Placing order…')
      } else if (formData.paymentMethod === 'cash') {
        orderStatus = 'pending'
      } else {
        orderStatus = 'awaiting_payment'
      }

      const data = await placeOrder({ status: orderStatus, paymentRef })

      try {
        sessionStorage.setItem(
          `order-snapshot-${data.orderNumber}`,
          JSON.stringify({
            orderNumber: data.orderNumber,
            items: cart,
            address: formData.address,
            paymentMethod: formData.paymentMethod,
            status: orderStatus,
            total,
            paymentRef,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          })
        )
      } catch {
        /* ignore */
      }

      clearCart()
      router.push(`/order/confirmation?order=${encodeURIComponent(data.orderNumber)}`)
    } catch (err) {
      setStatus(
        err instanceof Error ? err.message : 'Error placing order. Please try again.'
      )
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

  const payLabel =
    formData.paymentMethod === 'mpesa'
      ? 'Pay with M-Pesa'
      : formData.paymentMethod === 'cash'
        ? 'Place order (Cash on delivery)'
        : 'Place order'

  return (
    <div className="checkout-page">
      <header className="page-intro anim-rise">
        <h1>Checkout</h1>
        <p>Delivery details and payment — same flow as a national storefront.</p>
      </header>

      <div className="checkout-container">
        <form className="checkout-form anim-rise" onSubmit={handleSubmit}>
          <h2>Delivery</h2>

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
              placeholder="Estate, building, gate code…"
            />
          </div>

          <h2>Payment</h2>
          <div className="payment-options">
            {[
              { value: 'mpesa', label: 'M-Pesa', hint: 'STK prompt on your phone' },
              { value: 'cash', label: 'Cash on delivery', hint: 'Pay the rider' },
              { value: 'card', label: 'Card', hint: 'Pay at counter for now' },
            ].map((option) => (
              <label key={option.value} className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={formData.paymentMethod === option.value}
                  onChange={handleInputChange}
                />
                <span className="payment-label">
                  <strong>{option.label}</strong>
                  <em>{option.hint}</em>
                </span>
              </label>
            ))}
          </div>

          {formData.paymentMethod === 'mpesa' && (
            <div className="form-group mpesa-panel">
              <label htmlFor="mpesaPhone">M-Pesa phone *</label>
              <input
                type="tel"
                id="mpesaPhone"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                required
                placeholder="07XXXXXXXX or 2547XXXXXXXX"
              />
              <p className="field-hint">
                You’ll get a simulated Safaricom prompt, then we confirm payment.
              </p>
            </div>
          )}

          {formData.paymentMethod === 'card' && (
            <p className="field-hint">
              Card checkout is not live yet — we’ll mark the order as awaiting
              payment so you can settle at pickup or on delivery.
            </p>
          )}

          {status && <p className="checkout-status">{status}</p>}

          <button
            type="submit"
            className="btn btn-primary btn-place-order"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing…' : payLabel}
          </button>

          <Link href="/cart" className="btn btn-secondary">
            Back to Cart
          </Link>
        </form>

        <aside className="order-summary anim-rise anim-rise-2">
          <h2>Order summary</h2>
          <div className="summary-items">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="summary-item">
                <span>
                  {item.name} ×{item.quantity}
                </span>
                <span>KES {item.totalPrice}</span>
              </div>
            ))}
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>KES {subtotal}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>KES 100</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>KES {total}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  cartSubtotal,
  readCart,
  readUser,
  removeCartItem,
  updateCartQuantity,
  type CartItem,
} from '@/lib/cart'

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setCart(readCart())
    setReady(true)
  }, [])

  const updateQuantity = (index: number, newQuantity: number) => {
    setCart(updateCartQuantity(index, newQuantity))
  }

  const removeItem = (index: number) => {
    setCart(removeCartItem(index))
  }

  const subtotal = cartSubtotal(cart)

  const handleCheckout = () => {
    if (cart.length === 0) return
    if (!readUser()) {
      router.push('/login?next=/checkout')
      return
    }
    router.push('/checkout')
  }

  if (!ready) {
    return <div className="cart-page page-loading" />
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <header className="page-intro anim-rise">
          <h1>Your cart</h1>
          <p className="empty-cart">Nothing here yet—add something from the menu.</p>
          <Link href="/menu" className="btn btn-primary">
            Browse Menu
          </Link>
        </header>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <header className="page-intro anim-rise">
        <h1>Your cart</h1>
        <p>
          {cart.length} item{cart.length === 1 ? '' : 's'} ready to order.
        </p>
      </header>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item, index) => (
            <article
              key={`${item.id}-${index}`}
              className="cart-item anim-rise"
              style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
            >
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">KES {item.price} each</p>
                <div className="quantity-controls">
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="item-total">
                <p className="total-price">KES {item.totalPrice}</p>
                <button
                  type="button"
                  className="btn-text"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-aside anim-rise anim-rise-2">
          <h2>Order summary</h2>
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
            <span>KES {subtotal + 100}</span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-checkout"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
          <Link href="/menu" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}

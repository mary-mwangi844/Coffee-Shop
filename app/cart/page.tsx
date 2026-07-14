'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type CartItem = {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  totalPrice: number
}

function persistCart(next: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(next))
  window.dispatchEvent(new Event('cart-change'))
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)
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

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    const updatedCart = [...cart]
    updatedCart[index] = {
      ...updatedCart[index],
      quantity: newQuantity,
      totalPrice: updatedCart[index].price * newQuantity,
    }
    setCart(updatedCart)
    persistCart(updatedCart)
  }

  const removeItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index)
    setCart(updatedCart)
    persistCart(updatedCart)
  }

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.totalPrice, 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
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
        <p>{cart.length} item{cart.length === 1 ? '' : 's'} ready to order.</p>
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
            <span>KES {calculateTotal()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>KES 100</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>KES {calculateTotal() + 100}</span>
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

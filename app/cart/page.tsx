'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    const updatedCart = [...cart]
    updatedCart[index].quantity = newQuantity
    updatedCart[index].totalPrice = updatedCart[index].price * newQuantity
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }
    router.push('/checkout')
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <p className="empty-cart">Your cart is empty</p>
        <Link href="/menu" className="btn btn-primary">Browse Menu</Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">KES {item.price} each</p>
                
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="item-total">
                <p className="total-price">KES {item.totalPrice}</p>
                <button 
                  className="btn btn-remove"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>KES {calculateTotal()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee:</span>
            <span>KES 100</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>KES {calculateTotal() + 100}</span>
          </div>
          
          <button className="btn btn-primary btn-checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          
          <Link href="/menu" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

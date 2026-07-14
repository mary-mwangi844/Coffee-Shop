'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getMenuItem } from '@/lib/menu-catalog'
import TiltMedia from '@/components/TiltMedia'
import { addToCart as pushCart } from '@/lib/cart'

export default function ProductDetailPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = getMenuItem(String(params.id))

  if (!product) {
    return (
      <div className="product-detail-page">
        <header className="page-intro anim-rise">
          <h1>Product not found</h1>
          <Link href="/menu" className="btn btn-primary">
            Back to Menu
          </Link>
        </header>
      </div>
    )
  }

  const handleAdd = () => {
    pushCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <TiltMedia className="product-image anim-rise" maxTilt={5}>
          <img src={product.image} alt={product.name} />
          {product.signature && (
            <span className="menu-badge menu-badge-featured">Signature</span>
          )}
        </TiltMedia>
        <div className="product-info anim-rise anim-rise-2">
          <p className="page-kicker">
            {product.category === 'pastry'
              ? 'Pastry case'
              : product.category === 'cold'
                ? 'Cold bar'
                : product.category === 'specialty'
                  ? 'Signature'
                  : 'Espresso bar'}
          </p>
          <h1>{product.name}</h1>
          {product.origin && <p className="menu-origin">{product.origin}</p>}
          <p className="product-note-line">{product.note}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-price">KES {product.price}</p>

          <div className="quantity-selector">
            <button
              type="button"
              className="quantity-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              type="button"
              className="quantity-btn"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <p className="total-price">Total: KES {product.price * quantity}</p>

          <button
            type="button"
            className="btn btn-primary btn-add-cart btn-shine"
            onClick={handleAdd}
          >
            {added ? 'Added to cart' : 'Add to Cart'}
          </button>

          <Link href="/menu" className="btn btn-secondary">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  )
}

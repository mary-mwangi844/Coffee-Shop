'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const products: Record<
  string,
  {
    id: number
    name: string
    price: number
    image: string
    description: string
  }
> = {
  '1': {
    id: 1,
    name: 'Espresso',
    price: 200,
    image:
      'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=900&h=1100&fit=crop',
    description:
      'A rich and bold espresso shot made from freshly ground coffee beans. Perfect for a quick energy boost or as a base for other coffee drinks.',
  },
  '2': {
    id: 2,
    name: 'Americano',
    price: 250,
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&h=1100&fit=crop',
    description:
      'Smooth americano made by adding hot water to espresso, creating a rich coffee with the same strength but different flavour profile.',
  },
  '3': {
    id: 3,
    name: 'Cappuccino',
    price: 300,
    image:
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=900&h=1100&fit=crop',
    description:
      'Classic cappuccino with equal parts espresso, steamed milk, and milk foam. A perfect balance of strong coffee and creamy texture.',
  },
  '4': {
    id: 4,
    name: 'Latte',
    price: 350,
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&h=1100&fit=crop',
    description:
      'Smooth and creamy latte made with espresso and steamed milk, topped with a light layer of foam.',
  },
  '5': {
    id: 5,
    name: 'Mocha',
    price: 400,
    image:
      'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=900&h=1100&fit=crop',
    description:
      'Delicious mocha combining espresso with chocolate and steamed milk, topped with whipped cream.',
  },
  '6': {
    id: 6,
    name: 'Macchiato',
    price: 320,
    image:
      'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=900&h=1100&fit=crop',
    description:
      'Espresso macchiato featuring a shot of espresso with a small dollop of foamed milk on top.',
  },
  '7': {
    id: 7,
    name: 'Flat White',
    price: 380,
    image:
      'https://images.unsplash.com/photo-1534778101976-62847782c213?w=900&h=1100&fit=crop',
    description:
      'Velvety flat white made with espresso and microfoam, creating a smooth texture with a strong coffee flavour.',
  },
  '8': {
    id: 8,
    name: 'Cold Brew',
    price: 280,
    image:
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=900&h=1100&fit=crop',
    description:
      'Smooth cold brew steeped for 12–24 hours in cold water—less acidic and naturally sweet.',
  },
  '9': {
    id: 9,
    name: 'Iced Coffee',
    price: 260,
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&h=1100&fit=crop',
    description:
      'Refreshing iced coffee made with hot-brewed coffee poured over ice.',
  },
  '10': {
    id: 10,
    name: 'Affogato',
    price: 450,
    image:
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=900&h=1100&fit=crop',
    description:
      'Italian affogato: vanilla ice cream drowned in hot espresso. Hot meets cold.',
  },
  '11': {
    id: 11,
    name: 'Chocolate Cake',
    price: 450,
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&h=1100&fit=crop',
    description:
      'Decadent chocolate cake with premium cocoa and rich ganache—perfect beside our coffee.',
  },
  '12': {
    id: 12,
    name: 'Red Velvet Cake',
    price: 480,
    image:
      'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=900&h=1100&fit=crop',
    description:
      'Classic red velvet with cream cheese frosting—moist, tender, and striking.',
  },
  '13': {
    id: 13,
    name: 'Cheesecake',
    price: 420,
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900&h=1100&fit=crop',
    description:
      'Creamy New York-style cheesecake with a graham cracker crust.',
  },
  '14': {
    id: 14,
    name: 'Carrot Cake',
    price: 400,
    image:
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=900&h=1100&fit=crop',
    description:
      'Moist carrot cake with grated carrots, walnuts, warm spices, and creamy frosting.',
  },
  '15': {
    id: 15,
    name: 'Tiramisu',
    price: 500,
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&h=1100&fit=crop',
    description:
      'Espresso-soaked ladyfingers, mascarpone, and cocoa—classic Italian tiramisu.',
  },
  '16': {
    id: 16,
    name: 'Brownie',
    price: 350,
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&h=1100&fit=crop',
    description:
      'Fudgy chocolate brownie with a crackly top and gooey centre.',
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products[String(params.id)]

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

  const addToCart = () => {
    const cartItem = {
      ...product,
      quantity,
      totalPrice: product.price * quantity,
    }
    try {
      const existing = localStorage.getItem('cart')
      const cart = existing ? JSON.parse(existing) : []
      cart.push(cartItem)
      localStorage.setItem('cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cart-change'))
      setAdded(true)
      setTimeout(() => setAdded(false), 1800)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image anim-rise">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info anim-rise anim-rise-2">
          <p className="page-kicker">From the menu</p>
          <h1>{product.name}</h1>
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
            className="btn btn-primary btn-add-cart"
            onClick={addToCart}
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

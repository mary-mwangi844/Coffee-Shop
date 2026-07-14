'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function MenuPage() {
  const [cart, setCart] = useState<
    Array<{
      id: number
      name: string
      price: number
      image: string
      description: string
      quantity: number
      totalPrice: number
    }>
  >([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) setCart(JSON.parse(saved))
    } catch {
      /* ignore */
    }
  }, [])

  const drinks = [
    {
      id: 1,
      name: 'Espresso',
      price: 200,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop',
      description: 'Rich and bold espresso shot'
    },
    {
      id: 2,
      name: 'Americano',
      price: 250,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop',
      description: 'Smooth americano with hot water'
    },
    {
      id: 3,
      name: 'Cappuccino',
      price: 300,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
      description: 'Creamy cappuccino with foam'
    },
    {
      id: 4,
      name: 'Latte',
      price: 350,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
      description: 'Smooth latte with steamed milk'
    },
    {
      id: 5,
      name: 'Mocha',
      price: 400,
      image: 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=400&h=400&fit=crop',
      description: 'Chocolate mocha with whipped cream'
    },
    {
      id: 6,
      name: 'Macchiato',
      price: 320,
      image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop',
      description: 'Espresso with a dollop of foam'
    },
    {
      id: 7,
      name: 'Flat White',
      price: 380,
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=400&fit=crop',
      description: 'Velvety flat white with microfoam'
    },
    {
      id: 8,
      name: 'Cold Brew',
      price: 280,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop',
      description: 'Smooth cold brew coffee'
    },
    {
      id: 9,
      name: 'Iced Coffee',
      price: 260,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
      description: 'Refreshing iced coffee'
    },
    {
      id: 10,
      name: 'Affogato',
      price: 450,
      image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=400&fit=crop',
      description: 'Espresso over vanilla ice cream'
    }
  ]

  const cakes = [
    {
      id: 11,
      name: 'Chocolate Cake',
      price: 450,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
      description: 'Decadent chocolate cake'
    },
    {
      id: 12,
      name: 'Red Velvet Cake',
      price: 480,
      image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&h=400&fit=crop',
      description: 'Classic red velvet with cream cheese frosting'
    },
    {
      id: 13,
      name: 'Cheesecake',
      price: 420,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop',
      description: 'Creamy New York cheesecake'
    },
    {
      id: 14,
      name: 'Carrot Cake',
      price: 400,
      image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop',
      description: 'Moist carrot cake with walnuts'
    },
    {
      id: 15,
      name: 'Tiramisu',
      price: 500,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop',
      description: 'Classic Italian tiramisu'
    },
    {
      id: 16,
      name: 'Brownie',
      price: 350,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop',
      description: 'Fudgy chocolate brownie'
    }
  ]

  const addToCart = (product: {
    id: number
    name: string
    price: number
    image: string
    description: string
  }) => {
    const item = {
      ...product,
      quantity: 1,
      totalPrice: product.price,
    }
    const next = [...cart, item]
    setCart(next)
    localStorage.setItem('cart', JSON.stringify(next))
    window.dispatchEvent(new Event('cart-change'))
  }

  return (
    <div className="menu-page">
      <header className="menu-hero anim-rise">
        <h1>Our Menu</h1>
        <p>Drinks and cakes, roasted and baked for the room you&apos;re in.</p>
      </header>

      <section className="menu-section">
        <h2 className="menu-section-title">Drinks</h2>
        <div className="menu-grid">
          {drinks.map((drink, index) => (
            <article
              key={drink.id}
              className="menu-item"
              style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
            >
              <Link href={`/product/${drink.id}`} className="menu-item-media">
                <img src={drink.image} alt={drink.name} />
              </Link>
              <h3>{drink.name}</h3>
              <p>{drink.description}</p>
              <p className="price">KES {drink.price}</p>
              <button
                type="button"
                className="btn btn-primary btn-add-cart"
                onClick={() => addToCart(drink)}
              >
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="menu-section">
        <h2 className="menu-section-title">Cakes</h2>
        <div className="menu-grid">
          {cakes.map((cake, index) => (
            <article
              key={cake.id}
              className="menu-item"
              style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
            >
              <Link href={`/product/${cake.id}`} className="menu-item-media">
                <img src={cake.image} alt={cake.name} />
              </Link>
              <h3>{cake.name}</h3>
              <p>{cake.description}</p>
              <p className="price">KES {cake.price}</p>
              <button
                type="button"
                className="btn btn-primary btn-add-cart"
                onClick={() => addToCart(cake)}
              >
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      </section>

      {cart.length > 0 && (
        <div className="cart-summary">
          <Link href="/cart" className="btn btn-primary">
            View Cart ({cart.length} items)
          </Link>
        </div>
      )}
    </div>
  )
}

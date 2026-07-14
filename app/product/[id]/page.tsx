'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState<any[]>([])

  const products: { [key: string]: any } = {
    '1': {
      id: 1,
      name: 'Espresso',
      price: 200,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&h=600&fit=crop',
      description: 'A rich and bold espresso shot made from freshly ground coffee beans. Perfect for a quick energy boost or as a base for other coffee drinks.'
    },
    '2': {
      id: 2,
      name: 'Americano',
      price: 250,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop',
      description: 'Smooth americano made by adding hot water to espresso, creating a rich coffee with the same strength but different flavor profile.'
    },
    '3': {
      id: 3,
      name: 'Cappuccino',
      price: 300,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=600&fit=crop',
      description: 'Classic cappuccino with equal parts espresso, steamed milk, and milk foam. A perfect balance of strong coffee and creamy texture.'
    },
    '4': {
      id: 4,
      name: 'Latte',
      price: 350,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop',
      description: 'Smooth and creamy latte made with espresso and steamed milk, topped with a light layer of foam. Perfect for those who prefer a milder coffee.'
    },
    '5': {
      id: 5,
      name: 'Mocha',
      price: 400,
      image: 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=600&h=600&fit=crop',
      description: 'Delicious mocha combining espresso with chocolate and steamed milk, topped with whipped cream. A perfect treat for chocolate lovers.'
    },
    '6': {
      id: 6,
      name: 'Macchiato',
      price: 320,
      image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&h=600&fit=crop',
      description: 'Espresso macchiato featuring a shot of espresso with a small dollop of foamed milk on top. Strong coffee with a hint of creaminess.'
    },
    '7': {
      id: 7,
      name: 'Flat White',
      price: 380,
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&h=600&fit=crop',
      description: 'Velvety flat white made with espresso and microfoam, creating a smooth texture with a strong coffee flavor. Originating from Australia.'
    },
    '8': {
      id: 8,
      name: 'Cold Brew',
      price: 280,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&h=600&fit=crop',
      description: 'Smooth cold brew coffee steeped for 12-24 hours in cold water, resulting in a less acidic and naturally sweet flavor profile.'
    },
    '9': {
      id: 9,
      name: 'Iced Coffee',
      price: 260,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop',
      description: 'Refreshing iced coffee made with hot-brewed coffee poured over ice. A perfect choice for hot days or when you need a cool caffeine boost.'
    },
    '10': {
      id: 10,
      name: 'Affogato',
      price: 450,
      image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&h=600&fit=crop',
      description: 'Italian dessert affogato featuring a scoop of vanilla ice cream drowned in hot espresso. A perfect combination of hot and cold.'
    },
    '11': {
      id: 11,
      name: 'Chocolate Cake',
      price: 450,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop',
      description: 'Decadent chocolate cake made with premium cocoa and rich chocolate ganache. A perfect companion to our coffee drinks.'
    },
    '12': {
      id: 12,
      name: 'Red Velvet Cake',
      price: 480,
      image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&h=600&fit=crop',
      description: 'Classic red velvet cake with cream cheese frosting. Moist, tender, and visually stunning with its signature red color.'
    },
    '13': {
      id: 13,
      name: 'Cheesecake',
      price: 420,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=600&fit=crop',
      description: 'Creamy New York-style cheesecake with a graham cracker crust. Rich, smooth, and perfectly balanced sweetness.'
    },
    '14': {
      id: 14,
      name: 'Carrot Cake',
      price: 400,
      image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=600&fit=crop',
      description: 'Moist carrot cake loaded with grated carrots, walnuts, and warm spices, topped with creamy frosting. A wholesome treat.'
    },
    '15': {
      id: 15,
      name: 'Tiramisu',
      price: 500,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=600&fit=crop',
      description: 'Classic Italian tiramisu made with espresso-soaked ladyfingers, mascarpone cheese, and dusted with cocoa powder.'
    },
    '16': {
      id: 16,
      name: 'Brownie',
      price: 350,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop',
      description: 'Fudgy chocolate brownie with a crackly top and gooey center. Rich, dense, and intensely chocolatey.'
    }
  }

  const product = products[params.id as string]

  if (!product) {
    return (
      <div className="product-detail-page">
        <h1>Product Not Found</h1>
        <Link href="/menu" className="btn btn-primary">Back to Menu</Link>
      </div>
    )
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const addToCart = () => {
    const cartItem = {
      ...product,
      quantity: quantity,
      totalPrice: product.price * quantity
    }
    setCart([...cart, cartItem])
    alert(`${product.name} (${quantity}x) added to cart!`)
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-price">KES {product.price}</p>
          
          <div className="quantity-selector">
            <button className="quantity-btn" onClick={decreaseQuantity}>-</button>
            <span className="quantity-value">{quantity}</span>
            <button className="quantity-btn" onClick={increaseQuantity}>+</button>
          </div>
          
          <p className="total-price">Total: KES {product.price * quantity}</p>
          
          <button className="btn btn-primary btn-add-cart" onClick={addToCart}>
            Add to Cart
          </button>
          
          <Link href="/menu" className="btn btn-secondary">Back to Menu</Link>
        </div>
      </div>
    </div>
  )
}

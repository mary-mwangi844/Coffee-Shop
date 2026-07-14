import Link from 'next/link'

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: 'Espresso',
      price: 200,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop',
      description: 'Rich and bold espresso shot'
    },
    {
      id: 2,
      name: 'Cappuccino',
      price: 300,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
      description: 'Creamy cappuccino with foam'
    },
    {
      id: 3,
      name: 'Chocolate Cake',
      price: 450,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
      description: 'Decadent chocolate cake'
    },
    {
      id: 4,
      name: 'Latte',
      price: 350,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
      description: 'Smooth latte with steamed milk'
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Maya's Coffee Shop</h1>
          <p>Where every cup tells a story</p>
          <div className="hero-buttons">
            <Link href="/menu" className="btn btn-primary">Order Now</Link>
            <Link href="/menu" className="btn btn-secondary">View Menu</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&h=600&fit=crop" alt="Large Coffee" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">KES {product.price}</p>
              <Link href={`/product/${product.id}`} className="btn btn-view">View Details</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">☕</div>
            <h3>Fresh Beans</h3>
            <p>We source the finest coffee beans from around the world</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📶</div>
            <h3>Free WiFi</h3>
            <p>Stay connected while enjoying your favorite coffee</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable delivery to your doorstep</p>
          </div>
        </div>
      </section>
    </div>
  )
}

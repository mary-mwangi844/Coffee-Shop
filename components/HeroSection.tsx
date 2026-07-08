export default function HeroSection() {
  return (
    <section id="home">
      <div className="hero-bg-elements">
        <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&h=800&fit=crop" alt="Coffee Background" className="hero-bg-image" />
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1>Welcome to <span>MAYA'S</span> COFFEE SHOP</h1>
          <p>Where every cup tells a story. Experience the finest blends crafted with passion, precision, and the perfect roast. From bean to brew, we bring you coffee that warms the soul.</p>
          <a href="/coffee" className="cta-btn">Explore Our Menu</a>
        </div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=600&fit=crop" alt="Coffee Cup" className="hero-image" />
        </div>
      </div>
    </section>
  )
}

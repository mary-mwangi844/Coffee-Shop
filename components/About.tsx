export default function About() {
  return (
    <section id="about" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1920&h=1080&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', paddingTop: '100px' }}>
      <h2 className="section-title">About Us</h2>
      <p className="section-subtitle">Our story, our passion, our coffee</p>

      <div className="about-content">
        <div className="about-text">
          <h3>Brewing Dreams Since 2015</h3>
          <p>MAYA'S COFFEE SHOP began with a simple belief: that great coffee brings people together. Founded by Maya, our shop is located in the heart of Nairobi, Kenya. From a tiny corner café to a beloved community gathering place, we've been serving the finest coffee to our community for years.</p>
          <p>We source our beans directly from sustainable farms in Ethiopia, Colombia, and Guatemala, ensuring fair wages for farmers and the highest quality for our customers. Every batch is roasted in small quantities to preserve the unique flavor notes of each origin.</p>
          <p>Whether you're a coffee connoisseur or just beginning your journey, our baristas are here to guide you through our menu and help you discover your perfect cup.</p>

          <div className="about-stats">
            <div className="stat">
              <span className="stat-number">8+</span>
              <span className="stat-label">Years</span>
            </div>
            <div className="stat">
              <span className="stat-number">50K</span>
              <span className="stat-label">Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">12</span>
              <span className="stat-label">Origins</span>
            </div>
          </div>
        </div>
        <div className="about-image">
          <div className="about-visual">
            <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=300&fit=crop" alt="Coffee Shop" />
          </div>
        </div>
      </div>
    </section>
  )
}

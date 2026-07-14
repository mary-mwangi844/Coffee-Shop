export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-background">
          <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=600&fit=crop" alt="Coffee Shop Background" />
        </div>
        <div className="about-content">
          <h1>About Maya's Coffee Shop</h1>
          <p>Where every cup tells a story</p>
        </div>
      </div>
      
      <div className="about-section">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            Welcome to Maya's Coffee Shop, a cozy haven for coffee enthusiasts in the heart of Westlands. 
            Founded with a passion for bringing the finest coffee experiences to our community, we believe 
            that every cup of coffee should be a moment to savor and enjoy.
          </p>
          <p>
            Our journey began with a simple dream: to create a space where people could escape the hustle 
            and bustle of everyday life and indulge in the art of coffee. We source our beans from the most 
            renowned coffee-growing regions, ensuring that each sip delivers the perfect balance of flavor, 
            aroma, and freshness.
          </p>
          <p>
            At Maya's Coffee Shop, we're more than just a coffee destination – we're a community. Whether 
            you're here to work, catch up with friends, or simply enjoy a quiet moment with your favorite 
            brew, our warm and inviting atmosphere makes every visit special.
          </p>
        </div>
        
        <div className="about-mission">
          <h2>Our Mission</h2>
          <p>
            To serve the highest quality coffee and create memorable experiences for every customer, 
            one cup at a time. We are committed to sustainability, fair trade practices, and supporting 
            local farmers who share our passion for exceptional coffee.
          </p>
        </div>
        
        <div className="about-values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Quality</h3>
              <p>We never compromise on the quality of our coffee and ingredients.</p>
            </div>
            <div className="value-card">
              <h3>Community</h3>
              <p>We foster a welcoming space for everyone who walks through our doors.</p>
            </div>
            <div className="value-card">
              <h3>Sustainability</h3>
              <p>We're committed to environmentally friendly practices and ethical sourcing.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>We continuously explore new flavors and brewing techniques.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

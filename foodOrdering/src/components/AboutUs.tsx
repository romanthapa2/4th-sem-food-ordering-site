import React from 'react';
import './AboutUs.css';

export const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">About Us</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="main-content">
        <div className="content-wrapper">
          {/* Feature Image */}
          <div className="feature-image">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=600&fit=crop" 
              alt="Our facility and products" 
            />
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <h2 className="stat-number">2011</h2>
              <h3 className="stat-label">Founded</h3>
              <p className="stat-description">
                Founded in <strong>2011</strong> by <strong>Sangeeta Pandey</strong> with just <strong>Rs. 3,000</strong> and a passion for homemade flavors, <strong>Aama Ko Achar</strong> has grown from a home kitchen into Nepal's leading pickle brand.
              </p>
            </div>

            <div className="stat-card">
              <h2 className="stat-number">50+</h2>
              <h3 className="stat-label">Countries Worldwide</h3>
            </div>

            <div className="stat-card">
              <h2 className="stat-number">90%</h2>
              <h3 className="stat-label">Export Products</h3>
            </div>

            <div className="stat-card">
              <h2 className="stat-number">100+</h2>
              <h3 className="stat-label">Team Members</h3>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mission-section">
            <h3 className="section-title">Our Mission</h3>
            <p className="section-text">
              Today, we export 90% of our products to over 50 countries, bringing authentic Nepali taste to homes worldwide. Made with fresh, local ingredients and traditional recipes, our pickles and spice blends are handcrafted at our <strong>Chandragiri facility</strong> by a team of 100+—delivering the warmth of home in every jar.
            </p>
          </div>

          {/* Values Section */}
          <div className="values-section">
            <h3 className="section-title">Our Values</h3>
            <div className="values-grid">
              <div className="value-card">
                <h4 className="value-title">Fresh Ingredients</h4>
                <p className="value-description">
                  Using only the finest local ingredients sourced from trusted farmers
                </p>
              </div>

              <div className="value-card">
                <h4 className="value-title">Traditional Recipes</h4>
                <p className="value-description">
                  Authentic flavors passed down through generations of Nepali families
                </p>
              </div>

              <div className="value-card">
                <h4 className="value-title">Handcrafted Quality</h4>
                <p className="value-description">
                  Made with care and attention to detail in every single jar
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <h4 className="cta-title">Bringing Nepal to Your Table</h4>
            <p className="cta-description">
              From our family kitchen in Chandragiri to your dining table across the globe, every jar carries the authentic taste of Nepal and the love of homemade cooking.
            </p>
            <button className="cta-button">Taste the Tradition</button>
          </div>
        </div>
      </section>
    </div>
  );
};
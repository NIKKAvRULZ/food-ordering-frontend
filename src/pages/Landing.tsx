import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="landing-container">
      <section className="hero-section">
        <div className="hero-content">
          <span className="status-pill">System Online</span>
          <h1>Gourmet Express</h1>
          <p>Experience the future of food delivery, powered by a distributed microservice architecture.</p>
          <div className="cta-group">
            <Link to="/menu" className="btn-primary">Explore Menu</Link>
            <Link to="/register" className="btn-outline">Join the Network</Link>
          </div>
        </div>
      </section>

      <section className="service-hub">
        <h2>Active Microservices</h2>
        <div className="service-grid">
          <div className="service-node active">
            <div className="node-icon">👤</div>
            <h4>Identity Service</h4>
            <p>Status: Healthy (Render)</p>
          </div>
          <div className="service-node inactive">
            <div className="node-icon">🍔</div>
            <h4>Product Service</h4>
            <p>Status: Pending Integration</p>
          </div>
          <div className="service-node inactive">
            <div className="node-icon">📦</div>
            <h4>Order Service</h4>
            <p>Status: Pending Integration</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
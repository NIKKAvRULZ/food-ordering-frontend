import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-hero">
      <div className="status-badge">Service Status: LIVE</div>
      <h1>User Identity Microservice</h1>
      <p>
        A secure authentication and profile management hub built with 
        <strong> Spring Boot 3</strong> and deployed on <strong>Render</strong>.
      </p>
      
      <div className="features-grid">
        <div className="feature-card">
          <h3>🔐 Secure Auth</h3>
          <p>Registration and Login handled with encrypted pathways via Spring Security.</p>
        </div>
        <div className="feature-card">
          <h3>☁️ Cloud Native</h3>
          <p>Containerized with Docker and Pull-based CI/CD via GitHub Actions.</p>
        </div>
        <div className="feature-card">
          <h3>🛡️ DevSecOps</h3>
          <p>Continuous vulnerability monitoring with Snyk SAST integration.</p>
        </div>
      </div>

      <div className="cta-buttons">
        <Link to="/register" className="btn-primary">Create Account</Link>
        <Link to="/login" className="btn-secondary">Login to Profile</Link>
      </div>
    </div>
  );
};

export default Home;
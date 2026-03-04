import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user, statuses, logout } = useAuth();
  const navigate = useNavigate();

  // If no user is in context, redirect to login
  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <p style={{ color: 'var(--text-dim)' }}>Session expired. Please re-authenticate.</p>
        <Link to="/login" className="btn-gold">Go to Login</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 8%' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div className={`status-dot ${statuses.identity}`}></div>
          <span style={{ fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 700, color: 'var(--success)' }}>
            IDENTITY NODE: {statuses.identity.toUpperCase()}
          </span>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 300, margin: 0 }}>
          Welcome, <span style={{ color: 'var(--accent-gold)' }}>{user.username}</span>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
        {/* Main Content Area: Features */}
        <div className="glass-panel" style={{ padding: '40px' }}>
          <h3 style={{ marginBottom: '30px', fontWeight: 400 }}>System Capabilities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <FeatureCard 
              icon="🔐" 
              title="Secure Auth" 
              desc="Encrypted pathways via Spring Security 6." 
            />
            <FeatureCard 
              icon="☁️" 
              title="Cloud Native" 
              desc="Docker containerized on Render PaaS." 
            />
            <FeatureCard 
              icon="🛡️" 
              title="DevSecOps" 
              desc="Continuous Snyk SAST vulnerability monitoring." 
            />
          </div>
        </div>

        {/* Sidebar: Account Summary */}
        <div className="glass-panel" style={{ padding: '30px', height: 'fit-content' }}>
          <h4 style={{ color: 'var(--accent-gold)', marginTop: 0 }}>Account Summary</h4>
          <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', opacity: 0.5 }}>EMAIL</label>
              <span>{user.email}</span>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', opacity: 0.5 }}>DELIVERY ADDRESS</label>
              <span>{user.deliveryAddress || 'Not set'}</span>
            </div>
          </div>
          
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/menu" className="btn-gold" style={{ textAlign: 'center', fontSize: '0.85rem' }}>
              Order Gourmet Food
            </Link>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: '#fff', padding: '10px', borderRadius: '100px', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Feature Component
const FeatureCard = ({ icon, title, desc }: any) => (
  <div>
    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '10px' }}>{icon}</span>
    <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{title}</h4>
    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>{desc}</p>
  </div>
);

export default Home;
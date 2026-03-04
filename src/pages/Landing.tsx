import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing: React.FC = () => {
  const { statuses } = useAuth();

  return (
    <div className="landing-container" style={{ textAlign: 'center', padding: '100px 8%' }}>
      <h1 style={{ fontSize: '4.5rem', fontWeight: 200, letterSpacing: '-3px' }}>GOURMET<span style={{color: 'var(--accent-gold)'}}>EXPRESS</span></h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '40px' }}>Precision-engineered food delivery via distributed microservices.</p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <Link to="/menu" className="btn-gold">Explore Menu</Link>
        <Link to="/register" className="btn-gold" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: '#fff' }}>Register</Link>
      </div>

      <div className="glass-panel" style={{ marginTop: '80px', maxWidth: '800px', margin: '80px auto' }}>
        <h4 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '30px' }}>Network Status Hub</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <StatusItem label="Identity Node" status={statuses.identity} />
          <StatusItem label="Catalog Node" status={statuses.catalog} />
          <StatusItem label="Order Node" status={statuses.orders} />
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ label, status }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <div className={`status-dot ${status}`}></div>
    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{label}</span>
  </div>
);

export default Landing;
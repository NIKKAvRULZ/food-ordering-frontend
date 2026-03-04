import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing: React.FC = () => {
  const { statuses } = useAuth();

  return (
    <div className="landing-container" style={{ textAlign: 'center', padding: '100px 8%' }}>
      <h1 style={{ fontSize: '4.5rem', fontWeight: 200, letterSpacing: '-3px' }}>
        GOURMET<span style={{color: 'var(--accent-gold)'}}>EXPRESS</span>
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '40px' }}>
        Precision-engineered food delivery via distributed microservices.
      </p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <Link to="/menu" className="btn-gold">Explore Menu</Link>
        <Link to="/register" className="btn-gold" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: '#fff' }}>Register</Link>
      </div>

      <div className="glass-panel" style={{ marginTop: '80px', maxWidth: '800px', margin: '80px auto' }}>
        <h4 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '30px', opacity: 0.7 }}>
          Network Status Hub
        </h4>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <StatusItem label="Identity Node" status={statuses.identity} />
          <StatusItem label="Catalog Node" status={statuses.catalog} />
          <StatusItem label="Order Node" status={statuses.orders} />
          <StatusItem label="Payment Node" status={statuses.payment} />
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ label, status }: { label: string; status: string }) => {
  // Map internal status keys to display labels and colors
  const statusConfig: any = {
    live: { color: '#22c55e', label: 'LIVE' },
    pending: { color: '#fbbf24', label: 'PENDING' },
    down: { color: '#ef4444', label: 'DOWN' }
  };

  const current = statusConfig[status] || statusConfig.pending;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          width: '10px', 
          height: '10px', 
          borderRadius: '50%', 
          backgroundColor: current.color,
          boxShadow: `0 0 12px ${current.color}`,
          transition: 'all 0.5s ease'
        }}></div>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.5px' }}>{current.label}</span>
      </div>
      <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
};

export default Landing;
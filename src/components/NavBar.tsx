import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="brand-text">Gourmet.Express</div>
      <div className="nav-links" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/home" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link>
            <Link to="/menu" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Food Items</Link>
            <Link to="/payments" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Payments</Link>
            <Link to={`/profile/${user.id || 'me'}`} style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Profile</Link>
            <button onClick={handleLogout} className="btn-gold" style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Network</Link>
            <Link to="/admin/login" style={{ color: '#eab308', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Admin Gateway</Link>
            <Link to="/login" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
            <Link to="/register" className="btn-gold" style={{ padding: '8px 20px' }}>Join</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

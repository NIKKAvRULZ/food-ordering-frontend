import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fade-in" style={{ 
      position: 'fixed', 
      top: '20px', 
      left: '5%',
      right: '5%',
      margin: '0 auto',
      maxWidth: '1200px',
      height: '75px',
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(15px)',
      border: '1px solid var(--glass-border)',
      borderRadius: '25px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 40px',
      zIndex: 1000,
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    }}>
      <div className="brand-text" style={{ 
        fontSize: '1.4rem', 
        fontWeight: 800, 
        letterSpacing: '-1px',
        background: 'linear-gradient(90deg, #fff, var(--accent-gold))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        GOURMET<span style={{ fontWeight: 300, opacity: 0.8 }}>.EXPRESS</span>
      </div>

      <div className="nav-links" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        {user ? (
          <>
            <NavLink to="/home" active={isActive('/home')}>Home</NavLink>
            <NavLink to="/menu" active={isActive('/menu')}>Explore</NavLink>
            <NavLink to="/payments" active={isActive('/payments')}>Ledger</NavLink>
            <NavLink to={`/profile/${user.id || 'me'}`} active={location.pathname.startsWith('/profile')}>Identity</NavLink>
            <button onClick={handleLogout} style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: '#f87171',
              padding: '10px 22px',
              borderRadius: '100px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              transition: '0.3s'
            }}>Sign Out</button>
          </>
        ) : (
          <>
            <NavLink to="/" active={isActive('/')}>Network</NavLink>
            <NavLink to="/admin/login" active={isActive('/admin/login')} gold>Admin Gateway</NavLink>
            <NavLink to="/login" active={isActive('/login')}>Login</NavLink>
            <Link to="/register" className="btn-gold" style={{ padding: '12px 28px', fontSize: '0.9rem' }}>Join System</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, active, gold }: { to: string; children: React.ReactNode; active?: boolean, gold?: boolean }) => (
  <Link to={to} style={{ 
    color: gold ? 'var(--accent-gold)' : (active ? '#fff' : 'rgba(255,255,255,0.6)'), 
    textDecoration: 'none', 
    fontSize: '0.85rem',
    fontWeight: active || gold ? 700 : 500,
    letterSpacing: '0.5px',
    transition: '0.3s',
    borderBottom: active ? '2px solid var(--accent-gold)' : '2px solid transparent',
    padding: '4px 0'
  }}>
    {children}
  </Link>
);

export default NavBar;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NavBar: React.FC = () => {
    const { user, logout, statuses } = useAuth();
    const { cartItems, setCartOpen } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    // Check if any critical service is down
    const isSystemHealthy = statuses.identity === 'live' && statuses.orders === 'live';

    return (
        <nav style={{ 
            position: 'fixed', 
            top: scrolled ? '12px' : '28px', 
            left: '50%',
            transform: 'translateX(-50%)',
            width: scrolled ? '94%' : '90%',
            maxWidth: '1300px',
            height: scrolled ? '68px' : '88px',
            background: scrolled ? 'rgba(10, 15, 28, 0.85)' : 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(24px)',
            border: scrolled ? '1px solid rgba(251, 146, 60, 0.4)' : '1px solid var(--glass-border)',
            borderRadius: scrolled ? '24px' : '34px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 35px',
            zIndex: 3000,
            boxShadow: scrolled ? '0 25px 60px -15px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.1)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
            {/* 1. BRAND SECTION (LEFT) */}
            <div 
                onClick={() => navigate('/')} 
                className="nav-brand"
                style={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    transition: 'transform 0.3s ease'
                }}
            >
                <div style={{
                    width: scrolled ? '34px' : '42px',
                    height: scrolled ? '34px' : '42px',
                    background: 'linear-gradient(135deg, var(--accent-gold), #ea580c)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: scrolled ? '1.1rem' : '1.3rem',
                    fontWeight: 900,
                    color: '#fff',
                    transform: 'rotate(-8deg)',
                    boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)',
                    transition: 'all 0.5s ease'
                }}>G</div>
                <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    lineHeight: 1
                }}>
                    <div style={{ 
                        fontSize: scrolled ? '1rem' : '1.2rem', 
                        fontWeight: 900, 
                        letterSpacing: '1px',
                        color: '#fff',
                        textTransform: 'uppercase',
                        transition: 'font-size 0.5s ease'
                    }}>
                        Gourmet
                    </div>
                    <div style={{ 
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'var(--accent-gold)',
                        letterSpacing: '2.5px',
                        textTransform: 'uppercase',
                        marginTop: '2px',
                        opacity: 0.8
                    }}>Express</div>
                </div>
            </div>

            {/* 2. NAVIGATION LINKS (CENTERED) */}
            <div className="nav-links-center" style={{ 
                display: 'flex', 
                gap: '4px', 
                alignItems: 'center',
                background: user ? 'rgba(255,255,255,0.02)' : 'transparent',
                padding: user ? '6px' : '0',
                borderRadius: '100px',
                border: user ? '1px solid rgba(255,255,255,0.05)' : 'none',
                backdropFilter: user ? 'blur(5px)' : 'none'
            }}>
                {user ? (
                    <>
                        <NavLink to="/home" active={isActive('/home')}>Hub</NavLink>
                        <NavLink to="/menu" active={isActive('/menu')}>Kitchen</NavLink>
                        <NavLink to="/payments" active={isActive('/payments')}>Ledger</NavLink>
                    </>
                ) : (
                    <>
                        {/* <NavLink to="/" active={isActive('/')}>Portal</NavLink> */}
                    </>
                )}
            </div>

            {/* 3. ACTION SECTION (RIGHT) */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '8px 18px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    {/* Status Pip */}
                    <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: isSystemHealthy ? 'var(--success)' : '#ef4444',
                        boxShadow: `0 0 10px ${isSystemHealthy ? 'var(--success)' : '#ef4444'}`,
                        animation: 'blink 2s infinite'
                    }} title={isSystemHealthy ? "Global Operations: LIVE" : "System Degraded"}></div>

                    <div style={{ height: '16px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                    {/* Cart Trigger - ONLY SHOW IF USER LOGGED IN */}
                    {user ? (
                        <button 
                            onClick={() => setCartOpen(true)}
                            style={{ 
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'transform 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>🛒</span>
                            {cartItems.length > 0 && (
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '-6px', 
                                    right: '-8px', 
                                    background: 'var(--accent-gold)', 
                                    color: '#000', 
                                    width: '16px', 
                                    height: '16px', 
                                    borderRadius: '50%', 
                                    fontSize: '0.6rem', 
                                    fontWeight: 900,
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    border: '2px solid #0f172a'
                                }}>
                                    {cartItems.length}
                                </div>
                            )}
                        </button>
                    ) : (
                        <Link to="/admin/login" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textDecoration: 'none', fontWeight: 600 }}>ADMIN</Link>
                    )}
                </div>

                {user ? (
                    <>
                        <Link 
                            to={`/profile/${user.id || 'me'}`} 
                            style={{ 
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '5px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '100px',
                                border: `1px solid ${location.pathname.startsWith('/profile') ? 'var(--accent-gold)' : 'transparent'}`,
                                transition: '0.3s'
                            }}
                        >
                            <div style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '50%', 
                                background: 'var(--accent-gold)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '0.8rem', 
                                fontWeight: 900, 
                                color: '#000',
                                boxShadow: location.pathname.startsWith('/profile') ? '0 0 15px rgba(251, 146, 60, 0.3)' : 'none'
                             }}>
                                {(user.username || 'U').charAt(0).toUpperCase()}
                            </div>
                        </Link>

                        <button onClick={handleLogout} className="sign-out-trigger" title="Terminate Session">
                            <span style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏻</span>
                        </button>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, padding: '10px 15px' }}>Login</Link>
                        <Link to="/register" className="btn-gold" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>Join Now</Link>
                    </div>
                )}
            </div>

            <style>{`
                .nav-brand:hover { transform: scale(1.02); }
                .sign-out-trigger {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.25);
                    color: #f87171;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                    transition: all 0.3s ease;
                }
                .sign-out-trigger:hover {
                    background: #ef4444;
                    color: #fff;
                    box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
                    transform: rotate(90deg);
                }
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }
                @media (max-width: 900px) {
                    nav { padding: 0 20px !important; }
                    .nav-links-center { display: none !important; }
                }
            `}</style>
        </nav>
    );
};

const NavLink = ({ to, children, active, special }: { to: string; children: React.ReactNode; active?: boolean, special?: boolean }) => (
    <Link to={to} style={{ 
        color: special ? 'var(--accent-gold)' : (active ? '#fff' : 'rgba(255,255,255,0.5)'), 
        textDecoration: 'none', 
        fontSize: '0.75rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        padding: '10px 22px',
        borderRadius: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative'
    }}>
        {children}
        {active && (
            <div style={{
                position: 'absolute',
                bottom: '6px',
                width: '12px',
                height: '2px',
                borderRadius: '100px',
                background: 'var(--accent-gold)',
                boxShadow: '0 0 6px var(--accent-gold)'
            }}></div>
        )}
    </Link>
);

export default NavBar;



import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getMenuItems, getUserOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const Home: React.FC = () => {
    const { user, statuses } = useAuth();
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [orderCount, setOrderCount] = useState<number>(0);
    const dashRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            // Fetch Catalog Items
            if (statuses.catalog === 'live') {
                getMenuItems()
                    .then(res => {
                        if (res.data && res.data.success && Array.isArray(res.data.data)) {
                            let processedItems: any[] = res.data.data;
                            if (user?.vegan) {
                                processedItems = processedItems.filter((i: any) => i.vegan === true);
                            }
                            processedItems = processedItems.filter((i: any) => i.isAvailable !== false);
                            setMenuItems(processedItems.slice(0, 4));
                        }
                    })
                    .catch(err => console.error("Failed to fetch menu items", err));
            }

            // Fetch Real Order Count
            getUserOrders(user.id)
                .then(res => {
                    const orders = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                    setOrderCount(orders.length);
                })
                .catch(err => console.error("Failed to fetch order count", err));
        }
    }, [user, statuses.catalog]);

    useEffect(() => {
        // Dashboard entrance animation
        if (dashRef.current) {
            const ctx = gsap.context(() => {
                gsap.from('.dash-hero', { opacity: 0, scale: 0.95, duration: 1, ease: 'power3.out' });
                gsap.from('.cat-card', { 
                    opacity: 0, 
                    y: 20, 
                    duration: 0.8, 
                    stagger: 0.1, 
                    ease: 'back.out(1.7)',
                    delay: 0.2
                });
                gsap.from('.menu-card-home', { 
                    opacity: 0, 
                    x: -20, 
                    duration: 0.8, 
                    stagger: 0.15, 
                    ease: 'power2.out',
                    delay: 0.4 
                });
                gsap.from('.sidebar-panel', { 
                    opacity: 0, 
                    x: 30, 
                    duration: 1, 
                    ease: 'power3.out',
                    delay: 0.6 
                });
            }, dashRef);
            return () => ctx.revert();
        }
    }, [menuItems, orderCount]); // Re-animate if content loads late

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div ref={dashRef} style={{ padding: '40px 8%', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Hero Section */}
            <div className="dash-hero" style={{ 
                position: 'relative', 
                borderRadius: '30px', 
                overflow: 'hidden', 
                marginBottom: '40px',
                padding: '60px',
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.05) 100%)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '300px'
            }}>
                <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '300px', height: '300px', background: 'var(--accent-gold)', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span className="badge" style={{ marginBottom: '15px' }}>🚀 Fast Delivery in 30 Mins</span>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 10px 0', lineHeight: 1.1 }}>
                        Deliciousness <span style={{ color: 'var(--accent-gold)' }}>Delivered</span>
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '500px', marginBottom: '30px' }}>
                        Get the best flavors from our kitchen straight to your doorstep. Hot, fresh, and gourmet.
                    </p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to="/menu" className="btn-gold" style={{ padding: '12px 35px', textDecoration: 'none' }}>Explore Menu</Link>
                        <Link to="/orders" style={{ padding: '12px 35px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none', border: '1px solid var(--glass-border)', fontWeight: 600 }}>My Orders</Link>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }} className="responsive-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {/* Quick Categories */}
                    <div>
                        <h3 style={{ fontWeight: 600, marginBottom: '20px', fontSize: '1.5rem' }}>Popular Categories</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                            {['Burgers', 'Pizza', 'Desserts', 'Vegan'].map((cat, i) => (
                                <div key={i} className="glass-panel cat-card" style={{ padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{i === 0 ? '🍔' : i === 1 ? '🍕' : i === 2 ? '🍰' : '🥗'}</div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DYNAMIC: Integration Showcase Section */}
                    <div className="glass-panel" style={{ 
                        padding: '40px', 
                        borderLeft: `4px solid ${statuses.catalog === 'live' ? 'var(--accent-gold)' : '#ef4444'}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.5rem' }}>
                                {statuses.catalog === 'live' ? (user?.vegan ? '🌱 Curated Vegan Picks' : '🔥 Chef\'s Specials') : '⚠️ System Offline'}
                            </h3>
                            <Link to="/menu" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>See All →</Link>
                        </div>

                        {statuses.catalog === 'live' ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                                {menuItems.length > 0 ? menuItems.map((item, idx) => (
                                    <div key={idx} className="food-card menu-card-home">
                                        {item.imageUrl && (
                                           <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                                        )}
                                        <h4 style={{ margin: '8px 0 4px 0', fontSize: '1.1rem' }}>{item.name}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', height: '40px', overflow: 'hidden' }}>{item.description}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                            <span style={{ fontWeight: 800, color: '#fff' }}>LKR {item.price}</span>
                                            <button style={{ background: 'var(--accent-gold)', border: 'none', width: '30px', height: '30px', borderRadius: '50%', color: '#fff', cursor: 'pointer' }}>+</button>
                                        </div>
                                    </div>
                                )) : (
                                    <p style={{ fontStyle: 'italic', color: 'var(--text-dim)' }}>Initializing catalog...</p>
                                )}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)' }}>Catalog service is currently unavailable.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* User Profile Summary */}
                    <div className="glass-panel sidebar-panel" style={{ padding: '30px', borderTop: '4px solid var(--accent-gold)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#000', fontWeight: 800, flexShrink: 0 }}>
                                {(user.username || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <h4 style={{ margin: 0, fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.username}</h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)' }}>{user.email}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Dietary Mode:</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: user.vegan ? '#4ade80' : 'var(--accent-gold)' }}>{user.vegan ? '🌱 Vegan' : '🥩 Standard'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Order History:</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{orderCount} Total</span>
                            </div>
                        </div>

                        <Link to={`/profile/${user.id}`} className="btn-gold" style={{ 
                            width: '100%', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            boxSizing: 'border-box',
                            textDecoration: 'none', 
                            fontSize: '0.9rem' 
                        }}>
                            Edit My Profile
                        </Link>
                    </div>

                    {/* Service Status */}
                    <div className="glass-panel sidebar-panel" style={{ padding: '25px' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', letterSpacing: '1px', color: 'var(--text-dim)' }}>NETWORK STATUS</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <StatusItem label="Identity Service" status={statuses.identity} />
                            <StatusItem label="Catalog Service" status={statuses.catalog} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusItem = ({ label, status }: any) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: '0.8rem' }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{(status || 'pending').toUpperCase()}</span>
      <div className={`status-dot ${status}`} style={{ width: '8px', height: '8px' }}></div>
    </div>
  </div>
);

export default Home;
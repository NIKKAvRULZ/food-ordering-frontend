import React, { useEffect, useState } from 'react';
import { getMenuItems } from '../services/api';
import { useCart } from '../context/CartContext';

const MenuCatalog: React.FC = () => {
    const { addToCart } = useCart();
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<string>('All');

    useEffect(() => {
        getMenuItems()
            .then(res => {
                if (res.data && res.data.success && Array.isArray(res.data.data)) {
                    setMenuItems(res.data.data);
                }
            })
            .catch(err => console.error("Failed to fetch menu items", err))
            .finally(() => setLoading(false));
    }, []);

    const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.categoryName).filter(Boolean)))];

    const filteredItems = menuItems.filter(item => {
        return categoryFilter === 'All' || item.categoryName === categoryFilter;
    });

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
                <p style={{ fontStyle: 'italic', letterSpacing: '2px', color: 'var(--accent-gold)' }}>Loading Culinary Delights...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 8%', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '300px', height: '300px', background: 'var(--accent-gold)', filter: 'blur(150px)', opacity: 0.03, borderRadius: '50%' }}></div>

            <div className="fade-in" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ display: 'inline-block', padding: '6px 15px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '2px', marginBottom: '20px' }}>
                    CULINARY REPERTORY
                </div>
                <h1 style={{ fontSize: '4rem', margin: '0 0 15px 0', fontWeight: 800, letterSpacing: '-2px' }}>
                    The <span style={{ color: 'var(--accent-gold)' }}>Menu</span>
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>
                    A meticulously curated selection of gourmet experiences, synthesized for the modern palate and delivered via high-speed transit.
                </p>
            </div>

            <div style={{ 
                display: 'flex', 
                gap: '10px', 
                justifyContent: 'center', 
                marginBottom: '60px', 
                flexWrap: 'wrap',
                padding: '10px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '100px',
                width: 'fit-content',
                margin: '0 auto 60px',
                border: '1px solid var(--glass-border)'
            }}>
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setCategoryFilter(cat)}
                        style={{
                            background: categoryFilter === cat ? 'var(--accent-gold)' : 'transparent',
                            color: categoryFilter === cat ? '#000' : 'rgba(255,255,255,0.6)',
                            border: 'none',
                            padding: '10px 25px',
                            borderRadius: '100px',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            fontWeight: 700,
                            fontSize: '0.85rem'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '35px' }}>
                {filteredItems.length > 0 ? filteredItems.map((item, idx) => (
                    <div key={idx} className="food-card" style={{ padding: 0 }}>
                        {item.imageUrl && (
                            <div style={{ overflow: 'hidden', height: '240px' }}>
                                <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        <div style={{ padding: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <span style={{ fontSize: '0.65rem', background: 'rgba(251, 146, 60, 0.1)', color: 'var(--accent-gold)', padding: '5px 12px', borderRadius: '100px', fontWeight: 800, letterSpacing: '1px' }}>
                                    {item.categoryName.toUpperCase()}
                                </span>
                                <div className="status-dot live" />
                            </div>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', fontWeight: 800 }}>{item.name}</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-dim)', margin: '0 0 25px 0', lineHeight: 1.6, height: '3.2em', overflow: 'hidden' }}>
                                {item.description}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                                <div>
                                    <span style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
                                        LKR {Number(item.price || 0).toLocaleString()}
                                    </span>
                                </div>
                                <button 
                                    className="btn-gold" 
                                    style={{ padding: '12px 25px' }}
                                    onClick={() => addToCart(item)}
                                >
                                    Initialize Order
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px', background: 'rgba(255,255,255,0.01)', borderRadius: '35px', border: '1px dashed var(--glass-border)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📡</div>
                        <h3 style={{ color: 'var(--text-dim)', fontWeight: 300 }}>No spectral signatures found for this category.</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuCatalog;

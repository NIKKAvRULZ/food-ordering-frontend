import React, { useEffect, useState, useRef } from 'react';
import { getMenuItems, getCategories } from '../services/api';
import { useCart } from '../context/CartContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const MenuCatalog: React.FC = () => {
    const { addToCart } = useCart();
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const [categoriesMap, setCategoriesMap] = useState<Record<number, string>>({});
    const [dietaryFilter, setDietaryFilter] = useState<'All' | 'Vegan' | 'Non-Vegan'>('All');

    const catalogRef = useRef<HTMLDivElement>(null);

    const loadNormalMenu = async () => {
        setLoading(true);
        try {
            const [itemsRes, catsRes] = await Promise.all([getMenuItems(), getCategories()]);

            if (catsRes.data && Array.isArray(catsRes.data.data)) {
                const cmap: Record<number, string> = {};
                catsRes.data.data.forEach((c: any) => {
                    cmap[c.id] = c.name;
                });
                setCategoriesMap(cmap);
            }

            if (itemsRes.data && itemsRes.data.success && Array.isArray(itemsRes.data.data)) {
                setMenuItems(itemsRes.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch menu data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNormalMenu();
    }, []);

    const availableCategories = ['All', ...Object.values(categoriesMap)];

    const filteredItems = menuItems.filter(item => {
        const catName = item.categoryName || categoriesMap[item.categoryId] || 'General';
        const matchesCategory = categoryFilter === 'All' || catName === categoryFilter;
        const matchesDiet = dietaryFilter === 'All'
            || (dietaryFilter === 'Vegan' && item.vegan)
            || (dietaryFilter === 'Non-Vegan' && !item.vegan);

        return matchesCategory && matchesDiet;
    });

    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        if (!loading && catalogRef.current && !hasAnimatedRef.current && Object.keys(categoriesMap).length >= 0) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.catalog-header > *',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
                );

                gsap.fromTo('.filter-btn',
                    { scale: 0.9, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.05,
                        ease: 'back.out(1.7)',
                        delay: 0.3,
                        onComplete: function () {
                            gsap.set(this.targets(), { clearProps: 'scale,opacity' });
                        }
                    }
                );
            }, catalogRef);

            hasAnimatedRef.current = true;
            return () => ctx.revert();
        }
    }, [loading, categoriesMap]);

    useEffect(() => {
        if (!loading && catalogRef.current && filteredItems.length > 0) {
            const ctx = gsap.context(() => {
                const cards = gsap.utils.toArray('.menu-cat-card');
                cards.forEach((card: any, i) => {
                    gsap.fromTo(card,
                        { y: 60, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1,
                            delay: (i % 3) * 0.1,
                            ease: 'power4.out',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 90%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );

                    const img = card.querySelector('.card-parallax-img');
                    if (img) {
                        gsap.to(img, {
                            yPercent: 15,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: true
                            }
                        });
                    }
                });
            }, catalogRef);
            return () => ctx.revert();
        }
    }, [loading, filteredItems]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
                <p style={{ fontStyle: 'italic', letterSpacing: '2px', color: 'var(--accent-gold)' }}>Loading Culinary Delights...</p>
            </div>
        );
    }

    return (
        <div ref={catalogRef} style={{ padding: '40px 8%', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '300px', height: '300px', background: 'var(--accent-gold)', filter: 'blur(150px)', opacity: 0.03, borderRadius: '50%' }}></div>

            <div className="catalog-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'inline-block', padding: '6px 15px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '2px', marginBottom: '20px' }}>
                    CULINARY REPERTORY
                </div>
                <h1 style={{ fontSize: '4rem', margin: '0 0 15px 0', fontWeight: 800, letterSpacing: '-2px' }}>
                    The <span style={{ color: 'var(--accent-gold)' }}>Menu</span>
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>
                    A meticulously curated selection of gourmet experiences, synthesized for the modern palate.
                </p>
            </div>



            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '60px' }}>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '100px',
                    width: 'fit-content',
                    border: '1px solid var(--glass-border)'
                }}>
                    {availableCategories.map(cat => (
                        <button
                            key={cat}
                            className="filter-btn category-btn"
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

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.01)',
                    borderRadius: '100px',
                    width: 'fit-content',
                    border: '1px solid var(--glass-border)'
                }}>
                    {(['All', 'Vegan', 'Non-Vegan'] as const).map(diet => (
                        <button
                            key={diet}
                            className="filter-btn dietary-btn"
                            onClick={() => setDietaryFilter(diet)}
                            style={{
                                background: dietaryFilter === diet ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: dietaryFilter === diet ? 'var(--accent-gold)' : 'rgba(255,255,255,0.4)',
                                border: 'none',
                                padding: '8px 20px',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                letterSpacing: '1px'
                            }}
                        >
                            {diet === 'All' ? 'ALL DIETS' : diet.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '35px' }}>
                {filteredItems.length > 0 ? filteredItems.map((item, idx) => (
                    <div key={idx} className="food-card menu-cat-card" style={{ padding: 0, opacity: item.isAvailable ? 1 : 0.6 }}>
                        {item.imageUrl && (
                            <div style={{ overflow: 'hidden', height: '240px', position: 'relative' }}>
                                <img
                                    className="card-parallax-img"
                                    src={item.imageUrl}
                                    alt={item.name}
                                    style={{
                                        width: '100%',
                                        height: '120%',
                                        objectFit: 'cover',
                                        top: '-10%',
                                        position: 'relative',
                                        transition: 'opacity 0.5s'
                                    }}
                                />
                                {!item.isAvailable && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
                                        OUT OF STOCK
                                    </div>
                                )}
                            </div>
                        )}
                        <div style={{ padding: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.65rem', background: 'rgba(251, 146, 60, 0.1)', color: 'var(--accent-gold)', padding: '5px 12px', borderRadius: '100px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                        {item.categoryName || categoriesMap[item.categoryId] || 'General'}
                                    </span>
                                    {item.vegan ? (
                                        <span style={{
                                            fontSize: '0.65rem',
                                            background: 'rgba(34, 197, 94, 0.1)',
                                            color: '#22c55e',
                                            padding: '5px 12px',
                                            borderRadius: '100px',
                                            fontWeight: 800
                                        }}>
                                            🌱 VEGAN
                                        </span>
                                        ) : (
                                        <span style={{
                                            fontSize: '0.65rem',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            padding: '5px 12px',
                                            borderRadius: '100px',
                                            fontWeight: 800
                                        }}>
                                            🔴 NON-VEGAN
                                        </span>
                                        )}
                                </div>
                                <div className={`status-dot ${item.isAvailable ? 'live' : 'offline'}`} />
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
                                    style={{ padding: '12px 25px', opacity: item.isAvailable ? 1 : 0.5, cursor: item.isAvailable ? 'pointer' : 'not-allowed' }}
                                    onClick={() => item.isAvailable && addToCart(item)}
                                    disabled={!item.isAvailable}
                                >
                                    {item.isAvailable ? 'Initialize Order' : 'Sold Out'}
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
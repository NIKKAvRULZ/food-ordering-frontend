import React, { useEffect, useState } from 'react';
import { getMenuItems } from '../services/api';

const MenuCatalog: React.FC = () => {
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
    <div style={{ padding: '40px 8%', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="fade-in" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', fontWeight: 700 }}>Our <span style={{ color: 'var(--accent-gold)' }}>Menu</span></h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore our wide range of meticulously crafted dishes. Prepared fresh, delivered hot.
        </p>
      </div>

      {/* Categories Filter */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategoryFilter(cat)}
              style={{
                background: categoryFilter === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                color: categoryFilter === cat ? '#fff' : 'var(--text-dim)',
                border: '1px solid',
                borderColor: categoryFilter === cat ? 'var(--accent-gold)' : 'var(--glass-border)',
                padding: '8px 20px',
                borderRadius: '100px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: 500
              }}
            >
              {cat}
            </button>
          ))}
        </div>

      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
        {filteredItems.length > 0 ? filteredItems.map((item, idx) => (
          <div key={idx} className="food-card">
            {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '5px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>{item.name}</h3>
              <span style={{ fontSize: '0.75rem', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--accent-gold)', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>
                {item.categoryName}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: '5px 0 15px 0', lineHeight: 1.5, flexGrow: 1 }}>
              {item.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
                LKR {(item.price || 0).toFixed(2)}
              </span>
              <button style={{ background: 'var(--text-main)', color: '#000', padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Add to Cart
              </button>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', background: 'var(--glass)', borderRadius: '20px' }}>
            <h3 style={{ color: 'var(--text-dim)' }}>No items found for this category.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCatalog;

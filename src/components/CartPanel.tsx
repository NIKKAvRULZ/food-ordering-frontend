import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPanel: React.FC = () => {
    const { cartItems, isCartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const ORDER_URL = import.meta.env.VITE_ORDER_URL;

    const handlePlaceOrder = async () => {
        if (!user) {
            setError('Please login to place an order.');
            return;
        }

        if (cartItems.length === 0) return;

        setLoading(true);
        setError('');

        try {
            // Consolidate into a single order as per modern system requirements
            const orderPayload = {
                userId: user.id || user._id,
                status: 'pending',
                totalAmount: cartTotal,
                // Legacy support fields
                product: cartItems.length > 1 ? `${cartItems[0].name} + ${cartItems.length - 1} items` : cartItems[0].name,
                quantity: cartItems.reduce((acc, i) => acc + i.quantity, 0),
                price: cartTotal,
                // Modern structured items
                items: cartItems.map(item => ({
                    menuItemId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            };
            
            await axios.post(`${ORDER_URL}/orders`, orderPayload);

            clearCart();
            setCartOpen(false);
            navigate('/home'); 
            alert('Gourmet order synchronized successfully!');
        } catch (err: any) {
            console.error("Order Failure Trace:", err);
            const serverMsg = err.response?.data?.message || err.response?.data;
            setError(serverMsg || 'Failed to place order. Connection interference.');
        } finally {
            setLoading(false);
        }
    };


    if (!isCartOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(5px)',
        }} onClick={() => setCartOpen(false)}>
            <div 
                className="glass-panel" 
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    height: '100%',
                    borderRadius: '0',
                    borderLeft: '1px solid var(--glass-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '40px',
                    animation: 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <style>{`
                    @keyframes slideInRight {
                        from { transform: translateX(100%); }
                        to { transform: translateX(0); }
                    }
                `}</style>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>Your <span style={{ color: 'var(--accent-gold)' }}>Cart</span></h2>
                    <button 
                        onClick={() => setCartOpen(false)}
                        style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                    >✕</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '30px', paddingRight: '10px' }}>
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛒</div>
                            <p style={{ color: 'var(--text-dim)' }}>Your cart is empty. Sync with some gourmet items.</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} style={{ 
                                display: 'flex', 
                                gap: '20px', 
                                marginBottom: '25px', 
                                padding: '20px', 
                                background: 'rgba(255,255,255,0.02)', 
                                borderRadius: '20px',
                                border: '1px solid var(--glass-border)'
                            }}>
                                {item.imageUrl && (
                                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.name}</h4>
                                    <div style={{ color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '10px' }}>LKR {item.price.toLocaleString()}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '100px' }}>
                                            <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 5px' }}>-</button>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 5px' }}>+</button>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                                        >Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                            <span style={{ fontSize: '1.1rem', color: 'var(--text-dim)' }}>Total Aggregate</span>
                            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>LKR {cartTotal.toLocaleString()}</span>
                        </div>
                        
                        {error && <p style={{ color: '#f87171', textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</p>}
                        
                        <button 
                            className="btn-gold" 
                            style={{ width: '100%', padding: '20px', fontSize: '1.2rem' }}
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? 'Processing Transaction...' : 'Initiate Secure Checkout'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPanel;

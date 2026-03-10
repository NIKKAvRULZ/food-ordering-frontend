import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, getOrderStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types/user';

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { logout } = useAuth(); // Access logout from context
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileRes, ordersRes] = await Promise.all([
                    getUserProfile(id || ""),
                    getOrderStatus(id || "")
                ]);
                setUser(profileRes.data);
                setOrders(ordersRes.data);
            } catch (err) {
                console.error("Profile fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProfile();
    }, [id]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
                <div className="status-dot pending"></div>
                <span style={{ marginLeft: '10px', color: 'var(--text-dim)' }}>Synchronizing Identity Node...</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="glass-panel" style={{ maxWidth: '500px', margin: '100px auto', textAlign: 'center' }}>
                <p>Identity not found in the current network session.</p>
                <button className="btn-gold" onClick={() => navigate('/login')}>Return to Login</button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                        <span className="status-pill" style={{ fontSize: '0.6rem', marginBottom: '10px' }}>Identity Verified</span>
                        <h2 style={{ fontSize: '2rem', fontWeight: 300, margin: 0 }}>User <span style={{ color: 'var(--accent-gold)' }}>Profile</span></h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>NODE ID</span>
                        <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>#00{user.id}</span>
                    </div>
                </div>

                {/* Profile Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                    <div>
                        <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '1px' }}>Username</label>
                        <p style={{ fontSize: '1.1rem', margin: '5px 0' }}>{user.username}</p>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '1px' }}>Email Address</label>
                        <p style={{ fontSize: '1.1rem', margin: '5px 0' }}>{user.email}</p>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '1px' }}>Primary Delivery Address</label>
                        <p style={{ fontSize: '1.1rem', margin: '5px 0', color: 'var(--text-main)' }}>{user.deliveryAddress || 'No address provided'}</p>
                    </div>
                </div>

                {/* Order History Section */}
                <div style={{ marginTop: '20px', marginBottom: '40px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                    <h3 style={{ color: 'var(--accent-gold)', marginTop: 0, marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                        🕰️ Recent Order History
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {(() => {
                            let orderList = [];
                            try {
                                orderList = typeof orders === 'string' ? JSON.parse(orders) : orders;
                                if (!Array.isArray(orderList)) {
                                     orderList = orderList ? [orderList] : [];
                                }
                            } catch (e) {
                                // Fallback if parsing fails but string is not empty
                                if (orders && typeof orders === 'string') {
                                    return <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>{orders}</p>;
                                }
                            }

                            if (!orderList || orderList.length === 0) {
                                return <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>No past orders found.</p>;
                            }

                            return orderList.map((order: any, idx: number) => (
                                <div key={idx} style={{ 
                                    padding: '15px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid var(--glass-border)', 
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '1px', marginBottom: '5px', fontWeight: 600 }}>
                                            ORDER #{order.orderId || order.id || 'UKNOWN'}
                                        </div>
                                        <div style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
                                            Amount: <span style={{ fontWeight: 'bold' }}>LKR {order.amount || order.totalAmount || '0.00'}</span>
                                        </div>
                                        {(order.createdAt || order.timestamp) && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '5px' }}>
                                                {new Date(order.createdAt || order.timestamp).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <span style={{ 
                                            padding: '5px 12px', 
                                            borderRadius: '20px', 
                                            fontSize: '0.7rem', 
                                            fontWeight: 'bold',
                                            letterSpacing: '1px',
                                            background: (order.status === 'COMPLETED' || order.status === 'PAID' || order.status === 'SUCCESS') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                            color: (order.status === 'COMPLETED' || order.status === 'PAID' || order.status === 'SUCCESS') ? '#4ade80' : '#facc15'
                                        }}>
                                            {order.status || 'PENDING'}
                                        </span>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '30px', display: 'flex', gap: '15px' }}>
                    <button className="btn-gold" style={{ flex: 2 }} onClick={() => navigate('/home')}>Start Ordering</button>
                    <button 
                        className="btn-gold" 
                        style={{ flex: 1, background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}
                        onClick={handleLogout}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
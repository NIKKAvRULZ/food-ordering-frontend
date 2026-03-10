import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, getOrderStatus, getUserOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types/user';

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { logout } = useAuth(); // Access logout from context
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<any>(null); // Payments
    const [actualOrders, setActualOrders] = useState<any>(null); // Real Orders
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileRes, paymentRes, orderRes] = await Promise.all([
                    getUserProfile(id || ""),
                    getOrderStatus(id || ""),
                    getUserOrders(id || "")
                ]);
                setUser(profileRes.data);
                setOrders(paymentRes.data);
                setActualOrders(orderRes.data);
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

                {/* Payment History Section */}
                <div style={{ marginTop: '20px', marginBottom: '40px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                    <h3 style={{ color: 'var(--accent-gold)', marginTop: 0, marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                        💳 Payment Transactions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {(() => {
                            let orderList = [];
                            try {
                                let parsed = typeof orders === 'string' ? JSON.parse(orders) : orders;
                                // The API actually returns { success: true, data: { payments: [...] } } or { ... data: [...] }
                                if (parsed && parsed.data && parsed.data.payments && Array.isArray(parsed.data.payments)) {
                                    orderList = parsed.data.payments;
                                } else if (parsed && parsed.data && Array.isArray(parsed.data)) {
                                    orderList = parsed.data;
                                } else if (Array.isArray(parsed)) {
                                    orderList = parsed;
                                } else {
                                    orderList = parsed ? [parsed] : [];
                                }
                            } catch (e) {
                                if (orders && typeof orders === 'string') {
                                    return <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>{orders}</p>;
                                }
                            }

                            if (!orderList || orderList.length === 0) {
                                return <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>No past orders found.</p>;
                            }

                            return orderList.map((order: any, idx: number) => {
                                const orderId = order.orderId || order._id || 'UNKNOWN';
                                const amount = order.amount || (order.orderDetails && order.orderDetails.totalAmount) || 0;
                                const status = (order.status || 'PENDING').toUpperCase();
                                const dateStr = order.createdAt || order.updatedAt;
                                const description = order.description || 'Order Payment';

                                const isSuccess = status === 'SUCCEEDED' || status === 'COMPLETED' || status === 'PAID';
                                const isRefunded = status === 'REFUNDED';
                                
                                let badgeBg = 'rgba(234, 179, 8, 0.2)';
                                let badgeColor = '#facc15';
                                if (isSuccess) {
                                    badgeBg = 'rgba(34, 197, 94, 0.2)';
                                    badgeColor = '#4ade80';
                                } else if (isRefunded) {
                                    badgeBg = 'rgba(168, 85, 247, 0.2)';
                                    badgeColor = '#c084fc';
                                } else if (status === 'PROCESSING') {
                                    badgeBg = 'rgba(56, 189, 248, 0.2)';
                                    badgeColor = '#38bdf8';
                                }

                                return (
                                <div key={idx} style={{ 
                                    padding: '20px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid var(--glass-border)', 
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '1px', fontWeight: 700 }}>
                                                ORDER #{orderId}
                                            </span>
                                            {order.paymentMethod && (
                                                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-dim)' }}>
                                                    {String(order.paymentMethod).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 300 }}>
                                            {description} — <span style={{ fontWeight: 600 }}>${(Number(amount)).toFixed(2)}</span>
                                        </div>
                                        {dateStr && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <span>📅</span> {new Date(dateStr).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ 
                                            padding: '6px 14px', 
                                            borderRadius: '20px', 
                                            fontSize: '0.7rem', 
                                            fontWeight: 800,
                                            letterSpacing: '1px',
                                            background: badgeBg,
                                            color: badgeColor
                                        }}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                                );
                            });
                        })()}
                    </div>
                </div>

                {/* Direct Order History Section */}
                <div style={{ marginTop: '20px', marginBottom: '40px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                    <h3 style={{ color: 'var(--accent-gold)', marginTop: 0, marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                        📦 Genuine Order History
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {(() => {
                            let parsedOrders = [];
                            try {
                                let parsed = typeof actualOrders === 'string' ? JSON.parse(actualOrders) : actualOrders;
                                parsedOrders = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
                            } catch (e) {
                                // fallback ignoring
                            }

                            if (!parsedOrders || parsedOrders.length === 0) {
                                return <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>No direct orders found.</p>;
                            }

                            return parsedOrders.map((ord: any, idx: number) => {
                                const oId = ord.id || ord._id || 'UNKNOWN';
                                const prod = ord.product || 'Custom Order';
                                const qty = ord.quantity || 1;
                                const amt = ord.price || ord.totalAmount || 0;
                                const status = (ord.status || 'PENDING').toUpperCase();

                                let badgeBg = 'rgba(234, 179, 8, 0.2)';
                                let badgeColor = '#facc15';
                                if (status === 'COMPLETED' || status === 'DELIVERED') {
                                    badgeBg = 'rgba(34, 197, 94, 0.2)';
                                    badgeColor = '#4ade80';
                                } else if (status === 'CANCELLED') {
                                    badgeBg = 'rgba(239, 68, 68, 0.2)';
                                    badgeColor = '#ef4444';
                                } else if (status === 'PREPARING') {
                                    badgeBg = 'rgba(56, 189, 248, 0.2)';
                                    badgeColor = '#38bdf8';
                                }

                                return (
                                <div key={idx} style={{ 
                                    padding: '20px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid var(--glass-border)', 
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '1px', fontWeight: 700 }}>
                                                ORDER #{oId}
                                            </span>
                                            <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-dim)' }}>
                                                X{qty}
                                            </span>
                                        </div>
                                        <div style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 300 }}>
                                            {prod} — <span style={{ fontWeight: 600 }}>LKR {Number(amt).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ 
                                            padding: '6px 14px', 
                                            borderRadius: '20px', 
                                            fontSize: '0.7rem', 
                                            fontWeight: 800,
                                            letterSpacing: '1px',
                                            background: badgeBg,
                                            color: badgeColor
                                        }}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                                );
                            });
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
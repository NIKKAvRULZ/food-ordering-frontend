import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, getUserOrders, updateUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types/user';

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { logout } = useAuth(); // Access logout from context
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [actualOrders, setActualOrders] = useState<any>(null); // Real Orders
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<User>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileRes, orderRes] = await Promise.all([
                    getUserProfile(id || ""),
                    getUserOrders(id || "")
                ]);
                setUser(profileRes.data);
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

    const handleEditToggle = () => {
        if (!isEditing && user) {
            setEditForm(user);
        }
        setIsEditing(!isEditing);
    };

    const handleSaveProfile = async () => {
        if (!user || (!user.id && user.id !== 0)) return;
        setIsSaving(true);
        try {
            const res = await updateUserProfile(user.id, editForm);
            setUser(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="status-dot pending" style={{ width: '40px', height: '40px' }}></div>
                <span style={{ marginTop: '20px', color: 'var(--text-dim)', letterSpacing: '2px', fontSize: '0.8rem' }}>SYNCHRONIZING SECURE NODE...</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="glass-panel" style={{ maxWidth: '500px', width: '90%', textAlign: 'center', padding: '60px 40px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
                    <h2 style={{ marginBottom: '10px' }}>Access Denied</h2>
                    <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>Identity not found in the current network session.</p>
                    <button className="btn-gold" onClick={() => navigate('/login')}>Return to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container" style={{ 
            maxWidth: '1400px',
            margin: '0 auto',
            minHeight: '100vh',
            position: 'relative'
        }}>
            {/* Ambient Background */}
            <div style={{ position: 'fixed', top: '20%', left: '10%', width: '400px', height: '400px', background: 'var(--accent-gold)', filter: 'blur(150px)', opacity: 0.03, borderRadius: '50%', pointerEvents: 'none' }}></div>
            <div style={{ position: 'fixed', bottom: '20%', right: '10%', width: '300px', height: '300px', background: 'var(--accent-secondary)', filter: 'blur(120px)', opacity: 0.03, borderRadius: '50%', pointerEvents: 'none' }}></div>

            <div className="profile-layout-grid" style={{ position: 'relative', zIndex: 1 }}>
                
                {/* LEFT SIDEBAR: IDENTITY CARD */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div className="glass-panel fade-in" style={{ padding: '40px 30px', borderTop: '4px solid var(--accent-gold)', textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 25px' }}>
                            <div style={{ 
                                width: '100%', height: '100%', borderRadius: '50%', 
                                background: 'linear-gradient(135deg, var(--accent-gold) 0%, #b8860b 100%)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                fontSize: '3rem', color: '#000', fontWeight: 900,
                                boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)'
                            }}>
                                {(user.username || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div style={{ position: 'absolute', bottom: '5px', right: '5px', width: '24px', height: '24px', borderRadius: '50%', background: '#4ade80', border: '4px solid #1a1a1a', boxShadow: '0 0 10px #4ade80' }}></div>
                        </div>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 5px 0' }}>{user.username}</h2>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '35px' }}>{user.email}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Status</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80' }}>SECURE ACCESS</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ID Protocol</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>#{String(user.id).padStart(4, '0')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Joined</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>March 2024</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button className="btn-gold" style={{ width: '100%', padding: '14px' }} onClick={() => navigate('/home')}>Launch Dashboard</button>
                            <button 
                                onClick={handleLogout}
                                style={{ 
                                    width: '100%', padding: '14px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', 
                                    borderRadius: '100px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', transition: '0.3s'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
                            >
                                Terminate Session
                            </button>
                        </div>
                    </div>

                    {/* Network Status Widget */}
                    <div className="glass-panel" style={{ padding: '25px' }}>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '15px' }}>SECURE CONNECTION</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div className="status-dot live" style={{ width: '10px', height: '10px' }} />
                            <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>IDENTITY OVERRIDE ENCRYPTED</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT AREA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* NAV TABS */}
                    <div className="profile-tabs-container" style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '18px', border: '1px solid var(--glass-border)' }}>
                        <button 
                            className="profile-tab-btn"
                            onClick={() => setActiveTab('details')}
                            style={{ 
                                padding: '12px 30px', borderRadius: '14px', border: 'none', 
                                background: activeTab === 'details' ? 'var(--accent-gold)' : 'transparent',
                                color: activeTab === 'details' ? '#000' : '#fff',
                                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: '0.3s'
                            }}
                        >
                            Identity Specs
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            style={{ 
                                padding: '12px 30px', borderRadius: '14px', border: 'none', 
                                background: activeTab === 'history' ? 'var(--accent-gold)' : 'transparent',
                                color: activeTab === 'history' ? '#000' : '#fff',
                                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: '0.3s'
                            }}
                        >
                            History Log
                        </button>
                    </div>

                    {/* MAIN PANEL */}
                    <div className="glass-panel fade-in profile-main-panel" style={{ flex: 1 }}>
                        
                        {activeTab === 'details' ? (
                            <>
                                <div className="profile-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Identity <span style={{ color: 'var(--accent-gold)' }}>Configuration</span></h3>
                                        <p style={{ color: 'var(--text-dim)', margin: '5px 0 0 0' }}>Manage your account parameters and communication vectors.</p>
                                    </div>
                                    <button 
                                        className="btn-gold" 
                                        style={{ padding: '10px 25px', fontSize: '0.85rem' }}
                                        onClick={handleEditToggle}
                                    >
                                        {isEditing ? 'Cancel Edit' : '✎ Edit Parameters'}
                                    </button>
                                </div>

                                <div className="profile-details-grid">
                                    {isEditing ? (
                                        <>
                                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', display: 'block', marginBottom: '10px' }}>Protocol Alias</label>
                                                <input 
                                                    type="text" 
                                                    value={editForm.username || ''} 
                                                    onChange={(e) => setEditForm({...editForm, username: e.target.value})} 
                                                    style={{ width: '100%', fontSize: '1rem', padding: '15px' }} 
                                                />
                                            </div>
                                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', display: 'block', marginBottom: '10px' }}>Secure Email</label>
                                                <input 
                                                    type="email" 
                                                    value={editForm.email || ''} 
                                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
                                                    style={{ width: '100%', fontSize: '1rem', padding: '15px' }} 
                                                />
                                            </div>
                                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', display: 'block', marginBottom: '10px' }}>Delivery Coordinates</label>
                                                <input 
                                                    type="text" 
                                                    value={editForm.deliveryAddress || ''} 
                                                    onChange={(e) => setEditForm({...editForm, deliveryAddress: e.target.value})} 
                                                    style={{ width: '100%', fontSize: '1rem', padding: '15px' }} 
                                                />
                                            </div>
                                            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                                                <input 
                                                    type="checkbox" 
                                                    id="edit-vegan-check" 
                                                    checked={editForm.vegan || false} 
                                                    onChange={(e) => setEditForm({...editForm, vegan: e.target.checked})} 
                                                    style={{ accentColor: 'var(--accent-gold)', width: '22px', height: '22px' }} 
                                                />
                                                <div>
                                                    <label htmlFor="edit-vegan-check" style={{ fontSize: '1rem', fontWeight: 600, display: 'block' }}>Vegan Culinary Protocol</label>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Activating this will prioritize vegan-compliant nodes in the catalog.</span>
                                                </div>
                                            </div>
                                            <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                                                <button 
                                                    className="btn-gold" 
                                                    style={{ width: '100%', padding: '18px', fontSize: '1rem' }}
                                                    onClick={handleSaveProfile}
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? 'ENCRYPTING & UPLOADING...' : 'SAVE CONFIGURATION →'}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="glass-panel" style={{ padding: '25px', background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px' }}>IDENTITY HANDLE</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{user.username}</div>
                                            </div>
                                            <div className="glass-panel" style={{ padding: '25px', background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px' }}>SECURE EMAIL</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{user.email}</div>
                                            </div>
                                            <div className="glass-panel" style={{ gridColumn: 'span 2', padding: '25px', background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px' }}>DROP ZONE COORDINATES</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{user.deliveryAddress || 'NOT CONFIGURED'}</div>
                                            </div>
                                            <div className="glass-panel" style={{ gridColumn: 'span 2', padding: '25px', background: user.vegan ? 'rgba(74, 222, 128, 0.05)' : 'rgba(255,255,255,0.02)', borderLeft: user.vegan ? '4px solid #4ade80' : 'none' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px' }}>CULINARY LOGIC</div>
                                                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                                                            {user.vegan ? '🌱 PURE VEGAN OVERRIDE' : '🛒 STANDARD NUTRITION'}
                                                        </div>
                                                    </div>
                                                    <div style={{ fontSize: '2rem' }}>{user.vegan ? '🥗' : '🍱'}</div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="profile-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Transaction <span style={{ color: 'var(--accent-gold)' }}>Ledger</span></h3>
                                        <p style={{ color: 'var(--text-dim)', margin: '5px 0 0 0' }}>Synchronized log of all architectural service requests.</p>
                                    </div>
                                    <div className="badge" style={{ padding: '8px 20px' }}>LIVE SYNC</div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {(() => {
                                        let parsedOrders = [];
                                        try {
                                            let parsed = typeof actualOrders === 'string' ? JSON.parse(actualOrders) : actualOrders;
                                            parsedOrders = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
                                        } catch (e) {}

                                        if (!parsedOrders || parsedOrders.length === 0) {
                                            return (
                                                <div style={{ textAlign: 'center', padding: '80px 40px', background: 'rgba(255,255,255,0.01)', borderRadius: '30px', border: '1px dashed var(--glass-border)' }}>
                                                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛰️</div>
                                                    <h4 style={{ margin: '0 0 10px 0' }}>No Data Packets Found</h4>
                                                    <p style={{ color: 'var(--text-dim)', maxWidth: '300px', margin: '0 auto' }}>You haven't initiated any orders in the current protocol cycle.</p>
                                                </div>
                                            );
                                        }

                                        return parsedOrders.map((ord: any, idx: number) => {
                                            const oId = String(ord.id || ord._id || 'UNSET');
                                            const prod = ord.product || 'Classified Item';
                                            const qty = ord.quantity || 1;
                                            const amt = ord.price || ord.totalAmount || 0;
                                            const status = (ord.status || 'PENDING').toUpperCase();

                                            let statusColor = 'var(--accent-gold)';
                                            if (status === 'COMPLETED' || status === 'DELIVERED') statusColor = '#4ade80';
                                            else if (status === 'CANCELLED') statusColor = '#f87171';

                                            return (
                                                <div key={idx} className="glass-panel profile-order-card" style={{ 
                                                    borderLeft: `5px solid ${statusColor}`,
                                                    transition: '0.3s'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                                        <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                                                            📦
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-gold)', letterSpacing: '1px' }}>REQ #{oId.slice(-6).toUpperCase()}</span>
                                                                <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '2px 10px', borderRadius: '100px', fontWeight: 700 }}>{qty} UNITS</span>
                                                            </div>
                                                            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{prod}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>LKR {Number(amt).toLocaleString()}</div>
                                                        <div style={{ 
                                                            display: 'inline-flex', alignItems: 'center', gap: '8px', 
                                                            padding: '5px 15px', borderRadius: '100px', background: `${statusColor}15`, 
                                                            color: statusColor, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px'
                                                        }}>
                                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 8px ${statusColor}` }}></div>
                                                            {status}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .profile-container {
                    padding: 40px 8%;
                }
                .profile-tabs-container {
                    width: fit-content;
                }
                .profile-main-panel {
                    padding: 50px;
                }
                .profile-layout-grid {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 40px;
                }
                .profile-details-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 40px;
                }
                .profile-order-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 25px 35px;
                }
                
                @media (max-width: 992px) {
                    .profile-layout-grid {
                        grid-template-columns: 1fr;
                        gap: 30px;
                    }
                }
                
                @media (max-width: 768px) {
                    .profile-container {
                        padding: 20px 5%;
                    }
                    .profile-main-panel {
                        padding: 25px;
                    }
                    .profile-details-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .profile-panel-header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 20px;
                    }
                    .profile-order-card {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 20px !important;
                        gap: 15px;
                    }
                    .profile-tabs-container {
                        flex-direction: column;
                        width: 100% !important;
                    }
                    .profile-tab-btn {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;
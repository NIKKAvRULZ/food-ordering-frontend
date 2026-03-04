import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types/user';

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { logout } = useAuth(); // Access logout from context
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile(Number(id));
                setUser(response.data);
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

                {/* Footer Actions */}
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '30px', display: 'flex', gap: '15px' }}>
                    <button className="btn-gold" style={{ flex: 2 }} onClick={() => navigate('/menu')}>Start Ordering</button>
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
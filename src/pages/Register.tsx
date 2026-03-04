import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { User } from '../types/user';

const Register: React.FC = () => {
    const [formData, setFormData] = useState<User>({
        username: '',
        email: '',
        password: '',
        deliveryAddress: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); // Clear previous messages
        
        try {
            console.log("Sending to Backend:", formData); 
            setMessage('✅ Registration Successful! Redirecting to login...');
            
            // Auto-redirect after success to improve UX
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        } catch (error: any) {
            // Reads the "message" key from your GlobalExceptionHandler.java
            const serverMessage = error.response?.data?.message || "An unexpected error occurred.";
            setMessage(`❌ ${serverMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '60px 20px',
            minHeight: 'calc(100vh - 100px)' 
        }}>
            <div className="glass-panel" style={{ 
                width: '100%', 
                maxWidth: '500px',
                textAlign: 'left' // Ensure text alignment is consistent
            }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '8px' }}>Join the Network</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '32px' }}>
                    Create a secure identity for gourmet delivery.
                </p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Row 1: Username & Email */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '20px' 
                    }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Username</label>
                            <input 
                                type="text" 
                                placeholder="Nikka99"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required 
                                style={{ marginTop: '8px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Email</label>
                            <input 
                                type="email" 
                                placeholder="name@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required 
                                style={{ marginTop: '8px' }}
                            />
                        </div>
                    </div>

                    {/* Row 2: Password */}
                    <div className="form-group">
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required 
                            style={{ marginTop: '8px' }}
                        />
                    </div>

                    {/* Row 3: Delivery Address */}
                    <div className="form-group">
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Delivery Address</label>
                        <input 
                            type="text" 
                            placeholder="Street, City, Country"
                            value={formData.deliveryAddress}
                            onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                            required 
                            style={{ marginTop: '8px' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-gold" 
                        style={{ 
                            width: '100%', 
                            marginTop: '10px',
                            padding: '14px' 
                        }} 
                        disabled={loading}
                    >
                        {loading ? 'Verifying Identity...' : 'Register Now'}
                    </button>
                </form>

                {/* Status Messages */}
                {message && (
                    <div style={{ 
                        marginTop: '24px', 
                        padding: '12px',
                        borderRadius: '12px',
                        textAlign: 'center', 
                        fontSize: '0.85rem',
                        background: message.includes('✅') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${message.includes('✅') ? 'var(--success)' : '#ef4444'}`,
                        color: message.includes('✅') ? 'var(--success)' : '#ef4444' 
                    }}>
                        {message}
                    </div>
                )}

                <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    Already registered? <Link to="/login" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
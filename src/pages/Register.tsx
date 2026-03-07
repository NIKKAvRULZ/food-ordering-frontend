import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { User } from '../types/user';
import { registerUser } from '../services/api';

const Register: React.FC = () => {
    const [formData, setFormData] = useState<User>({
        username: '',
        email: '',
        password: '',
        deliveryAddress: '',
        recommendation: '' // This field is required by the backend, so we initialize it as an empty string
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(''); 
    
    try {
        // CRITICAL FIX: Add the actual API call
        console.log("Sending to Backend:", formData); 
        await registerUser(formData); 
        
        // Only show success if the backend returns a 200 OK
        setMessage('✅ Registration Successful! Redirecting to login...');
        
        setTimeout(() => {
            navigate('/login');
        }, 2500);
    } catch (error: any) {
        // This will now catch the "Registration Conflict" from your Java Exception Handler
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
            padding: '0px 20px',
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
                        gap: '16px' 
                    }}>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px' }}>Username</label>
                            <input 
                                type="text" 
                                placeholder="Nikka99"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required 
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px' }}>Email</label>
                            <input 
                                type="email" 
                                placeholder="name@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required 
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    {/* Row 2: Password */}
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required 
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Row 3: Delivery Address */}
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px' }}>Delivery Address</label>
                        <input 
                            type="text" 
                            placeholder="Street, City, Country"
                            value={formData.deliveryAddress}
                            onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                            required 
                            style={{ width: '100%', boxSizing: 'border-box' }}
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
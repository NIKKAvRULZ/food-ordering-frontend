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
        recommendation: '', // This field is required by the backend, so we initialize it as an empty string
        vegan: false
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
        const res = await registerUser(formData); 
        
        // Trigger Welcome Email (Async)
        const userId = res.data?.id || res.data?.data?.id || res.data?._id;
        if (userId) {
            import('../services/api').then(m => m.triggerWelcomeEmail(userId.toString())).catch(console.error);
        }
        
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
            padding: '40px 20px',
            minHeight: 'calc(100vh - 100px)',
            position: 'relative',
            overflow: 'hidden'
        }}>
             {/* Background Decorations */}
             <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '500px', height: '500px', background: 'var(--accent-gold)', filter: 'blur(180px)', opacity: 0.05, borderRadius: '50%' }}></div>
             <div style={{ position: 'absolute', bottom: '0%', left: '-10%', width: '400px', height: '400px', background: 'var(--accent-secondary)', filter: 'blur(150px)', opacity: 0.05, borderRadius: '50%' }}></div>

            <div className="glass-panel fade-in" style={{ 
                width: '100%', 
                maxWidth: '550px',
                textAlign: 'left',
                position: 'relative',
                zIndex: 1,
                padding: '50px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🛰️</div>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1px' }}>Join the Network</h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>Initialize your operative node today.</p>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '10px' }}>Protocol Name</label>
                            <input 
                                type="text" 
                                placeholder="Operative"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required 
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '10px' }}>Comms Email</label>
                            <input 
                                type="email" 
                                placeholder="name@network.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required 
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '10px' }}>Access Cipher</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required 
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '10px' }}>Delivery Coordinates</label>
                        <input 
                            type="text" 
                            placeholder="Physical Address"
                            value={formData.deliveryAddress}
                            onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                            required 
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div className="form-group" style={{ 
                        background: 'rgba(255,255,255,0.03)', 
                        padding: '15px 20px', 
                        borderRadius: '15px', 
                        border: '1px solid var(--glass-border)',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        cursor: 'pointer'
                    }} onClick={() => setFormData({...formData, vegan: !formData.vegan})}>
                        <input 
                            type="checkbox" 
                            id="vegan-checkbox"
                            checked={formData.vegan}
                            onChange={(e) => setFormData({...formData, vegan: e.target.checked})}
                            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent-gold)' }}
                        />
                        <label htmlFor="vegan-checkbox" style={{ fontSize: '0.95rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                            Prioritize <span style={{ color: '#4ade80', fontWeight: 800 }}>VEGAN</span> culinary nodes 🥗
                        </label>
                    </div>

                    <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '10px', padding: '16px', fontSize: '1.1rem' }} disabled={loading}>
                        {loading ? 'Broadcasting Data...' : 'Initialize Node'}
                    </button>
                </form>

                {message && (
                    <div className="fade-in" style={{ 
                        marginTop: '24px', 
                        padding: '15px',
                        borderRadius: '15px',
                        textAlign: 'center', 
                        fontSize: '0.9rem',
                        background: message.includes('✅') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${message.includes('✅') ? 'var(--success)' : '#ef4444'}`,
                        color: message.includes('✅') ? 'var(--success)' : '#f87171' 
                    }}>
                        {message}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.95rem', color: 'var(--text-dim)', borderTop: '1px solid var(--glass-border)', paddingTop: '30px' }}>
                    Already an operative? <Link to="/login" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 700, marginLeft: '5px' }}>Login Station</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
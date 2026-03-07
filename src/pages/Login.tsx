import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // Access global login function

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await loginUser(credentials); 
            login(response.data); // Save user to global context
            navigate(`/profile/${response.data.id}`); 
        } catch (err: any) {
            setError(err.response?.data || "Invalid credentials. Please try again.");
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
                maxWidth: '400px',
                textAlign: 'left'
            }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '8px' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '32px' }}>Enter your credentials to access the network.</p>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px' }}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@example.com"
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                            required 
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            required 
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>
                    <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '10px', padding: '14px' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                {error && (
                    <div style={{ 
                        marginTop: '24px', 
                        padding: '12px',
                        borderRadius: '12px',
                        textAlign: 'center', 
                        fontSize: '0.85rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        color: '#ef4444'
                    }}>
                        {error}
                    </div>
                )}
                
                <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    New to the network? <Link to="/register" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
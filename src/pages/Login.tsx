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
            const { user, token } = response.data;
            
            // Save the JWT token to local storage for Axios to use
            localStorage.setItem("jwt_token", token);
            
            login(user); // Save user to global context
            navigate(`/home`); // Redirect automatically to the home dashboard as requested!
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
            padding: '40px 20px',
            minHeight: 'calc(100vh - 100px)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '400px', height: '400px', background: 'var(--accent-gold)', filter: 'blur(150px)', opacity: 0.05, borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '300px', height: '300px', background: 'var(--accent-secondary)', filter: 'blur(150px)', opacity: 0.05, borderRadius: '50%' }}></div>

            <div className="glass-panel fade-in" style={{ 
                width: '100%', 
                maxWidth: '420px',
                textAlign: 'left',
                position: 'relative',
                zIndex: 1,
                padding: '50px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🗝️</div>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>Re-establish your connection to the grid.</p>
                </div>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '10px' }}>Access Email</label>
                        <input 
                            type="email" 
                            placeholder="agent@gourmet.io"
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                            required 
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '10px' }}>Security Code</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            required 
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>
                    <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '10px', padding: '16px', fontSize: '1.1rem' }} disabled={loading}>
                        {loading ? 'Decrypting...' : 'Initiate Session'}
                    </button>
                </form>

                {error && (
                    <div className="fade-in" style={{ 
                        marginTop: '24px', 
                        padding: '15px',
                        borderRadius: '15px',
                        textAlign: 'center', 
                        fontSize: '0.9rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171'
                    }}>
                        {error}
                    </div>
                )}
                
                <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.95rem', color: 'var(--text-dim)', borderTop: '1px solid var(--glass-border)', paddingTop: '30px' }}>
                    New operative? <Link to="/register" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 700, marginLeft: '5px' }}>Register Node</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
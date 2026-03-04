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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '10px' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '30px' }}>Enter your credentials to access the network.</p>
                
                <form onSubmit={handleLogin}>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@example.com"
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-gold" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '20px', textAlign: 'center' }}>{error}</p>}
                
                <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    New to the network? <Link to="/register" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded fallback for demonstration of admin bypass
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('adminAuth', 'true');
            navigate('/admin/dashboard');
        } else {
            setError('Invalid master override credentials.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div className="status-dot live" style={{ marginBottom: '15px', background: '#eab308', boxShadow: '0 0 10px #eab308' }}></div>
                    <h2 style={{ margin: 0, fontWeight: 300 }}>Master <span style={{ color: '#eab308' }}>Override</span></h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '10px', letterSpacing: '1px' }}>AUTHORIZED PERSONNEL ONLY</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>Admin ID</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>Passcode</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>{error}</div>}
                    <button type="submit" className="btn-gold" style={{ marginTop: '10px', background: 'linear-gradient(135deg, #eab308, #ca8a04)', boxShadow: '0 4px 15px rgba(202, 138, 4, 0.4)' }}>Initialize Session</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

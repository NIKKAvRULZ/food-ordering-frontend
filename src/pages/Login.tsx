import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await loginUser(credentials);
            // On success, navigate to profile using the ID returned by the backend
            console.log("Login Success:", response.data);
            navigate(`/profile/${response.data.id}`); 
        } catch (err: any) {
            setError("Invalid credentials. Please check your email/password.");
        }
    };

    return (
        <div className="form-container">
            <h2>User Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        placeholder="Enter email"
                        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter password"
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        required 
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Login;
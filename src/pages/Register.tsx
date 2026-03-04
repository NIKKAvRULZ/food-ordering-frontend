import React, { useState } from 'react';
import { registerUser } from '../services/api';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('Connecting to cloud server... (This may take up to 1 minute if the service is waking up)');
        
        try {
            const response = await registerUser(formData);
            setMessage(`✅ Success! User ID: ${response.data.id}`);
        } catch (error: any) {
            if (error.code === 'ECONNABORTED' || !error.response) {
                setMessage("⚠️ Server is taking a while to wake up. Please wait a moment and try again.");
            } else {
                setMessage(`❌ Error: ${error.response?.data || "Registration failed"}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Delivery Address</label>
                    <input 
                        type="text" 
                        placeholder="Enter your address"
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                        required 
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Register'}
                </button>
            </form>
            {message && <p className={message.includes('✅') ? 'success-msg' : 'error'}>{message}</p>}
        </div>
    );
};

export default Register;
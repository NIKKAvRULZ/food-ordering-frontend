import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../services/api';
import type { User } from '../types/user';

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile(Number(id));
                setUser(response.data);
            } catch (err) {
                console.error("Profile fetch failed", err);
            }
        };
        if (id) fetchProfile();
    }, [id]);

    if (!user) return <div className="loading">Fetching profile from Render...</div>;

    return (
        <div className="profile-card">
            <div className="profile-header">
                <h2>User Details</h2>
                <span className="badge">Identity Verified</span>
            </div>
            <div className="profile-body">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Database ID:</strong> {user.id}</p>
            </div>
        </div>
    );
};

export default Profile;
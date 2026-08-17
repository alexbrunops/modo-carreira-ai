import React from 'react';
import ProfileManager from '../components/auth/ProfileManager';
import { useNavigate } from 'react-router-dom';
import '../components/auth/Auth.css';

function Profile() {
    const navigate = useNavigate();

    return (
        <div className="profile-page">
            <ProfileManager onClose={() => navigate('/')} />
        </div>
    );
}

export default Profile;
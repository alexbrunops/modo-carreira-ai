import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function ProfileManager({ onClose }) {
    const { user, updateProfile, changePassword, deleteAccount, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile form
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        preferences: user?.preferences || {}
    });

    // Password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const result = await updateProfile(profileData);
        
        if (result.success) {
            setMessage({ type: 'success', text: '✅ Perfil atualizado com sucesso!' });
        } else {
            setMessage({ type: 'error', text: `❌ ${result.error}` });
        }
        setLoading(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: '❌ As senhas não coincidem' });
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: '❌ A senha deve ter pelo menos 6 caracteres' });
            setLoading(false);
            return;
        }

        const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
        
        if (result.success) {
            setMessage({ type: 'success', text: '✅ Senha alterada com sucesso!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setMessage({ type: 'error', text: `❌ ${result.error}` });
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Tem certeza? Esta ação é irreversível! Todos os seus dados serão perdidos.')) {
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        const result = await deleteAccount();
        
        if (result.success) {
            setMessage({ type: 'success', text: '✅ Conta deletada com sucesso' });
            setTimeout(() => {
                if (onClose) onClose();
            }, 1500);
        } else {
            setMessage({ type: 'error', text: `❌ ${result.error}` });
        }
        setLoading(false);
    };

    if (!user) {
        return <div className="auth-error">Usuário não autenticado</div>;
    }

    return (
        <div className="profile-manager">
            <div className="profile-header">
                <h2>👤 Minha Conta</h2>
                <button className="btn-close" onClick={onClose}>✕</button>
            </div>

            {message.text && (
                <div className={`auth-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="profile-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    📝 Perfil
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                >
                    🔒 Senha
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'danger' ? 'active' : ''}`}
                    onClick={() => setActiveTab('danger')}
                >
                    ⚠️ Perigo
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileUpdate}>
                        <div className="field-group">
                            <label>Nome</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="field-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="field-group">
                            <label>Plano</label>
                            <input
                                type="text"
                                value={user.plan || 'Gratuito'}
                                disabled
                                className="disabled-input"
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? '⏳ Salvando...' : '💾 Salvar Alterações'}
                        </button>
                    </form>
                )}

                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordChange}>
                        <div className="field-group">
                            <label>Senha Atual</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="field-group">
                            <label>Nova Senha</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>

                        <div className="field-group">
                            <label>Confirmar Nova Senha</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? '⏳ Alterando...' : '🔒 Alterar Senha'}
                        </button>
                    </form>
                )}

                {activeTab === 'danger' && (
                    <div className="danger-zone">
                        <h3>⚠️ Zona de Perigo</h3>
                        <p>Estas ações são irreversíveis. Tenha cuidado!</p>
                        
                        <div className="danger-actions">
                            <button 
                                className="btn-danger"
                                onClick={handleDeleteAccount}
                                disabled={loading}
                            >
                                {loading ? '⏳ Processando...' : '🗑️ Deletar Conta'}
                            </button>
                            
                            <button 
                                className="btn-warning"
                                onClick={logout}
                            >
                                🚪 Sair da Conta
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileManager;
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function LoginForm({ onSuccess, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);
        
        if (result.success) {
            if (onSuccess) onSuccess(result.user);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-header">
                <h2>🔐 Entrar</h2>
                <p>Entre na sua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                {error && (
                    <div className="auth-error">
                        ⚠️ {error}
                    </div>
                )}

                <div className="field-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="field-group">
                    <label>Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                        minLength={6}
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? '⏳ Entrando...' : '🚀 Entrar'}
                </button>

                <div className="auth-form-footer">
                    <span>Não tem uma conta?</span>
                    <button type="button" onClick={onSwitchToRegister} className="btn-link">
                        Registrar-se
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
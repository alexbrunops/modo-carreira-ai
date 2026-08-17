import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function RegisterForm({ onSuccess, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validar senha
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            setLoading(false);
            return;
        }

        const { confirmPassword, ...userData } = formData;
        const result = await register(userData);
        
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
                <h2>📝 Criar Conta</h2>
                <p>Registre-se para começar a usar o Agente de Imersão</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                {error && (
                    <div className="auth-error">
                        ⚠️ {error}
                    </div>
                )}

                <div className="field-group">
                    <label>Nome</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="field-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="field-group">
                    <label>Senha</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        required
                        disabled={loading}
                        minLength={6}
                    />
                </div>

                <div className="field-group">
                    <label>Confirmar Senha</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Digite a senha novamente"
                        required
                        disabled={loading}
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? '⏳ Criando conta...' : '✅ Criar Conta'}
                </button>

                <div className="auth-form-footer">
                    <span>Já tem uma conta?</span>
                    <button type="button" onClick={onSwitchToLogin} className="btn-link">
                        Fazer login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;
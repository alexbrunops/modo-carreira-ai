import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import '../components/auth/Auth.css';

function Login({ onLoginSuccess }) {
    const [mode, setMode] = useState('login');

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-logo">
                    <span className="logo-icon">⚽</span>
                    <h1>Agente de Imersão</h1>
                    <p>Modo Carreira 3.0</p>
                </div>

                {mode === 'login' ? (
                    <LoginForm 
                        onSuccess={onLoginSuccess}
                        onSwitchToRegister={() => setMode('register')}
                    />
                ) : (
                    <RegisterForm 
                        onSuccess={onLoginSuccess}
                        onSwitchToLogin={() => setMode('login')}
                    />
                )}
            </div>
        </div>
    );
}

export default Login;
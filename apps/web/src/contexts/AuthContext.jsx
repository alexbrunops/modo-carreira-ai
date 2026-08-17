import React, { createContext, useState, useContext, useEffect } from 'react';
import { accountsApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar se há usuário logado
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');
        
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Erro ao carregar usuário:', e);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            }
        }
        setLoading(false);
    }, []);

    // Login
    const login = async (email, password) => {
        console.log('Calling AuthContext.login');
        setLoading(true);
        setError(null);
        try {
            const response = await accountsApi.login({ email, password });
            const userData = response.data;
            
            // Salvar token e usuário
            localStorage.setItem('auth_token', userData.token);
            localStorage.setItem('auth_user', JSON.stringify(userData.user));
            
            setUser(userData.user);
            return { success: true, user: userData.user };
        } catch (err) {
            const message = err.response?.data?.error || 'Erro ao fazer login';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    // Registro
    const register = async (userData) => {
        console.log('Calling AuthContext.register');
        setLoading(true);
        setError(null);
        try {
            const response = await accountsApi.register(userData);
            const newUser = response.data;
            
            // Auto-login após registro
            localStorage.setItem('auth_token', newUser.token);
            localStorage.setItem('auth_user', JSON.stringify(newUser.user));
            
            setUser(newUser.user);
            return { success: true, user: newUser.user };
        } catch (err) {
            const message = err.response?.data?.error || 'Erro ao registrar';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
    };

    // Atualizar perfil
    const updateProfile = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await accountsApi.update(user.id, data);
            const updatedUser = response.data;
            
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            return { success: true, user: updatedUser };
        } catch (err) {
            const message = err.response?.data?.error || 'Erro ao atualizar perfil';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    // Mudar senha
    const changePassword = async (currentPassword, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            await accountsApi.changePassword(user.id, { currentPassword, newPassword });
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.error || 'Erro ao alterar senha';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    // Deletar conta
    const deleteAccount = async () => {
        setLoading(true);
        setError(null);
        try {
            await accountsApi.delete(user.id);
            logout();
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.error || 'Erro ao deletar conta';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
}
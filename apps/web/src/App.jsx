import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEvents } from './hooks/useEvents';
import DynamicForm from './components/DynamicForm';
import ProfileManager from './components/auth/ProfileManager';
import './App.css';
import LoginForm from './components/auth/LoginForm';

function AppContent() {
    const { user, isAuthenticated, logout } = useAuth();
    const [showProfile, setShowProfile] = useState(false);
    const { 
        events, 
        selectedEvent, 
        setSelectedEvent,
        eventConfig,
        addEvents,
        removeEvent,
        clearAll,
        exportJSON,
        copyToClipboard
    } = useEvents();

    // Se não estiver autenticado, mostrar login
    if (!isAuthenticated) {
        return <Login onLoginSuccess={() => {}} />;
    }

    // Se mostrar perfil, renderizar o ProfileManager
    if (showProfile) {
        return (
            <div className="app">
                <ProfileManager onClose={() => setShowProfile(false)} />
            </div>
        );
    }

    // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const allEvents = { ...eventConfig };
    
    // Agrupar eventos por categoria
    const groupedEvents = {};
    Object.values(allEvents).forEach(event => {
        const category = event.category || 'outro';
        if (!groupedEvents[category]) {
            groupedEvents[category] = [];
        }
        groupedEvents[category].push(event);
    });

    const handleExport = () => {
        const data = exportJSON();
        if (data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `eventos_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const sendToAI = () => {
        const data = exportJSON();
        if (data) {
            fetch('http://localhost:3001/api/ai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: data
                })
            })
            .then(response => response.json())
            .then(result => {
                if (result.narrative) {
                    alert(`Narrativa gerada:\n\n${result.narrative}`);
                } else {
                    alert('❌ Falha ao gerar narrativa!');
                }
            })
            .catch(err => {
                console.error('Erro ao enviar dados para IA:', err);
                alert('❌ Falha ao enviar dados para IA!');
            });
        } else {
            alert('Não há eventos para enviar à IA.');
        }
    }

    return (
        <div className="app">
            <header>
                <div className="header-content">
                    <h1>⚽ Agente de Imersão</h1>
                    <span className="badge">Modo Carreira</span>
                </div>
                <div className="header-actions">
                    <span className="counter">{events.length} eventos</span>
                    <button onClick={copyToClipboard} className="btn-export">📥 Copiar</button>
                    <button onClick={clearAll} className="btn-clear">🗑️ Limpar</button>
                    
                    {/* Botão de perfil do usuário */}
                    <div className="user-menu">
                        <button 
                            className="btn-profile" 
                            onClick={() => setShowProfile(true)}
                            title={user?.name || 'Perfil'}
                        >
                            <span className="profile-avatar">
                                {user?.name || '👤'}
                            </span>
                        </button>
                        <button onClick={logout} className="btn-logout" title="Sair">
                            🚪
                        </button>
                    </div>
                </div>
            </header>

            <div className="main-layout">
                <nav className="sidebar">
                    {Object.entries(groupedEvents).map(([category, events]) => (
                        <div key={category} className="sidebar-section">
                            <h3>{getCategoryLabel(category)}</h3>
                            {events.map(event => (
                                <button
                                    key={event.id}
                                    className={`event-btn ${selectedEvent === event.id ? 'active' : ''}`}
                                    onClick={() => setSelectedEvent(event.id)}
                                >
                                    <span className="icon">{event.icon || '📌'}</span>
                                    {event.label}
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>

                <main className="content">
                    {selectedEvent && allEvents[selectedEvent] ? (
                        <DynamicForm
                            eventConfig={allEvents[selectedEvent]}
                            onSubmit={(data) => {
                                addEvents({
                                    eventId: selectedEvent,
                                    eventLabel: allEvents[selectedEvent].label,
                                    data: data
                                });
                            }}
                        />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">🎮</div>
                            <h2>Selecione um evento</h2>
                            <p>Escolha um tipo de evento no menu lateral para registrar</p>
                        </div>
                    )}
                </main>

                <aside className="history">
                    <h3>📜 Histórico</h3>
                    <div id="historyList">
                        {events.length === 0 ? (
                            <p className="empty-history">Nenhum evento registrado</p>
                        ) : (
                            events.map(event => (
                                <div key={event.id} className="history-item">
                                    <span className="h-time">
                                        {new Date(event.timestamp).toLocaleString('pt-BR')}
                                    </span>
                                    <span className="h-title">
                                        {event.eventIcon} {event.eventLabel}
                                    </span>
                                    <span className="h-details">
                                        {Object.entries(event.data)
                                            .map(([key, value]) => `${key}: ${value}`)
                                            .join(' | ')}
                                    </span>
                                    <button 
                                        className="h-delete" 
                                        onClick={() => removeEvent(event.id)}
                                        title="Remover"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}

function getCategoryLabel(category) {
    const labels = {
        'partida': '📊 Eventos de Partida',
        'jogador': '👤 Jogador',
        'time': '🏛️ Time',
        'transferencia': '💸 Transferências',
        'lesao': '🏥 Lesões',
        'carreira': '👋 Carreira',
        'liga': '🏆 Liga',
        'outro': '📌 Outros'
    };
    return labels[category] || category;
}

// Componente Principal
function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<AppContent />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
import { useState, useEffect } from 'react';
import { EVENT_CONFIG } from '../config/event-config';
import { useAuth } from '../contexts/AuthContext';


export function useEvents() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventsToBeCopied, setEventsToBeCopied] = useState([]);
    // const [customE]

    useEffect(() => {
        const saved = localStorage.getItem('mc3_events');
        if (saved) {
            try {
                setEvents(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse saved events from localStorage:', e);
            }
        }
    }, []);

    const saveEvents = (newEvents) => {
        localStorage.setItem('mc3_events', JSON.stringify(newEvents));
        setEvents(newEvents);
    };

    const addEvents = (eventData) => {
        // const newEventsToCopy = [eventData, ...eventsToBeCopied];
        // setEventsToBeCopied(newEventsToCopy);

        const newEvent = {
            id: Date.now(),
            ...eventData,
            timestamp: new Date().toISOString()
        };
        const newEvents = [newEvent, ...events];
        saveEvents(newEvents);
        return newEvent;
    };

    const removeEvent = (id) => {
        const newEvents = events.filter(event => event.id !== id);
        saveEvents(newEvents);
    };

    const clearAll = () => {
        if (window.confirm('Tem certeza que deseja limpar todos os eventos?')) {
            saveEvents([]);
        }
    };

    const exportJSON = () => {
        if (events.length === 0) {
            alert('Não há eventos para exportar.');
            return;
        }

        const data = {
            totalEvents: events.length,
            events: events
        };

        return data;
    };

    const copyToClipboard = () => {
        if (events) {
            persistData(events);
            const json = JSON.stringify(events);
            
            navigator.clipboard.writeText(json).then(() => {
                alert('✅ JSON copiado para a área de transferência!');
            }).catch(err => {
                console.error('Erro ao copiar JSON:', err);
                alert('❌ Falha ao copiar JSON!');
            });
        }
    }

    const persistData = (events) => {
        if (events) {
            events.map((e) => {
                if (e.eventId === 'initCareerMode') {
                    const career = e.data;
                    localStorage.setItem(user.id + '_career', JSON.stringify(career));
                }

                if (e.eventId === 'initMatch') {
                    const { opposingTeam } = e.data;
                    const { name } = opposingTeam;
                    const fileName = (e.eventId + name);

                    localStorage.setItem(fileName, JSON.stringify(e.data));
                    localStorage.setItem('match', fileName);
                }

                if (e.eventId === 'endMatch') {
                    const fileName = localStorage.getItem('match');
                    localStorage.removeItem(fileName);
                    localStorage.setItem('match', '');
                    // const matchData = localStorage.getItem(fileName);
                    // if (matchData) {
                    //     const data = JSON.parse(matchData);

                    // }
                }

                if (e.eventId === 'playerStatus') {
                    const { player } = e.data;
                    const playerName = player.name;
                    const fileName = user.id + '_teamPlayers';
                    let teamPlayers = [];
                    const players = localStorage.getItem(fileName);

                    if (!players) {
                        localStorage.setItem(fileName, teamPlayers);
                    }

                    let p = teamPlayers.filter(p => p.name === playerName);
                    console.log(player);
                    if (p.length === 0) {
                        teamPlayers.push(player);
                    }

                    localStorage.setItem(fileName, JSON.stringify(teamPlayers));
                }
            });
        }
    }

    return {
        events,
        selectedEvent,
        setSelectedEvent,
        addEvents,
        removeEvent,
        clearAll,
        exportJSON,
        copyToClipboard,
        eventConfig: EVENT_CONFIG
    };
}
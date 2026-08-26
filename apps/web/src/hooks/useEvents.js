import { useState, useEffect } from 'react';
import { EVENT_CONFIG } from '../config/event-config';


export function useEvents() {
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
            const json = JSON.stringify(events);
            
            navigator.clipboard.writeText(json).then(() => {
                alert('✅ JSON copiado para a área de transferência!');
            }).catch(err => {
                console.error('Erro ao copiar JSON:', err);
                alert('❌ Falha ao copiar JSON!');
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
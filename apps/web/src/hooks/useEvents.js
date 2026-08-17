import { useState, useEffect } from 'react';
import { EVENT_CONFIG } from '../config/event-config';


export function useEvents() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
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
            // exportedAt: new Date().toISOString(),
            totalEvents: events.length,
            events: events
        };

        return data;
    };

    return {
        events,
        selectedEvent,
        setSelectedEvent,
        // customEvents,
        // setCustomEvents,
        addEvents,
        removeEvent,
        clearAll,
        exportJSON,
        eventConfig: EVENT_CONFIG
    };
}
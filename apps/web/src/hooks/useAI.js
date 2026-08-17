import { useState } from 'react';
import { aiApi } from '../api/client';

export function useAI() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [providers, setProviders] = useState([]);

    const getProviders = async () => {
        setLoading(true);
        try {
            const response = await aiApi.getProviders();
            setProviders(response.data.providers);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const generateNarrative = async (eventType, data, provider = null, model = null) => {
        setLoading(true);
        try {
            const response = await aiApi.generate({
                eventType,
                data,
                provider,
                model
            });
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const generateMultipleNarratives = async (eventType, data, personas = null, provider = null) => {
        setLoading(true);
        try {
            const response = await aiApi.generateMultiple({
                eventType,
                data,
                personas,
                provider
            });
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        providers,
        getProviders,
        generateNarrative,
        generateMultipleNarratives
    };
}
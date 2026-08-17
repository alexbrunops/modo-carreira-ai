const express = require('express');
const router = express.Router();
const { AIProviderFactory, aiConfig } = require('../services/ai');

// GET - Listar provedores disponíveis
router.get('/providers', async (req, res) => {
    try {
        const providers = AIProviderFactory.getAvailableProviders();
        console.log('Available providers:', providers);
        res.json({
            providers,
            defaultProvider: aiConfig.defaultProvider,
            templates: Object.keys(aiConfig.templates)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Gerar narrativa
router.post('/generate', async (req, res) => {
    try {
        const { 
            data, 
            provider = null, 
            model = null,
            template = null,
            temperature = null,
            maxTokens = null
        } = req.body;

        // Validar eventType
        // if (!eventType) {
        //     return res.status(400).json({ error: 'eventType é obrigatório' });
        // }

        // Obter provedor
        const aiProvider = AIProviderFactory.getProvider(provider);

        // Obter template
        // let templateText = template;
        // if (!templateText) {
        //     const templates = aiConfig.templates;
        //     templateText = templates[eventType];
        //     if (!templateText) {
        //         return res.status(400).json({ 
        //             error: `Template para "${eventType}" não encontrado` 
        //         });
        //     }
        // }

        // Opções
        const options = {};
        if (model) options.model = model;
        if (temperature !== null) options.temperature = temperature;
        if (maxTokens !== null) options.maxTokens = maxTokens;

        // Gerar narrativa
        const narrative = await aiProvider.generateNarrative(
            '',
            data,
            options
        );

        res.json({
            narrative,
            provider: provider || aiConfig.defaultProvider,
            model: options.model || aiProvider.getDefaultModel(),
            data
        });
    } catch (error) {
        console.error('Erro ao gerar narrativa:', error);
        res.status(500).json({ 
            error: error.message,
            fallback: 'Erro ao gerar narrativa com IA'
        });
    }
});

// POST - Gerar múltiplas narrativas (para diferentes personalidades)
router.post('/generate-multiple', async (req, res) => {
    try {
        const { 
            eventType, 
            data, 
            personas = ['jornalista', 'torcedor', 'analista'],
            provider = null
        } = req.body;

        if (!eventType) {
            return res.status(400).json({ error: 'eventType é obrigatório' });
        }

        const aiProvider = AIProviderFactory.getProvider(provider);
        const templates = aiConfig.templates;
        const baseTemplate = templates[eventType];

        if (!baseTemplate) {
            return res.status(400).json({ 
                error: `Template para "${eventType}" não encontrado` 
            });
        }

        // Personas com estilos diferentes
        const personaStyles = {
            jornalista: {
                prefix: 'Escreva como um jornalista esportivo profissional:',
                tone: 'formal e analítico'
            },
            torcedor: {
                prefix: 'Escreva como um torcedor fanático:',
                tone: 'emocional e passional'
            },
            analista: {
                prefix: 'Escreva como um analista tático:',
                tone: 'técnico e detalhista'
            },
            podcaster: {
                prefix: 'Escreva como um apresentador de podcast:',
                tone: 'descontraído e opinativo'
            },
            diretor: {
                prefix: 'Escreva como um diretor de futebol:',
                tone: 'diplomático e estratégico'
            }
        };

        const narratives = [];

        for (const persona of personas) {
            const style = personaStyles[persona] || personaStyles.jornalista;
            const prompt = `${style.prefix} Tom: ${style.tone}. ${baseTemplate}`;
            
            const narrative = await aiProvider.generateNarrative(
                prompt,
                data
            );

            narratives.push({
                persona,
                narrative,
                style: style.tone
            });
        }

        res.json({
            eventType,
            data,
            narratives,
            provider: provider || aiConfig.defaultProvider
        });
    } catch (error) {
        console.error('Erro ao gerar múltiplas narrativas:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
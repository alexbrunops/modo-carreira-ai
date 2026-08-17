// const OpenAIProvider = require('./openai');
// const DeepSeekProvider = require('./deepseek');
// const ClaudeProvider = require('./claude');
// const GroqProvider = require('./groq');
const aiConfig = require('../../config/ai.json');

// Classe base para provedores
class BaseAIProvider {
    constructor(configKey) {
        this.config = aiConfig.providers[configKey];
        if (!this.config) {
            throw new Error(`Configuração para "${configKey}" não encontrada`);
        }
        this.apiKey = process.env[this.config.envKey];
        if (!this.apiKey) {
            throw new Error(`Chave API não encontrada: ${this.config.envKey}`);
        }
        this.defaultModel = this.config.defaultModel;
        this.maxTokens = this.config.maxTokens || 500;
        this.temperature = this.config.temperature || 0.8;
    }

    async generate(prompt, options = {}) {
        throw new Error('Método generate deve ser implementado');
    }

    async generateNarrative(template, data, options = {}) {
        // const prompt = this.fillTemplate(template, data);
        return this.generate(data, options);
    }

    fillTemplate(template, data) {
        let result = template;
        for (const [key, value] of Object.entries(data)) {
            result = result.replace(new RegExp(`{${key}}`, 'g'), value || '');
        }
        return result;
    }

    getModels() {
        return this.config.models;
    }

    getDefaultModel() {
        return this.defaultModel;
    }
}


// Factory de provedores
class AIProviderFactory {
    static getProvider(providerName = null) {
        const name = providerName || aiConfig.defaultProvider;
        
        switch (name) {
            case 'openai':
                const OpenAIProvider = require('./openai');
                return new OpenAIProvider();
            // case 'deepseek':
            //     return new DeepSeekProvider();
            // case 'claude':
            //     return new ClaudeProvider();
            // case 'groq':
            //     return new GroqProvider();
            default:
                throw new Error(`Provedor "${name}" não suportado`);
        }
    }

    static getAvailableProviders() {
        const providers = [];
        for (const [key, config] of Object.entries(aiConfig.providers)) {
            const apiKey = process.env[config.envKey];
            providers.push({
                id: key,
                name: config.name,
                available: !!apiKey,
                models: config.models,
                defaultModel: config.defaultModel
            });
        }
        return providers;
    }
}

module.exports = {
    AIProviderFactory,
    BaseAIProvider,
    aiConfig
};
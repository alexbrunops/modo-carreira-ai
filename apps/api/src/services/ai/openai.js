const { BaseAIProvider } = require('./index');

class OpenAIProvider extends BaseAIProvider {
    constructor() {
        super('openai');
        this.client = null;
    }

    async getClient() {
        if (!this.client) {
            const { OpenAI } = await import('openai');
            this.client = new OpenAI({
                apiKey: this.apiKey
            });
        }
        return this.client;
    }

    async generate(prompt, options = {}) {
        try {
            const client = await this.getClient();
            const model = options.model || this.defaultModel;
            const temperature = options.temperature || this.temperature;
            const maxTokens = options.maxTokens || this.maxTokens;

            const response = await client.chat.completions.create({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: 'Você é um especialista em criar narrativas esportivas imersivas e realistas. Mantenha o tom adequado e não invente fatos além dos dados fornecidos.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: temperature,
                max_tokens: maxTokens
            });

            return response.choices[0].message.content || prompt;
        } catch (error) {
            console.error('Erro no OpenAI:', error);
            return prompt;
        }
    }
}

module.exports = OpenAIProvider;
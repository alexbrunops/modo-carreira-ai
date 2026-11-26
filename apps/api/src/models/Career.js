const { run, get, all, generateId } = require('../database');

// Colunas da tabela "careers" (ver database.js)
class Career {
    constructor(data = {}) {
        this.id = data.id || generateId();
        this.accountId = data.account_id || data.accountId;
        this.name = data.career_name || data.name;
        this.sport = data.sport || 'football';
        this.gameName = data.game_name || data.gameName;
        this.gameVersion = data.game_version || data.gameVersion || '1.0';
        this.mode = data.mode; // 'manager' ou 'player'
        this.currency = data.currency || 'EUR';
        this.language = data.language || 'pt-BR';
        this.useRealData = toFlag(data.use_real_data ?? data.useRealData, 1);
        this.isActive = toFlag(data.is_active ?? data.isActive, 1);
        this.lastPlayed = data.last_played || data.lastPlayed || null;
        this.createdAt = data.created_at || data.createdAt || null;
        this.updatedAt = data.updated_at || data.updatedAt || null;

        // Campos extras vindos de JOIN
        if (data.account_name) this.accountName = data.account_name;
        if (data.team_name) this.teamName = data.team_name;
    }

    // ============================================
    // MÉTODOS DE INSTÂNCIA
    // ============================================

    // Salvar (inserir ou atualizar)
    async save() {
        const now = new Date().toISOString();
        this.updatedAt = now;

        const existing = await get('SELECT id FROM careers WHERE id = ?', [this.id]);

        if (existing) {
            await run(`
                UPDATE careers SET
                    account_id = ?,
                    career_name = ?,
                    sport = ?,
                    game_name = ?,
                    game_version = ?,
                    mode = ?,
                    currency = ?,
                    language = ?,
                    use_real_data = ?,
                    is_active = ?,
                    last_played = ?,
                    updated_at = ?
                WHERE id = ?
            `, [
                this.accountId,
                this.name,
                this.sport,
                this.gameName,
                this.gameVersion,
                this.mode,
                this.currency,
                this.language,
                this.useRealData,
                this.isActive,
                this.lastPlayed || now,
                now,
                this.id
            ]);
        } else {
            this.createdAt = now;
            await run(`
                INSERT INTO careers (
                    id, account_id, career_name, sport, game_name, game_version,
                    mode, currency, language, use_real_data, is_active,
                    last_played, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                this.id,
                this.accountId,
                this.name,
                this.sport,
                this.gameName,
                this.gameVersion,
                this.mode,
                this.currency,
                this.language,
                this.useRealData,
                this.isActive,
                this.lastPlayed || now,
                this.createdAt,
                this.updatedAt
            ]);
        }

        return this;
    }

    async delete() {
        const result = await run('DELETE FROM careers WHERE id = ?', [this.id]);
        return result.changes > 0;
    }

    async setActive(active) {
        this.isActive = active ? 1 : 0;
        await this.save();
        return this;
    }

    // ============================================
    // MÉTODOS ESTÁTICOS (QUERIES)
    // ============================================

    static async findById(id) {
        const data = await get(`
            SELECT c.*, a.name AS account_name, t.name AS team_name
            FROM careers c
            LEFT JOIN accounts a ON c.account_id = a.id
            LEFT JOIN football_teams t ON t.career_id = c.id
            WHERE c.id = ?
        `, [id]);

        return data ? new Career(data) : null;
    }

    static async findByAccountId(accountId, options = {}) {
        const { activeOnly = false, limit = 100, offset = 0 } = options;

        let query = `
            SELECT c.*, a.name AS account_name, t.name AS team_name
            FROM careers c
            LEFT JOIN accounts a ON c.account_id = a.id
            LEFT JOIN football_teams t ON t.career_id = c.id
            WHERE c.account_id = ?
        `;
        const params = [accountId];

        if (activeOnly) {
            query += ' AND c.is_active = 1';
        }

        query += ' ORDER BY c.last_played DESC, c.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const results = await all(query, params);
        return results.map(data => new Career(data));
    }

    static async countByAccountId(accountId, activeOnly = false) {
        let query = 'SELECT COUNT(*) AS count FROM careers WHERE account_id = ?';
        if (activeOnly) query += ' AND is_active = 1';
        const result = await get(query, [accountId]);
        return result ? result.count : 0;
    }

    static async deleteByAccountId(accountId) {
        const result = await run('DELETE FROM careers WHERE account_id = ?', [accountId]);
        return result.changes;
    }

    // Buscar com filtros
    static async search(filters = {}) {
        const {
            accountId = null,
            name = null,
            sport = null,
            mode = null,
            gameName = null,
            isActive = null,
            limit = 50,
            offset = 0,
            orderBy = 'last_played',
            orderDir = 'DESC'
        } = filters;

        let query = 'SELECT c.* FROM careers c WHERE 1=1';
        const params = [];

        if (accountId) { query += ' AND c.account_id = ?'; params.push(accountId); }
        if (name) { query += ' AND c.career_name = ?'; params.push(name); }
        if (sport) { query += ' AND c.sport = ?'; params.push(sport); }
        if (mode) { query += ' AND c.mode = ?'; params.push(mode); }
        if (gameName) { query += ' AND c.game_name LIKE ?'; params.push(`%${gameName}%`); }
        if (isActive !== null) { query += ' AND c.is_active = ?'; params.push(isActive ? 1 : 0); }

        // Lista fechada de colunas para evitar SQL injection
        const allowedOrderFields = ['career_name', 'sport', 'game_name', 'mode', 'created_at', 'last_played'];
        const safeOrderBy = allowedOrderFields.includes(orderBy) ? orderBy : 'last_played';
        const safeOrderDir = String(orderDir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        query += ` ORDER BY c.${safeOrderBy} ${safeOrderDir} LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const results = await all(query, params);
        return results.map(data => new Career(data));
    }
}

function toFlag(value, fallback) {
    if (value === undefined || value === null) return fallback;
    return value ? 1 : 0;
}

module.exports = Career;

const { db, run, get, all, generateId } = require('../database');

class Career {
    constructor(data) {
        this.id = data.id || generateId();
        this.accountId = data.accountId;
        this.name = data.name;
        this.sport = data.sport || 'football';
        this.gameName = data.game_name || data.gameName;
        this.gameVersion = data.game_version || data.gameVersion || '1.0';
        this.mode = data.mode; // 'manager' or 'player'
        this.teamId = data.team_id || data.teamId || null;
        this.currency = data.currency || 'EUR';
        this.language = data.language || 'pt-BR';
        this.useRealData = data.use_real_data !== undefined ? data.use_real_data : 1;
        // this.isActive = data.is_active !== undefined ? data.is_active : 1;
        this.totalHours = data.total_hours || data.totalHours || 0;
        this.lastPlayed = data.last_played || data.lastPlayed || null;
        this.createdAt = data.created_at || data.createdAt || null;
        this.updatedAt = data.updated_at || data.updatedAt || null;
    }

    // ============================================
    // MÉTODOS DE INSTÂNCIA
    // ============================================

    // Salvar (inserir ou atualizar)
    async save() {
        const now = new Date().toISOString();
        this.updatedAt = now;

        // Verificar se já existe
        const existing = await get('SELECT id FROM careers WHERE id = ?', [this.id]);

        if (existing) {
            // UPDATE
            await run(`
                UPDATE careers SET
                    user_id = ?,
                    name = ?,
                    sport = ?,
                    game_name = ?,
                    game_version = ?,
                    mode = ?,
                    protagonist_type = ?,
                    protagonist_id = ?,
                    team_id = ?,
                    currency = ?,
                    language = ?,
                    use_real_data = ?,
                    is_active = ?,
                    total_hours = ?,
                    last_played = ?,
                    updated_at = ?
                WHERE id = ?
            `, [
                this.userId,
                this.name,
                this.sport,
                this.gameName,
                this.gameVersion,
                this.mode,
                this.protagonistType,
                this.protagonistId,
                this.teamId,
                this.currency,
                this.language,
                this.useRealData,
                this.isActive,
                this.totalHours,
                this.lastPlayed || now,
                now,
                this.id
            ]);
        } else {
            // INSERT
            this.createdAt = now;
            await run(`
                INSERT INTO careers (
                    id, user_id, name, sport, game_name, game_version,
                    mode, protagonist_type, protagonist_id, team_id,
                    currency, language, use_real_data, is_active,
                    total_hours, last_played, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                this.id,
                this.userId,
                this.name,
                this.sport,
                this.gameName,
                this.gameVersion,
                this.mode,
                this.protagonistType,
                this.protagonistId,
                this.teamId,
                this.currency,
                this.language,
                this.useRealData,
                this.isActive,
                this.totalHours,
                this.lastPlayed || now,
                this.createdAt,
                this.updatedAt
            ]);
        }

        return this;
    }

    // Deletar
    async delete() {
        const result = await run('DELETE FROM careers WHERE id = ?', [this.id]);
        return result.changes > 0;
    }

    // Atualizar tempo de jogo
    async updateHours(hours) {
        this.totalHours += hours;
        this.lastPlayed = new Date().toISOString();
        await this.save();
        return this.totalHours;
    }

    // Ativar/Desativar
    async setActive(active) {
        this.isActive = active ? 1 : 0;
        await this.save();
        return this;
    }

    // ============================================
    // MÉTODOS ESTÁTICOS (QUERIES)
    // ============================================

    // Buscar por ID
    static async findById(id) {
        const data = await get(`
            SELECT 
                c.*,
                u.name as user_name,
                u.email as user_email,
                t.name as team_name,
                t.country as team_country
            FROM careers c
            LEFT JOIN accounts u ON c.user_id = u.id
            LEFT JOIN teams t ON c.team_id = t.id
            WHERE c.id = ?
        `, [id]);

        return data ? new Career(data) : null;
    }

    // Buscar todos de um usuário
    static async findByUserId(userId, options = {}) {
        const { activeOnly = false, limit = 100, offset = 0 } = options;

        let query = `
            SELECT 
                c.*,
                u.name as user_name,
                t.name as team_name
            FROM careers c
            LEFT JOIN accounts u ON c.user_id = u.id
            LEFT JOIN teams t ON c.team_id = t.id
            WHERE c.user_id = ?
        `;
        const params = [userId];

        if (activeOnly) {
            query += ' AND c.is_active = 1';
        }

        query += ' ORDER BY c.last_played DESC, c.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const results = await all(query, params);
        return results.map(data => new Career(data));
    }

    // Buscar todos (admin)
    static async findAll(options = {}) {
        const { limit = 100, offset = 0, sport = null, activeOnly = false } = options;

        let query = `
            SELECT 
                c.*,
                u.name as user_name,
                u.email as user_email,
                t.name as team_name
            FROM careers c
            LEFT JOIN accounts u ON c.user_id = u.id
            LEFT JOIN teams t ON c.team_id = t.id
            WHERE 1=1
        `;
        const params = [];

        if (sport) {
            query += ' AND c.sport = ?';
            params.push(sport);
        }

        if (activeOnly) {
            query += ' AND c.is_active = 1';
        }

        query += ' ORDER BY c.last_played DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const results = await all(query, params);
        return results.map(data => new Career(data));
    }

    // Buscar modo carreira ativo de um usuário
    static async findActiveByUserId(userId) {
        const data = await get(`
            SELECT * FROM careers 
            WHERE user_id = ? AND is_active = 1 
            ORDER BY last_played DESC, created_at DESC 
            LIMIT 1
        `, [userId]);

        return data ? new Career(data) : null;
    }

    // Contar careers de um usuário
    static async countByUserId(userId, activeOnly = false) {
        let query = 'SELECT COUNT(*) as count FROM careers WHERE user_id = ?';
        const params = [userId];

        if (activeOnly) {
            query += ' AND is_active = 1';
        }

        const result = await get(query, params);
        return result ? result.count : 0;
    }

    // Buscar por esporte
    static async findBySport(sport, options = {}) {
        const { limit = 100, offset = 0 } = options;

        const results = await all(`
            SELECT c.*, u.name as user_name 
            FROM careers c
            LEFT JOIN accounts u ON c.user_id = u.id
            WHERE c.sport = ?
            ORDER BY c.last_played DESC
            LIMIT ? OFFSET ?
        `, [sport, limit, offset]);

        return results.map(data => new Career(data));
    }

    // Buscar por nome do jogo
    static async findByGameName(gameName, options = {}) {
        const { limit = 100, offset = 0 } = options;

        const results = await all(`
            SELECT c.*, u.name as user_name 
            FROM careers c
            LEFT JOIN accounts u ON c.user_id = u.id
            WHERE c.game_name LIKE ?
            ORDER BY c.last_played DESC
            LIMIT ? OFFSET ?
        `, [`%${gameName}%`, limit, offset]);

        return results.map(data => new Career(data));
    }

    // Buscar com filtros avançados
    static async search(filters = {}) {
        const {
            userId = null,
            sport = null,
            mode = null,
            gameName = null,
            isActive = null,
            limit = 50,
            offset = 0,
            orderBy = 'last_played',
            orderDir = 'DESC'
        } = filters;

        let query = `
            SELECT c.*, u.name as user_name 
            FROM careers c
            LEFT JOIN accounts u ON c.user_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (userId) {
            query += ' AND c.user_id = ?';
            params.push(userId);
        }

        if (sport) {
            query += ' AND c.sport = ?';
            params.push(sport);
        }

        if (mode) {
            query += ' AND c.mode = ?';
            params.push(mode);
        }

        if (gameName) {
            query += ' AND c.game_name LIKE ?';
            params.push(`%${gameName}%`);
        }

        if (isActive !== null) {
            query += ' AND c.is_active = ?';
            params.push(isActive ? 1 : 0);
        }

        // Validar orderBy para evitar SQL injection
        const allowedOrderFields = ['name', 'sport', 'game_name', 'mode', 'created_at', 'last_played', 'total_hours'];
        const safeOrderBy = allowedOrderFields.includes(orderBy) ? orderBy : 'last_played';
        const safeOrderDir = orderDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        query += ` ORDER BY c.${safeOrderBy} ${safeOrderDir} LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const results = await all(query, params);
        return results.map(data => new Career(data));
    }

    // Deletar todos de um usuário
    static async deleteByUserId(userId) {
        const result = await run('DELETE FROM careers WHERE user_id = ?', [userId]);
        return result.changes;
    }

    // Estatísticas
    static async getStats() {
        const stats = await get(`
            SELECT 
                COUNT(*) as total_careers,
                COUNT(DISTINCT user_id) as total_users,
                COUNT(DISTINCT sport) as total_sports,
                SUM(total_hours) as total_hours,
                AVG(total_hours) as avg_hours,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_careers
            FROM careers
        `);

        return stats;
    }

    // Estatísticas por esporte
    static async getStatsBySport() {
        const results = await all(`
            SELECT 
                sport,
                COUNT(*) as total,
                SUM(total_hours) as total_hours,
                AVG(total_hours) as avg_hours,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
            FROM careers
            GROUP BY sport
            ORDER BY total DESC
        `);

        return results;
    }
}

module.exports = Career;
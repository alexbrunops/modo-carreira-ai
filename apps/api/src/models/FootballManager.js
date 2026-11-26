const { run, get, generateId } = require('../database');

// Colunas da tabela "football_managers" (ver database.js)
class FootballManager {
    constructor(data = {}) {
        this.id = data.id || generateId();
        this.careerId = data.career_id || data.careerId;
        this.footballTeamId = data.football_team_id || data.footballTeamId || null;
        this.name = data.name;
        this.nationality = data.nationality || null;
        this.age = data.age;
        this.salary = data.salary || 0;
        this.matchesManaged = data.matches_managed || data.matchesManaged || 0;
        this.wins = data.wins || 0;
        this.draws = data.draws || 0;
        this.losses = data.losses || 0;
        this.createdAt = data.created_at || data.createdAt || null;
        this.updatedAt = data.updated_at || data.updatedAt || null;
    }

    async save() {
        this.updatedAt = new Date().toISOString();

        const existing = await get('SELECT id FROM football_managers WHERE id = ?', [this.id]);
        if (existing) {
            await this.update();
        } else {
            await this.insert();
        }

        return this;
    }

    async insert() {
        await run(`
            INSERT INTO football_managers (
                id, career_id, football_team_id, name, nationality, age,
                salary, matches_managed, wins, draws, losses
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            this.id,
            this.careerId,
            this.footballTeamId,
            this.name,
            this.nationality,
            this.age,
            this.salary,
            this.matchesManaged,
            this.wins,
            this.draws,
            this.losses
        ]);
    }

    async update() {
        await run(`
            UPDATE football_managers SET
                football_team_id = ?,
                name = ?,
                nationality = ?,
                age = ?,
                salary = ?,
                matches_managed = ?,
                wins = ?,
                draws = ?,
                losses = ?,
                updated_at = ?
            WHERE id = ?
        `, [
            this.footballTeamId,
            this.name,
            this.nationality,
            this.age,
            this.salary,
            this.matchesManaged,
            this.wins,
            this.draws,
            this.losses,
            this.updatedAt,
            this.id
        ]);
    }

    static async findById(id) {
        const data = await get('SELECT * FROM football_managers WHERE id = ?', [id]);
        return data ? new FootballManager(data) : null;
    }
}

module.exports = FootballManager;

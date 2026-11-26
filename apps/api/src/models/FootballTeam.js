const { run, get, generateId } = require('../database');

// Colunas da tabela "football_teams" (ver database.js)
class FootballTeam {
    constructor(data = {}) {
        this.id = data.id || generateId();
        this.careerId = data.career_id || data.careerId;
        this.footballManagerId = data.football_manager_id || data.footballManagerId || null;
        this.name = data.name;
        this.shortName = data.short_name || data.shortName || null;
        this.country = data.country;
        this.league = data.league || null;
        this.value = data.value || null;
        this.transferBudget = data.transfer_budget || data.transferBudget || null;
        this.salaryBudget = data.salary_budget || data.salaryBudget || null;
        this.formation = data.formation || null;
        this.gamesPlayed = data.games_played || data.gamesPlayed || 0;
        this.wins = data.wins || 0;
        this.draws = data.draws || 0;
        this.losses = data.losses || 0;
        this.goalsFor = data.goals_for || data.goalsFor || 0;
        this.goalsAgainst = data.goals_against || data.goalsAgainst || 0;
        this.createdAt = data.created_at || data.createdAt || null;
        this.updatedAt = data.updated_at || data.updatedAt || null;
    }

    async save() {
        this.updatedAt = new Date().toISOString();

        const existing = await get('SELECT id FROM football_teams WHERE id = ?', [this.id]);
        if (existing) {
            await this.update();
        } else {
            await this.insert();
        }

        return this;
    }

    async insert() {
        await run(`
            INSERT INTO football_teams (
                id, career_id, football_manager_id, name, short_name, country, league,
                value, transfer_budget, salary_budget, formation,
                games_played, wins, draws, losses, goals_for, goals_against
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            this.id,
            this.careerId,
            this.footballManagerId,
            this.name,
            this.shortName,
            this.country,
            this.league,
            this.value,
            this.transferBudget,
            this.salaryBudget,
            this.formation,
            this.gamesPlayed,
            this.wins,
            this.draws,
            this.losses,
            this.goalsFor,
            this.goalsAgainst
        ]);
    }

    async update() {
        await run(`
            UPDATE football_teams SET
                football_manager_id = ?,
                name = ?,
                short_name = ?,
                country = ?,
                league = ?,
                value = ?,
                transfer_budget = ?,
                salary_budget = ?,
                formation = ?,
                games_played = ?,
                wins = ?,
                draws = ?,
                losses = ?,
                goals_for = ?,
                goals_against = ?,
                updated_at = ?
            WHERE id = ?
        `, [
            this.footballManagerId,
            this.name,
            this.shortName,
            this.country,
            this.league,
            this.value,
            this.transferBudget,
            this.salaryBudget,
            this.formation,
            this.gamesPlayed,
            this.wins,
            this.draws,
            this.losses,
            this.goalsFor,
            this.goalsAgainst,
            this.updatedAt,
            this.id
        ]);
    }

    static async findById(id) {
        const data = await get('SELECT * FROM football_teams WHERE id = ?', [id]);
        return data ? new FootballTeam(data) : null;
    }
}

module.exports = FootballTeam;

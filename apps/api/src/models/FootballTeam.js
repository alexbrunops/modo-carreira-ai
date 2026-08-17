const { db, run, get, all, generateId } = require('../database');

class FootballTeam {
    constructor(data) {
        this.id = generateId();
        this.careerId = data.careerId;
        this.footballManagerId = data.footballManagerId || null;
        this.name = data.name;
        this.shortName = data.shortName || null;
        this.country = data.country;
        this.league = data.league || null;
        this.value = data.value || null;
        this.transferBudget = data.transferBudget || null;
        this.salaryBudget = data.salaryBudget || null;
        this.formation = data.formation || null;
        this.gamesPlayed = data.gamesPlayed || null;
        this.wins = data.wins || null;
        this.draws = data.draws || null;
        this.losses = data.losses || null;
        this.goalsFor = data.goalsFor || null;
        this.goalsAgainst = data.goalsAgainst || null;
    }

    async save() {
        const now = new Date().toISOString();
        this.updatedAt = now();

        const existing = await this.existFootballTeam(this.id);

        if (existing) {
            this.update();
        } else {
            this.insert();
        }

        return this;
    }

    async existFootballManager(id) {
        const data = await get(`SELECT id FROM football_teams WHERE id = ?`, [id]);
        return data;
    }

    async getFootballTeamById(id) {
        const data = await get(`
            SELECT *
            FROM football_teams ft
            WHERE ft.id = ?
        `, [this.id]);
    }

    async insert() {
        const now = new Date().toISOString();
        await run(`
            INSERT INTO football_teams (
                id, career_id, football_manager_id, name, short_name, country, league, value, transfer_budget, salary_budget, formation, games_played, wins, draws, losses, goals_for, goals_against
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,[
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
}
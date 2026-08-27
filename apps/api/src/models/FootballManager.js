const { db, run, get, all, generateId } = require('../database');

class FootballManager {
    constructor(data) {
        this.id = generateId();
        this.careerId = data.careerId;
        this.footballTeamId = data.footballTeamId || null;
        this.name = data.name;
        this.nationality = data.nationality;
        this.age = data.age;
        this.salary = data.salary || 0;
        this.matchesManaged = data.matchesManaged || 0;
        this.wins = data.wins || 0;
        this.draws = data.draws || 0;
        this.losses = data.losses || 0;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    async save() {
        const now = new Date().toISOString();
        this.updatedAt = now();

        const existing = await this.existFootballManager(this.id);

        if (existing) {
            this.update();
        } else {
            this.insert();
        }

        return this;
    }

    async existFootballManager(id) {
        const data = await get(`SELECT id FROM football_managers WHERE id = ?`, [id]);
        return data;
    }

    async insert() {
        await run(`
            INSERT INTO football_managers (
                id, career_id, name, nationality, age, salary, matches_managed, wins, draws, losses
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,[
            this.id,
            this.careerId,
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
}
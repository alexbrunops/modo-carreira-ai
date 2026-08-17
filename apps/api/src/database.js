const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const crypto = require('crypto');

const db = new sqlite3.Database('./dev.db');

// Promisify
const run = promisify(db.run.bind(db));
const get = promisify(db.get.bind(db));
const all = promisify(db.all.bind(db));
const exec = promisify(db.exec.bind(db));

// Gerar ID único
function generateId() {
    return crypto.randomUUID();
}

// Inicializar tabelas
async function initDatabase() {
    await run(`PRAGMA foreign_keys = ON`);

    await run(`
        CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS careers (
            id TEXT PRIMARY KEY,
            FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
            career_name TEXT NOT NULL,
            sport TEXT NOT NULL,
            game_name TEXT NOT NULL,
            game_version TEXT NOT NULL,
            mode TEXT NOT NULL,
            currency TEXT,
            language TEXT,
            use_real_data INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            last_played TEXT,
            is_active INTEGER DEFAULT 1
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS football_managers (
            id TEXT PRIMARY KEY,
            FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
            FOREIGN KEY (football_team_id) REFERENCES football_teams(id),
            name TEXT NOT NULL,
            nationality TEXT,
            age INTEGER NOT NULL,
            salary INTEGER,
            matches_managed INTEGER,
            wins INTEGER,
            draws INTEGER,
            losses INTEGER,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS football_players (
            id TEXT PRIMARY KEY,
            FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
            FOREIGN KEY (football_team_id) REFERENCES footbal_teams(id),
            name TEXT NOT NULL,
            nationality TEXT,
            age INTEGER NOT NULL,
            overall INTEGER NOT NULL,
            position TEXT NOT NULL,
            secondary_position TEXT,
            preferred_foot TEXT,
            height INTEGER,
            weight INTEGER,
            pace INTEGER,
            shooting INTEGER,
            passing INTEGER,
            dribbling INTEGER,
            defending INTEGER,
            physical INTEGER,
            weak_foot INTEGER,
            skill_moves INTEGER,
            value INTEGER,
            salary INTEGER,
            contract_length INTEGER,
            release_clause INTEGER,
            appearances INTEGER,
            goals INTEGER,
            assists INTEGER,
            yellow_cards INTEGER,
            red_cards INTEGER,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS football_teams (
            id TEXT PRIMARY KEY,
            FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
            FOREIGN KEY (football_manager_id) REFERENCES football_managers(id),
            name TEXT NOT NULL,
            short_name TEXT,
            country TEXT NOT NULL,
            league TEXT,
            value INTEGER,
            transfer_budget INTEGER,
            salary_budget INTEGER,
            formation TEXT,
            games_played INTEGER DEFAULT 0,
            wins INTEGER DEFAULT 0,
            draws INTEGER DEFAULT 0,
            losses INTEGER DEFAULT 0,
            goals_for INTEGER DEFAULT 0,
            goals_against INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);

    // await run(`
    //     CREATE TABLE IF NOT EXISTS seasons (
    //         id TEXT PRIMARY KEY,
    //         FOREIGN KEY (career_id) REFERENCES careers(id),
    //         name TEXT NOT NULL,

    //     )
    // `);

    // await run(`
    //     CREATE TABLE IF NOT EXISTS leagues (
    //         id INTEGER PRIMARY KEY,
    //         name TEXT UNIQUE NOT NULL,
    //         country TEXT NOT NULL,
    //         level TEXT NOT NULL,
    //         season TEXT,
    //         created_at TEXT DEFAULT (datetime('now')),
    //         updated_at TEXT DEFAULT (datetime('now'))
    //     )
    // `);

    // await run(`
    //     CREATE TABLE IF NOT EXISTS league_table (
    //         id INTEGER PRIMARY KEY,
    //         league_id TEXT NOT NULL,
    //         team_id TEXT NOT NULL,
    //         position INTEGER NOT NULL,
    //         games INTEGER DEFAULT 0,
    //         wins INTEGER DEFAULT 0,
    //         draws INTEGER DEFAULT 0,
    //         losses INTEGER DEFAULT 0,
    //         goals_for INTEGER DEFAULT 0,
    //         goals_against INTEGER DEFAULT 0,
    //         points INTEGER DEFAULT 0,
    //         updated_at TEXT DEFAULT (datetime('now')),
    //         FOREIGN KEY (league_id) REFERENCES leagues(id),
    //         FOREIGN KEY (team_id) REFERENCES teams(id),
    //         UNIQUE(league_id, team_id)
    //     )
    // `);

    // Inserir dados de exemplo se estiver vazio
    // const teamCount = await get('SELECT COUNT(*) as count FROM teams');
    // if (teamCount.count === 0) {
    //     await insertSampleData();
    // }

    console.log('✅ Banco de dados inicializado');
}

// Dados de exemplo
async function insertSampleData() {
    const teams = [
        { id: generateId(), name: 'Flamengo', country: 'Brasil', league: 'Brasileirão', stadium: 'Maracanã', capacity: 78000 },
        { id: generateId(), name: 'Palmeiras', country: 'Brasil', league: 'Brasileirão', stadium: 'Allianz Parque', capacity: 43000 },
        { id: generateId(), name: 'Corinthians', country: 'Brasil', league: 'Brasileirão', stadium: 'Arena Corinthians', capacity: 49000 },
        { id: generateId(), name: 'São Paulo', country: 'Brasil', league: 'Brasileirão', stadium: 'Morumbi', capacity: 72000 }
    ];

    for (const team of teams) {
        await run(`
            INSERT INTO teams (id, name, country, league, stadium, capacity)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [team.id, team.name, team.country, team.league, team.stadium, team.capacity]);
    }

    const managers = [
        { id: generateId(), name: 'Tite', age: 62, nationality: 'Brasileiro' },
        { id: generateId(), name: 'Abel Ferreira', age: 44, nationality: 'Português' },
        { id: generateId(), name: 'Fernando Diniz', age: 49, nationality: 'Brasileiro' }
    ];

    for (const manager of managers) {
        await run(`
            INSERT INTO managers (id, name, age, nationality)
            VALUES (?, ?, ?, ?)
        `, [manager.id, manager.name, manager.age, manager.nationality]);
    }

    console.log('✅ Dados de exemplo inseridos');
}

module.exports = { db, run, get, all, exec, generateId, initDatabase };
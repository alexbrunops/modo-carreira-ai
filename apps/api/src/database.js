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
    return crypto.randomBytes(16).toString('hex');
}

// Inicializar tabelas
async function initDatabase() {
    await run(`
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            country TEXT NOT NULL,
            league TEXT,
            manager_id TEXT,
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

    await run(`
        CREATE TABLE IF NOT EXISTS managers (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            nationality TEXT NOT NULL,
            salary REAL,
            games_managed INTEGER DEFAULT 0,
            wins INTEGER DEFAULT 0,
            draws INTEGER DEFAULT 0,
            losses INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            nationality TEXT NOT NULL,
            position TEXT NOT NULL,
            value REAL,
            salary REAL,
            team_id TEXT,
            goals INTEGER DEFAULT 0,
            assists INTEGER DEFAULT 0,
            appearances INTEGER DEFAULT 0,
            yellow_cards INTEGER DEFAULT 0,
            red_cards INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (team_id) REFERENCES teams(id)
        )
    `);

    // await run(`
    //     CREATE TABLE IF NOT EXISTS events (
    //         id INTEGER PRIMARY KEY,
    //         event_id TEXT NOT NULL,
    //         event_label TEXT NOT NULL,
    //         event_icon TEXT NOT NULL,
    //         category TEXT NOT NULL,
    //         data TEXT,
    //         timestamp TEXT DEFAULT (datetime('now')),
    //         created_at TEXT DEFAULT (datetime('now'))
    //     )
    // `);

    await run(`
        CREATE TABLE IF NOT EXISTS leagues (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            country TEXT NOT NULL,
            level TEXT NOT NULL,
            season TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS league_table (
            id INTEGER PRIMARY KEY,
            league_id TEXT NOT NULL,
            team_id TEXT NOT NULL,
            position INTEGER NOT NULL,
            games INTEGER DEFAULT 0,
            wins INTEGER DEFAULT 0,
            draws INTEGER DEFAULT 0,
            losses INTEGER DEFAULT 0,
            goals_for INTEGER DEFAULT 0,
            goals_against INTEGER DEFAULT 0,
            points INTEGER DEFAULT 0,
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (league_id) REFERENCES leagues(id),
            FOREIGN KEY (team_id) REFERENCES teams(id),
            UNIQUE(league_id, team_id)
        )
    `);

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
const express = require('express');
const router = express.Router();
const { db, run, get, all, generateId } = require('../database');

// GET - Listar jogadores
router.get('/', async (req, res) => {
    try {
        const { team_id } = req.query;
        let query = `
            SELECT p.*, t.name as team_name 
            FROM players p
            LEFT JOIN teams t ON p.team_id = t.id
        `;
        const params = [];
        
        if (team_id) {
            query += ' WHERE p.team_id = ?';
            params.push(team_id);
        }
        
        query += ' ORDER BY p.name';
        
        const players = await all(query, params);
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar jogador por ID
router.get('/:id', async (req, res) => {
    try {
        const player = await get(`
            SELECT p.*, t.name as team_name 
            FROM players p
            LEFT JOIN teams t ON p.team_id = t.id
            WHERE p.id = ?
        `, [req.params.id]);
        
        if (!player) {
            return res.status(404).json({ error: 'Jogador não encontrado' });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar jogador por nome
router.get('/:name', async (req, res) => {
    try {
        const players = await all(`
            SELECT p.*, t.name as team_name 
            FROM players p
            LEFT JOIN teams t ON p.team_id = t.id
            WHERE p.name LIKE ?
            ORDER BY p.name
        `, [`%${req.params.name}%`]);
        
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar jogador
router.post('/', async (req, res) => {
    try {
        const { name, age, nationality, position, value, salary, team_id } = req.body;
        const id = generateId();
        
        await run(`
            INSERT INTO players (id, name, age, nationality, position, value, salary, team_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, name, age, nationality, position, value || null, salary || null, team_id || null]);
        
        const player = await get('SELECT * FROM players WHERE id = ?', [id]);
        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar jogador
router.put('/:id', async (req, res) => {
    try {
        const { name, age, nationality, position, value, salary, team_id, goals, assists, appearances } = req.body;
        
        await run(`
            UPDATE players 
            SET name = ?, age = ?, nationality = ?, position = ?, 
                value = ?, salary = ?, team_id = ?, 
                goals = ?, assists = ?, appearances = ?,
                updated_at = datetime('now')
            WHERE id = ?
        `, [name, age, nationality, position, value || null, salary || null, team_id || null, 
            goals || 0, assists || 0, appearances || 0, req.params.id]);
        
        const player = await get('SELECT * FROM players WHERE id = ?', [req.params.id]);
        if (!player) {
            return res.status(404).json({ error: 'Jogador não encontrado' });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Remover jogador
router.delete('/:id', async (req, res) => {
    try {
        const result = await run('DELETE FROM players WHERE id = ?', [req.params.id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Jogador não encontrado' });
        }
        res.json({ message: 'Jogador removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
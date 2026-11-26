const express = require('express');
const router = express.Router();
const { pick, insertRow, updateRow, missingFields, get, all, run } = require('./lib/crud');

// Tabela: football_players (ver database.js)
const FIELDS = ['career_id', 'football_team_id', 'name', 'nationality', 'age', 'overall', 'position', 'secondary_position', 'preferred_foot', 'height', 'weight', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical', 'weak_foot', 'skill_moves', 'value', 'salary', 'contract_length', 'release_clause', 'appearances', 'goals', 'assists', 'yellow_cards', 'red_cards'];
const REQUIRED = ['career_id', 'name', 'age', 'overall', 'position'];
const SELECT = `SELECT x.*, t.name AS team_name FROM football_players x LEFT JOIN football_teams t ON x.football_team_id = t.id`;

// GET - Listar (filtros opcionais: career_id, football_team_id)
router.get('/', async (req, res) => {
    try {
        const where = [];
        const params = [];
        for (const filter of ['career_id', 'football_team_id']) {
            if (req.query[filter]) {
                where.push(`x.${filter} = ?`);
                params.push(req.query[filter]);
            }
        }
        const rows = await all(
            `${SELECT} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY x.name`,
            params
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar por nome
// (precisa vir antes de /:id, senão o Express nunca chega aqui)
router.get('/search/:name', async (req, res) => {
    try {
        const rows = await all(`${SELECT} WHERE x.name LIKE ? ORDER BY x.name`, [`%${req.params.name}%`]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar por ID
router.get('/:id', async (req, res) => {
    try {
        const row = await get(`${SELECT} WHERE x.id = ?`, [req.params.id]);
        if (!row) {
            return res.status(404).json({ error: 'Jogador não encontrado' });
        }
        res.json(row);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar
router.post('/', async (req, res) => {
    try {
        const missing = missingFields(req.body, REQUIRED);
        if (missing.length > 0) {
            return res.status(400).json({ error: `Campos obrigatórios: ${missing.join(', ')}` });
        }
        const id = await insertRow('football_players', pick(req.body, FIELDS));
        const row = await get(`${SELECT} WHERE x.id = ?`, [id]);
        res.status(201).json(row);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar (só os campos enviados)
router.put('/:id', async (req, res) => {
    try {
        const updates = pick(req.body, FIELDS.filter(f => f !== 'career_id'));
        const found = await updateRow('football_players', req.params.id, updates);
        if (!found) {
            return res.status(404).json({ error: 'Jogador não encontrado' });
        }
        const row = await get(`${SELECT} WHERE x.id = ?`, [req.params.id]);
        res.json(row);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Remover
router.delete('/:id', async (req, res) => {
    try {
        const result = await run('DELETE FROM football_players WHERE id = ?', [req.params.id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Jogador não encontrado' });
        }
        res.json({ message: 'Jogador removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

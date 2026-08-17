const express = require('express');
const router = express.Router();
const { db, run, get, all, generateId } = require('../database');

// GET - Listar todos os times
router.get('/', async (req, res) => {
    try {
        const teams = await all(`
            SELECT t.*, m.name as manager_name 
            FROM teams t
            LEFT JOIN managers m ON t.manager_id = m.id
            ORDER BY t.name
        `);
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar time por ID
// router.get('/:id', async (req, res) => {
//     try {
//         const team = await get(`
//             SELECT t.*, m.name as manager_name 
//             FROM teams t
//             LEFT JOIN managers m ON t.manager_id = m.id
//             WHERE t.id = ?
//         `, [req.params.id]);
        
//         if (!team) {
//             return res.status(404).json({ error: 'Time não encontrado' });
//         }
//         res.json(team);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// GET - Buscar time por nome
router.get('/:name', async (req, res) => {
    try {
        const teams = await all(`
            SELECT t.*, m.name as manager_name 
            FROM teams t
            LEFT JOIN managers m ON t.manager_id = m.id
            WHERE t.name LIKE ?
            ORDER BY t.name
        `, [`%${req.params.name}%`]);
        
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar novo time
router.post('/', async (req, res) => {
    try {
        const { name, country, league, stadium, capacity, manager_id } = req.body;
        const id = generateId();
        
        await run(`
            INSERT INTO teams (id, name, country, league, stadium, capacity, manager_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [id, name, country, league, stadium, capacity, manager_id || null]);
        
        const team = await get('SELECT * FROM teams WHERE id = ?', [id]);
        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar time
router.put('/:id', async (req, res) => {
    try {
        const { name, country, league, stadium, capacity, manager_id } = req.body;
        
        await run(`
            UPDATE teams 
            SET name = ?, country = ?, league = ?, stadium = ?, capacity = ?, manager_id = ?, updated_at = datetime('now')
            WHERE id = ?
        `, [name, country, league, stadium, capacity, manager_id || null, req.params.id]);
        
        const team = await get('SELECT * FROM teams WHERE id = ?', [req.params.id]);
        if (!team) {
            return res.status(404).json({ error: 'Time não encontrado' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Remover time
router.delete('/:id', async (req, res) => {
    try {
        const result = await run('DELETE FROM teams WHERE id = ?', [req.params.id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Time não encontrado' });
        }
        res.json({ message: 'Time removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
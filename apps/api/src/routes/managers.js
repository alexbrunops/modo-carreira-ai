const express = require('express');
const router = express.Router();
const { db, run, get, all, generateId } = require('../database');

// GET - Listar técnicos
router.get('/', async (req, res) => {
    try {
        const managers = await all(`
            SELECT m.*, t.name as team_name 
            FROM managers m
            LEFT JOIN teams t ON m.id = t.manager_id
            ORDER BY m.name
        `);
        res.json(managers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar técnico por ID
router.get('/:id', async (req, res) => {
    try {
        const manager = await get(`
            SELECT m.*, t.name as team_name 
            FROM managers m
            LEFT JOIN teams t ON m.id = t.manager_id
            WHERE m.id = ?
        `, [req.params.id]);
        
        if (!manager) {
            return res.status(404).json({ error: 'Técnico não encontrado' });
        }
        res.json(manager);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar técnico
router.post('/', async (req, res) => {
    try {
        const { name, age, nationality, salary } = req.body;
        const id = generateId();
        
        await run(`
            INSERT INTO managers (id, name, age, nationality, salary)
            VALUES (?, ?, ?, ?, ?)
        `, [id, name, age, nationality, salary || null]);
        
        const manager = await get('SELECT * FROM managers WHERE id = ?', [id]);
        res.status(201).json(manager);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar técnico
router.put('/:id', async (req, res) => {
    try {
        const { name, age, nationality, salary } = req.body;
        
        await run(`
            UPDATE managers 
            SET name = ?, age = ?, nationality = ?, salary = ?, updated_at = datetime('now')
            WHERE id = ?
        `, [name, age, nationality, salary || null, req.params.id]);
        
        const manager = await get('SELECT * FROM managers WHERE id = ?', [req.params.id]);
        if (!manager) {
            return res.status(404).json({ error: 'Técnico não encontrado' });
        }
        res.json(manager);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Remover técnico
router.delete('/:id', async (req, res) => {
    try {
        const result = await run('DELETE FROM managers WHERE id = ?', [req.params.id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Técnico não encontrado' });
        }
        res.json({ message: 'Técnico removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
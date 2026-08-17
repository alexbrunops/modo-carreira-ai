const express = require('express');
const router = express.Router();
const { db, run, get, all, generateId } = require('../database');

// GET - Listar contas
router.get('/', async(req, res) => {
    try { 
        const accounts = await all(`
            SELECT *
            FROM accounts a
            ORDER BY a.id
        `);
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar conta por ID
router.get('/:id', async(req, res) => {
    try {
        const account = await get(`
            SELECT *
            FROM accounts a
            WHERE a.id = ?
        `, [req.params.id]);

        if (!account) {
            return res.status(404).json({ error: 'Conta não encontrada' });
        }
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar conta por email
router.get('/:email', async(req, res) => {
    try {
        const account = await get(`
            SELECT *
            FROM accounts a
            WHERE a.email = ?
        `, [req.params.email]);

        if (!account) {
            return res.status(404).json({ error: 'Conta não encontrada' });
        }
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Login
router.post('/login', async (req, res) => {
    console.log('Calling accounts.login');
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email e senha são obrigatórios'
            });
        }

        const user = await get(`
            SELECT * FROM accounts a WHERE a.email = ?
        `, [email]);

        if (!user) {
            return res.status(401).json({ 
                error: 'Email ou senha inválidos' 
            });
        }

        if (user.password !== password) {
            return res.status(401).json({ 
                error: 'Email ou senha inválidos' 
            });
        }

        // Gerar token simples (ou JWT)
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

        // Não retornar a senha
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


// POST - Criar conta
router.post('/register', async(req, res) => {
    try {
        const { name, email, password } = req.body;
        // const id = generateId();

        await run(`
            INSERT INTO accounts (name, email, password)
            VALUES (?, ?, ?)
        `, [name, email, password]);

        const account = await get('SELECT * FROM accounts WHERE email = ?', [email]);
        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar conta
router.put('/:id', async(req, res) => {
    try {
        const { username, email, password } = req.body;

        await run(`
            UPDATE accounts
            SET username = ?, email = ?, password = ?, updated_at = datetime('now')
            WHERE id = ?
        `, [username, email, password, req.params.id]);

        const account = await get('SELECT * FROM accounts WHERE id = ?', [req.params.id]);
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Deletar conta
router.delete('/:id', async(req, res) => {
    try {
        await run('DELETE FROM accounts WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
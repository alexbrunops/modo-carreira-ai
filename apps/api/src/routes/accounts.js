const express = require('express');
const router = express.Router();
const { run, get, all, generateId } = require('../database');
const { hashPassword, isHashed, verifyPassword, createToken } = require('../services/auth');

const PUBLIC_FIELDS = 'id, name, email, created_at, updated_at';
const MIN_PASSWORD_LENGTH = 6;

function normalizeEmail(email) {
    return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

// Só o dono da conta pode alterá-la ou apagá-la
function requireOwner(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Faça login para continuar' });
    }
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
}

// GET - Listar contas (sem senha)
router.get('/', async (req, res) => {
    try {
        const accounts = await all(`SELECT ${PUBLIC_FIELDS} FROM accounts ORDER BY created_at`);
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Conta do usuário logado
router.get('/profile', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Faça login para continuar' });
        }
        const account = await get(`SELECT ${PUBLIC_FIELDS} FROM accounts WHERE id = ?`, [req.user.id]);
        if (!account) {
            return res.status(404).json({ error: 'Conta não encontrada' });
        }
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar conta por email
// (antes ficava atrás de /:id e nunca era alcançada)
router.get('/email/:email', async (req, res) => {
    try {
        const account = await get(`SELECT ${PUBLIC_FIELDS} FROM accounts WHERE email = ?`, [normalizeEmail(req.params.email)]);
        if (!account) {
            return res.status(404).json({ error: 'Conta não encontrada' });
        }
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar conta por ID
router.get('/:id', async (req, res) => {
    try {
        const account = await get(`SELECT ${PUBLIC_FIELDS} FROM accounts WHERE id = ?`, [req.params.id]);
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
    try {
        const email = normalizeEmail(req.body.email);
        const { password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const account = await get('SELECT * FROM accounts WHERE email = ?', [email]);
        if (!account || !verifyPassword(password, account.password)) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        // Conta antiga com senha em texto puro: passa a salvar com hash
        if (!isHashed(account.password)) {
            await run('UPDATE accounts SET password = ? WHERE id = ?', [hashPassword(password), account.id]);
        }

        const { password: _, ...user } = account;
        res.json({ token: createToken(user.id), user });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST - Criar conta (já devolve token, como o front espera)
router.post('/register', async (req, res) => {
    try {
        const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
        const email = normalizeEmail(req.body.email);
        const { password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({ error: `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres` });
        }

        const existing = await get('SELECT id FROM accounts WHERE email = ?', [email]);
        if (existing) {
            return res.status(409).json({ error: 'Já existe uma conta com este email' });
        }

        const id = generateId();
        await run(
            'INSERT INTO accounts (id, name, email, password) VALUES (?, ?, ?, ?)',
            [id, name, email, hashPassword(password)]
        );

        const user = await get(`SELECT ${PUBLIC_FIELDS} FROM accounts WHERE id = ?`, [id]);
        res.status(201).json({ token: createToken(id), user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar nome/email
router.put('/:id', requireOwner, async (req, res) => {
    try {
        const current = await get('SELECT * FROM accounts WHERE id = ?', [req.params.id]);
        if (!current) {
            return res.status(404).json({ error: 'Conta não encontrada' });
        }

        const name = typeof req.body.name === 'string' && req.body.name.trim() ? req.body.name.trim() : current.name;
        const email = req.body.email ? normalizeEmail(req.body.email) : current.email;

        if (email !== current.email) {
            const taken = await get('SELECT id FROM accounts WHERE email = ? AND id != ?', [email, current.id]);
            if (taken) {
                return res.status(409).json({ error: 'Já existe uma conta com este email' });
            }
        }

        await run(
            `UPDATE accounts SET name = ?, email = ?, updated_at = datetime('now') WHERE id = ?`,
            [name, email, current.id]
        );

        const account = await get(`SELECT ${PUBLIC_FIELDS} FROM accounts WHERE id = ?`, [current.id]);
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Trocar senha
router.put('/:id/change-password', requireOwner, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
        }
        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({ error: `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres` });
        }

        const account = await get('SELECT * FROM accounts WHERE id = ?', [req.params.id]);
        if (!account) {
            return res.status(404).json({ error: 'Conta não encontrada' });
        }
        if (!verifyPassword(currentPassword, account.password)) {
            return res.status(401).json({ error: 'Senha atual incorreta' });
        }

        await run(
            `UPDATE accounts SET password = ?, updated_at = datetime('now') WHERE id = ?`,
            [hashPassword(newPassword), account.id]
        );
        res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Deletar conta
router.delete('/:id', requireOwner, async (req, res) => {
    try {
        const result = await run('DELETE FROM accounts WHERE id = ?', [req.params.id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Conta não encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

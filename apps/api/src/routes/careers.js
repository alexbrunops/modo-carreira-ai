const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');
const Career = require('../models/Career')
const FootballManager = require('../models/FootballManager')
const FootballTeam = require('../models/FootballTeam')

// GET - Lista careers
router.get('/', async(req, res) => {
    try { 
        const careers = await all(`
            SELECT *
            FROM careers c
            ORDER BY c.created_at
        `);
        res.json(careers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar career por ID
router.get('/:id', async(req, res) => {
    try {
        const career = await get(`
            SELECT *
            FROM careers c
            WHERE c.id = ?
        `, [req.params.id]);

        if (!career) {
            return res.status(404).json({ error: 'Career não encontrada' });
        }
        res.json(career);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar career por account
router.get('/account/:accountId', async(req, res) => {
    try {
        const { accountId } = req.params;
        const career = await get(`
            SELECT *
            FROM careers c
            WHERE c.account_id = ?
            ORDER BY c.is_active DESC, c.last_played DESC
            LIMIT 1
        `, [accountId]);

        if (!career) {
            return res.status(404).json({ error: 'Career não encontrada' });
        }
        res.json(career);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Inserir career (cria carreira + treinador + time de uma vez)
router.post('/', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Faça login para criar uma carreira' });
    }

    const {
        careerName = 'Nova Carreira',
        sport = 'football',
        gameName,
        gameVersion,
        mode,
        userName,
        userAge,
        userNationality,
        userSalary,
        currency = 'BRL',
        language = 'pt-BR',
        useRealData = true,
        teamName,
        teamShortName,
        teamCountry,
        teamLeague,
        teamValue,
        teamTransferBudget,
        teamSalaryBudget,
        teamFormation
    } = req.body;

    const missing = [];
    if (!careerName) missing.push('Nome da Carreira');
    if (!gameName) missing.push('Nome do jogo');
    if (!gameVersion) missing.push('Versão do jogo');
    if (!userName) missing.push(mode === 'player' ? 'Nome do Jogador' : 'Nome do Treinador');
    if (!userAge) missing.push('Idade');
    if (!teamName) missing.push('Nome do Time');
    if (!teamCountry) missing.push('País do Time');
    if (!teamLeague) missing.push('Liga');
    if (missing.length > 0) {
        return res.status(400).json({ error: `Campos obrigatórios: ${missing.join(', ')}` });
    }

    if (!['manager', 'player'].includes(mode)) {
        return res.status(400).json({ error: 'Modo deve ser "manager" ou "player"' });
    }
    if (mode === 'player') {
        return res.status(501).json({ error: 'O modo jogador ainda não está disponível' });
    }

    try {
        const existing = await Career.search({ accountId: req.user.id, name: careerName, limit: 1 });
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Já existe um modo carreira com este nome' });
        }

        await run('BEGIN');

        const career = new Career({
            accountId: req.user.id,
            name: careerName,
            sport,
            gameName,
            gameVersion,
            mode,
            currency,
            language,
            useRealData
        });
        await career.save();

        const footballManager = new FootballManager({
            careerId: career.id,
            name: userName,
            nationality: userNationality,
            age: userAge,
            salary: userSalary
        });
        await footballManager.save();

        const footballTeam = new FootballTeam({
            careerId: career.id,
            footballManagerId: footballManager.id,
            name: teamName,
            shortName: teamShortName,
            country: teamCountry,
            league: teamLeague,
            value: teamValue,
            transferBudget: teamTransferBudget,
            salaryBudget: teamSalaryBudget,
            formation: teamFormation
        });
        await footballTeam.save();

        footballManager.footballTeamId = footballTeam.id;
        await footballManager.save();

        await run('COMMIT');

        res.status(201).json({
            message: 'Carreira criada com sucesso',
            career,
            footballManager,
            footballTeam
        });
    } catch (error) {
        await run('ROLLBACK').catch(() => {});
        console.error('Erro ao criar carreira:', error);
        res.status(500).json({ error: error.message });
    }
});

// Só o dono da carreira pode alterá-la ou apagá-la
async function loadOwnedCareer(req, res) {
    if (!req.user) {
        res.status(401).json({ error: 'Faça login para continuar' });
        return null;
    }
    const career = await Career.findById(req.params.id);
    if (!career) {
        res.status(404).json({ error: 'Modo carreira não encontrado' });
        return null;
    }
    if (career.accountId !== req.user.id) {
        res.status(403).json({ error: 'Acesso negado' });
        return null;
    }
    return career;
}

// ============================================
// PUT /api/careers/:id
// Atualizar career
// ============================================
router.put('/:id', async (req, res) => {
    try {
        const career = await loadOwnedCareer(req, res);
        if (!career) return;

        const {
            name,
            sport,
            gameName,
            gameVersion,
            mode,
            currency,
            language,
            useRealData,
            isActive
        } = req.body;

        if (name !== undefined) career.name = name;
        if (sport !== undefined) career.sport = sport;
        if (gameName !== undefined) career.gameName = gameName;
        if (gameVersion !== undefined) career.gameVersion = gameVersion;
        if (mode !== undefined) career.mode = mode;
        if (currency !== undefined) career.currency = currency;
        if (language !== undefined) career.language = language;
        if (useRealData !== undefined) career.useRealData = useRealData ? 1 : 0;
        if (isActive !== undefined) career.isActive = isActive ? 1 : 0;

        await career.save();

        res.json({
            message: 'Modo carreira atualizado com sucesso',
            career
        });
    } catch (error) {
        console.error('Erro ao atualizar career:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ============================================
// DELETE /api/careers/:id
// Deletar career (treinador, time e jogadores saem junto, via ON DELETE CASCADE)
// ============================================
router.delete('/:id', async (req, res) => {
    try {
        const career = await loadOwnedCareer(req, res);
        if (!career) return;

        await career.delete();

        // Se deletou a career ativa, ativar a mais recente
        if (career.isActive) {
            const [latest] = await Career.findByAccountId(career.accountId, { limit: 1 });
            if (latest) {
                await latest.setActive(true);
            }
        }

        res.json({
            message: 'Modo carreira deletado com sucesso',
            deletedId: req.params.id
        });
    } catch (error) {
        console.error('Erro ao deletar career:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ============================================
// DELETE /api/careers/account/:accountId
// Deletar todas as careers de uma conta
// ============================================
router.delete('/account/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;

        if (!req.user) {
            return res.status(401).json({ error: 'Faça login para continuar' });
        }
        if (accountId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const deleted = await Career.deleteByAccountId(accountId);

        res.json({
            message: `${deleted} modo(s) carreira deletado(s) com sucesso`,
            deleted
        });
    } catch (error) {
        console.error('Erro ao deletar careers da conta:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;

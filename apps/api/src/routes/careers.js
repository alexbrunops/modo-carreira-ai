const express = require('express');
const router = express.Router();
const { db, run, get, all, generateId } = require('../database');
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
        `, [accountId]);

        if (!career) {
            return res.status(404).json({ error: 'Career não encontrada' });
        }
        res.json(career);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Inserir career
router.post('/', async(req, res) =>{
    try {
        let { footballManager, footballTeam } = any;
        const {
            careerName = 'Nova Carreira',
            sport,
            gameName,
            gameVersion,
            mode,
            userName,
            userAge,
            userNationality,
            currency = 'BRL',
            language = 'pt-BR',
            useRealData = true,
            teamName,
            teamShortName,
            teamCountry,
            teamLeague,
            teamValue,
            teamTransferBudget
        } = req.body;

        if (!careerName) {
            return res.status(400).json({ error: 'Nome da Carreira é obrigatório' });
        }

        if (!sport) {
            return res.status(400).json({ error: 'Esporte é obrigatório' });
        }

        if (!gameName) {
            return res.status(400).json({ error: 'Nome do jogo é obrigatório' });
        }

        if (!gameVersion) {
            return res.status(400).json({ error: 'Versão do Jogo é obrigatório' });
        }

        if (!mode || !['manager', 'player'].includes(mode)) {
            return res.status(400).json({ 
                error: 'Modo deve ser "manager" ou "player"' 
            });
        }

        if (!userName) {
            return res.status(400).json({ error: `Nome do ${mode === 'manager' ? 'Treinador' : 'Jogador'} é obrigatório` });
        }

        if (!teamName) {
            return res.status(400).json({ error: 'Nome do Time é obrigatório' });
        }

        if (!teamLeague) {
            return res.status(400).json({ error: 'Liga é obrigatório' });
        }

        if (!careerName) {
            return res.status(400).json({ error: 'Nome da Carreira é obrigatório' });
        }

        // Verificar se já existe uma career com este nome para o usuário
        // const existing = await Career.search({
        //     userId: req.user.id,
        //     name: careerName
        // });

        // if (existing.length > 0) {
        //     return res.status(409).json({ 
        //         error: 'Já existe um modo carreira com este nome' 
        //     });
        // }

        // Criar carreira
        const career = new Career({
            accountId: req.body.accountId,
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

        if (mode === 'manager') {
            // Criar treinador
            footballManager = new FootballManager({
                careerId: career.id,
                name: userName,
                nationality: userNationality,
                age: userAge,
                salary
            });
            footballManager.save();
        } else if (mode === 'player') {
            // Criar jogador
        } else {
            res.status(500).json({
                error: 'Modo de jogo precisa ser Treinador ou Jogador'
            });
        }

        // Criar time
        footballTeam = new FootballTeam({
            careerId: career.id,
            footballManagerId: footballManager.id,
            name: teamName,
            shortName: teamShortName,
            country: teamCountry,
            league: teamLeague,
            valur: teamValue,
            transferBudget: teamTransferBudget
        });

        footballTeam.save();

        footballManager.footballTeamId = footballTeam.id;
        footballManager.save();

        res.status(201).json({
            message: 'Carreira criada com sucesso',
            career
        });

    } catch (error) {
        console.log('Erro ao criar carreira: ', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// PUT /api/careers/:id
// Atualizar career
// ============================================
router.put('/:id', async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);

        if (!career) {
            return res.status(404).json({ error: 'Modo carreira não encontrado' });
        }

        // Verificar permissão
        if (career.userId !== req.user?.id && !req.user?.isAdmin) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const {
            name,
            sport,
            gameName,
            gameVersion,
            mode,
            protagonistType,
            protagonistId,
            teamId,
            currency,
            language,
            useRealData,
            isActive
        } = req.body;

        // Atualizar campos
        if (name !== undefined) career.name = name;
        if (sport !== undefined) career.sport = sport;
        if (gameName !== undefined) career.gameName = gameName;
        if (gameVersion !== undefined) career.gameVersion = gameVersion;
        if (mode !== undefined) career.mode = mode;
        if (protagonistType !== undefined) career.protagonistType = protagonistType;
        if (protagonistId !== undefined) career.protagonistId = protagonistId;
        if (teamId !== undefined) career.teamId = teamId;
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
// Deletar career
// ============================================
router.delete('/:id', async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);

        if (!career) {
            return res.status(404).json({ error: 'Modo carreira não encontrado' });
        }

        // Verificar permissão
        if (career.userId !== req.user?.id && !req.user?.isAdmin) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        await career.delete();

        // Se deletou a career ativa, ativar a mais recente
        if (career.isActive) {
            const activeCareers = await Career.findByUserId(career.userId, { activeOnly: true, limit: 1 });
            if (activeCareers.length > 0) {
                await activeCareers[0].setActive(true);
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
// DELETE /api/careers/user/:userId
// Deletar todas as careers de um usuário
// ============================================
router.delete('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar permissão
        if (userId !== req.user?.id && !req.user?.isAdmin) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const count = await Career.countByUserId(userId);
        const deleted = await Career.deleteByUserId(userId);

        res.json({
            message: `${deleted} modo(s) carreira deletado(s) com sucesso`,
            deleted: deleted,
            total: count
        });

    } catch (error) {
        console.error('Erro ao deletar careers do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
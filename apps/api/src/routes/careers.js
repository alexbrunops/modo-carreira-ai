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
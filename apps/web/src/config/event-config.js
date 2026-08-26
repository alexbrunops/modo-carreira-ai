import { TYPES } from './types';


export const EVENT_CONFIG = {
    // Eventos do Jogo
    initCareerMode: {
        id: 'initCareerMode',
        label: 'Iniciar Modo Carreira',
        category: 'jogo',
        fields: [
            { name: 'game', label: 'Jogo', type: 'text', placeholder: 'FIFA, EAFC, PES...', required: true },
            { name: 'gameVersion', label: 'Versão do Jogo', type: 'text', required: true },
            { name: 'mode', label: 'Modo de Jogo', type: 'select', options: ['Treinador', 'Jogador'], required: true },
            { name: 'playerName', label: 'Nome', type: 'text', placeholder: 'Nome do Jogador/Treinador', required: true },
            { name: 'country', label: 'País de Origem', type: 'text' },
            { name: 'team', label: 'Time', type: 'team' },
            { name: 'currency', label: 'Moeda', type: 'select', options: ['Dólar', 'Euro', 'Reais', 'Libras'], required: true },
            { name: 'financialTakeover', label: 'Incorporação Financeira', type: 'text' },
            { name: 'realData', label: 'Usar dados reais?', type: 'checkbox' },
            { name: 'background', label: 'Histórico', type: 'textarea', placeholder: 'Digite um breve histórico do treinador/jogador ...' }
        ]
    },

    initSeason: {
        id: 'initSeason',
        label: 'Iniciar Temporada',
        category: 'jogo',
        fields: [
            { name: 'season', label: 'Temporada', type: 'text', required: true },
            { name: 'team', label: 'Time', type: 'team', required: true },
            { name: 'competitions', label: 'Competições', type: 'text', required: true },
            { name: 'comment', label: 'Comentários', type: 'textarea', placeholder: 'Escreva algo relevante para o começo de temporada ...' }
        ]
    },
    endSeason: {
        id: 'endSeason',
        label: 'Finalizar Temporada',
        category: 'jogo',
        fields: [
            { name: 'season', label: 'Temporada', type: 'text', required: true },
            { name: 'comment', label: 'Comentários', type: 'textarea', placeholder: 'Escreva algo relevante para o fim de temporada ...' }
        ]
    },

    initPreSeason: {
        id: 'initPreSeason',
        label: 'Início de Campeonato de Pré-Temporada',
        category: 'jogo',
        fields: [
            { name: 'name', label: 'Nome', type: 'text', required: true },
            { name: 'teams', label: 'Times Participantes', type: 'text', required: true },
            { name: 'prize', label: 'Valor do Prémio', type: 'text' },
            { name: 'comment', label: 'Comentários', type: 'textarea', placeholder: 'Escreva algo relevante para o começo de pré temporada ...' }
        ]
    },

    // Eventos de Partida
    initMatch: {
        id: 'initMatch',
        label: 'Início da Partida',
        category: 'match',
        icon: '🏁',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'homeOrAway', label: 'Local do jogo', type: 'select', options: ['Em Casa', 'Estádio Adversário'], required: true },
            { name: 'opposingTeam', label: 'Time Adversário', type: 'teamStatus' },
            { name: 'hour', label: 'Hora', type: 'text' },
            { name: 'weather', label: 'Tempo', type: 'select', options: ['Limpo', 'Parcialmente Limpo', 'Nublado', 'Chuva', 'Neve'] },
            { name: 'competition', label: 'Competição', type: 'text', required: true },
            { name: 'round', label: 'Rodada', type: 'text' },
            { name: 'tatic', label: 'Tática', type: 'tatic' },
            { name: 'comments', label: 'Comentários', type: 'textarea', placeholder: 'Detalhes relevantes para a partida ...' }
        ]
    }, 
    halfTime: {
        id: 'halfTime',
        label: 'Intervalo',
        category: 'match',
        fields: [
            { name: 'homeScore', label: 'Placar Time da Casa', type: 'number', required: true, min: 0 },
            { name: 'awayScore', label: 'Placar Time Visitante', type: 'number', required: true, min: 0 },
            { name: 'homePossesion', label: 'Posse de Bola da Casa', type: 'number' },
            { name: 'awayPossesion', label: 'Posse de Bola Visitante', type: 'number' },
            { name: 'homeShots', label: 'Chutes a Gol da Casa', type: 'number' },
            { name: 'awayShots', label: 'Chutes a Gol Visitante', type: 'number' },
            { name: 'homePass', label: 'Tentativas de Passe da Casa', type: 'number' },
            { name: 'awayPass', label: 'Tentativas de Passe Visitante', type: 'number' },
            { name: 'summary', label: 'Resumo do Primeiro Tempo', type: 'textarea', placeholder: 'Descreva brevemente como foi o primeiro tempo...' }
        ]
    },
    endMatch: {
        id: 'endMatch',
        label: 'Fim da Partida',
        category: 'match',
        icon: '🏁',
        fields: [
            { name: 'homeScore', label: 'Placar Time da Casa', type: 'number', required: true, min: 0 },
            { name: 'awayScore', label: 'Placar Time Visitante', type: 'number', required: true, min: 0 },
            { name: 'manOfTheMatch', label: 'Melhor Jogador (MVP)', type: 'text' },
            { name: 'homePossesion', label: 'Posse de Bola da Casa', type: 'number' },
            { name: 'awayPossesion', label: 'Posse de Bola Visitante', type: 'number' },
            { name: 'homeShots', label: 'Chutes a Gol da Casa', type: 'number' },
            { name: 'awayShots', label: 'Chutes a Gol Visitante', type: 'number' },
            { name: 'homePass', label: 'Tentativas de Passe da Casa', type: 'number' },
            { name: 'awayPass', label: 'Tentativas de Passe Visitante', type: 'number' },
            { name: 'summary', label: 'Resumo da partida', type: 'textarea', placeholder: 'Descreva brevemente como foi o jogo...' },
        ]
    },
    goal: {
        id: 'goal',
        label: 'Gol',
        category: 'match',
        icon: '⚽',
        fields: [
            { name: 'minute', label: 'Minuto', type: 'number', required: true, min: 0, max: 120 },
            { name: 'player', label: 'Jogador', type: 'text', placeholder: 'Nome do jogador' },
            { name: 'team', label: 'Time', type: 'select', options: [], required: true },
            { name: 'assist', label: 'Assistência', type: 'text', placeholder: 'Quem deu a assistência?' },
            { name: 'goalType', label: 'Tipo de Gol', type: 'select', options: ['Cabeça', 'Chute', 'Falta', 'Pênalti', 'Bicicleta', 'Voleio', 'Gol Contra', 'Outro'] },
            { name: 'context', label: 'Contexto', type: 'textarea', placeholder: 'Descreva o momento do jogo...' }
        ]
    },
    substitution: {
        id: 'substitution',
        label: 'Substituição',
        category: 'match',
        icon: '🔄',
        fields: [
            { name: 'minute', label: 'Minuto', type: 'number', required: true, min: 0, max: 120 },
            { name: 'playerOut', label: 'Jogador Saiu', type: 'text', required: true },
            { name: 'playerIn', label: 'Jogador Entrou', type: 'text', required: true },
            { name: 'team', label: 'Time', type: 'select', options: [], required: true },
            { name: 'reason', label: 'Motivo', type: 'select', options: ['Rotação', 'Tática', 'Lesão', 'Físico', 'Técnico', 'Outro'] }
        ]
    },
    yellowCard: {
        id: 'yellowCard',
        label: 'Cartão Amarelo',
        category: 'match',
        fields: [
            { name: 'minute', label: 'Minuto', type: 'number', required: true, min: 0, max: 120 },
            { name: 'player', label: 'Jogador', type: 'text', required: true },
            { name: 'team', label: 'Time', type: 'select', options: [], required: true },
            { name: 'reason', label: 'Motivo', type: 'text', placeholder: 'Por que recebeu o cartão?' }
        ]
    },
    redCard: {
        id: 'redCard',
        label: 'Cartão Vermelho',
        category: 'match',
        fields: [
            { name: 'minute', label: 'Minuto', type: 'number', required: true, min: 0, max: 120 },
            { name: 'player', label: 'Jogador', type: 'text', required: true },
            { name: 'team', label: 'Time', type: 'select', options: [], required: true },
            { name: 'reason', label: 'Motivo', type: 'select', options: ['Falta Grave', 'Falta Matando Contra Ataque', 'Segundo Amarelo', 'Conduta Violenta', 'Mão na Bola', 'Outro'] }
        ]
    },
    penalty: {
        id: 'penalty',
        label: 'Pênalti',
        category: 'match',
        fields: [
            { name: 'minute', label: 'Minuto', type: 'number', required: true, min: 0, max: 120 },
            { name: 'player', label: 'Jogador que sofreu', type: 'text', required: true },
            { name: 'team', label: 'Time que sofreu', type: 'select', options: [], required: true },
            { name: 'scored', label: 'Gol marcado?', type: 'select', options: ['Sim', 'Não'] },
            { name: 'goalkeeper', label: 'Goleiro', type: 'text', placeholder: 'Goleiro que defendeu (se aplicável)' }
        ]
    },
    highlight: {
        id: 'highlight',
        label: 'Lance Importante',
        category: 'match',
        icon: '🎯',
        fields: [
            { name: 'minute', label: 'Minuto', type: 'number', required: true, min: 0, max: 120 },
            { name: 'description', label: 'Descrição do Lance', type: 'textarea', required: true, placeholder: 'Descreva o lance importante...' },
            { name: 'team', label: 'Time Envolvido', type: 'select', options: [] },
            { name: 'player', label: 'Jogador Envolvido', type: 'text' }
        ]
    },
    

    // Eventos Externos
    injury: {
        id: 'injury',
        label: 'Lesão',
        category: 'lesao',
        icon: '🏥',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'player', label: 'Jogador', type: 'text', required: true },
            { name: 'bodyPart', label: 'Parte do Corpo', type: 'select', options: ['Joelho', 'Tornozelo', 'Coxa', 'Pé', 'Ombro', 'Cabeça', 'Costas', 'Cotovelo', 'Outro'] },
            { name: 'severity', label: 'Gravidade', type: 'select', options: ['Leve (1-2 semanas)', 'Moderada (3-6 semanas)', 'Grave (2-3 meses)', 'Longa (6+ meses)'] },
            { name: 'context', label: 'Contexto', type: 'textarea', placeholder: 'Como ocorreu a lesão?' }
        ]
    },
    playerStatus: {
        id: 'playerStatus',
        label: 'Status do Jogador',
        category: 'jogador',
        icon: '🧍',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'player', label: 'Jogador', type: 'player' },
            { name: 'reason', label: 'Motivo/Descrição', type: 'textarea', placeholder: 'Descreva o que foi alterado no jogador...' }
        ]
    },
    playerAnalysis: {
        id: 'playerAnalysis',
        label: 'Análise do Jogador',
        category: 'jogador',
        icon: '📊',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'player', label: 'Jogador', type: 'player' },
            { name: 'source', label: 'Origem', type: 'select', options: ['Plantel', 'Base', 'Passe Livre', 'Outro Time'] },
            { name: 'analysis', label: 'Análise Detalhada', type: 'textarea', placeholder: 'Descreva outras informações relevantes do jogador...' }
        ]
    },
    movePlayerToProfissional: {
        id: 'movePlayerToProfissional',
        label: 'Promover Jogador',
        category: 'jogador',
        icon: '⬆️',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'player', label: 'Jogador', type: 'player' },
            { name: 'reason', label: 'Motivo', type: 'textarea', placeholder: 'Por que o jogador foi promovido?' }
        ]
    },
    clubStatus: {
        id: 'clubStatus',
        label: 'Status do Time',
        category: 'time',
        icon: '🏟️',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'team', label: 'Time', type: 'text', required: true },
            { name: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descreva a informação do time que você acha relevante...' }
        ]
    },
    transferProposal: {
        id: 'transferProposal',
        label: 'Proposta de Transferência',
        category: 'transferencia',
        icon: '📄',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'player', label: 'Jogador', type: 'player', required: true },
            { name: 'fromTeam', label: 'Time de Origem', type: 'text' },
            { name: 'toTeam', label: 'Time Interessado', type: 'text', required: true },
            { name: 'value', label: 'Valor da proposta', type: 'text' },
            { name: 'playerForTrade', label: 'Jogador Para Troca', type: 'text' },
            { name: 'salesClause', label: 'Cláusula de Venda (%)', type: 'number', min: 0, max: 100 },
            { name: 'transferType', label: 'Tipo de Transferência', type: 'select', options: ['Compra', 'Venda', 'Empréstimo', 'Empréstimo com Opção de Compra'] },
            { name: 'contractYears', label: 'Duração do Contrato (anos)', type: 'number', min: 0, max: 2 },
            { name: 'others', label: 'Outros detalhes', type: 'textarea', placeholder: 'Outros detalhes que você julgue relevante...' }
        ]
    },
    transfer: {
        id: 'transfer',
        label: 'Transferência',
        category: 'transferencia',
        icon: '💸',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'player', label: 'Jogador', type: 'text', required: true },
            { name: 'fromTeam', label: 'Time de Origem', type: 'text' },
            { name: 'toTeam', label: 'Time de Destino', type: 'text', required: true },
            { name: 'value', label: 'Valor da transferência', type: 'text' },
            { name: 'playerForTrade', label: 'Jogador Para Troca', type: 'text' },
            { name: 'transferType', label: 'Tipo', type: 'select', options: ['Compra', 'Venda', 'Empréstimo', 'Empréstimo c/ Opção de Compra', 'Transferência Livre', 'Renovação'] },
            { name: 'contractYears', label: 'Duração do Contrato (anos)', type: 'number', min: 0, max: 5 },
            { name: 'function', label: 'Função', type: 'select', options: ['Crucial', 'Importante', 'Rodízio', 'Esporádico', 'Promessa'] },
            { name: 'releaseClause', label: 'Multa de Rescição', type: 'text' },
            { name: 'salesClause', label: 'Cláusula de Venda (%)', type: 'number', min: 0, max: 100 },
            { name: 'salary', label: 'Salário', type: 'text' },
            { name: 'gloves', label: 'Luvas', type: 'text' },
            { name: 'bonus', label: 'Bônus', type: 'text' },
            { name: 'bonusCondition', label: 'Condição do Bônus', type: 'text', placeholder: 'Ex: Número de gols, partidas, títulos...' },
            { name: 'transferGrade', label: 'Nota da Transferência', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F'] },
            { name: 'gradeReason', label: 'Motivo para a nota', type: 'text' },
            { name: 'others', label: 'Outros detalhes', type: 'textarea', placeholder: 'Outros detalhes que você julgue relevante...' }
        ]
    },
    retirement: {
        id: 'retirement',
        label: 'Aposentadoria',
        category: 'carreira',
        icon: '👋',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'player', label: 'Jogador', type: 'text', required: true },
            { name: 'age', label: 'Idade', type: 'number', required: true },
            { name: 'when', label: 'Quando?', type: 'text' },
            { name: 'legacy', label: 'Legado', type: 'textarea', placeholder: 'Descreva a carreira do jogador...' }
        ]
    },
    clubChange: {
        id: 'clubChange',
        label: 'Mudança de time',
        category: 'carreira',
        icon: '🏛️',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'manager', label: 'Treinador', type: 'text', required: true },
            { name: 'fromTeam', label: 'Time Anterior', type: 'text', required: true },
            { name: 'toTeam', label: 'Novo Time', type: 'text', required: true },
            { name: 'reason', label: 'Motivo', type: 'select', options: ['Projeto', 'Financeiro', 'Familiar', 'Desafio', 'Outro'] },
            { name: 'accept', label: 'Aceitou?', type: 'select', options: ['Sim', 'Não', 'Avaliar Proposta'] }
        ]
    },
    leagueStatus: {
        id: 'leagueStatus',
        label: 'Status da Liga',
        category: 'liga',
        icon: '🏆',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'league', label: 'Liga', type: 'text', required: true, placeholder: 'Ex: Premier League' },
            { name: 'leader', label: 'Líder', type: 'text', required: true },
            { name: 'position', label: 'Posição do Jogador/Time', type: 'number', required: true, min: 1, max: 20 },
            { name: 'points', label: 'Pontos', type: 'number', required: true, min: 0 },
            { name: 'gamesPlayed', label: 'Jogos Disputados', type: 'number', min: 0 },
            { name: 'note', label: 'Observação', type: 'textarea', placeholder: 'Ex: Ainda faltam 5 rodadas...' }
        ]
    },
    finance: {
        id: 'finance',
        label: 'Finanças do time',
        category: 'financeiro',
        icon: '💰',
        fields: [
            { name: 'income', label: 'Receita', type: 'text', required: true },
            { name: 'expenses', label: 'Despesas', type: 'text', required: true }
        ]
    },
    talk: {
        id: 'talk',
        label: 'Conversa',
        category: 'comunicacao',
        icon: '💬',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'sender', label: 'Remetente', type: 'text', required: true },
            { name: 'recipient', label: 'Destinatário', type: 'text', required: true },
            { name: 'content', label: 'Conteúdo da Mensagem', type: 'textarea', required: true, placeholder: 'Escreva sua mensagem...' },
            { name: 'answer', label: 'Resposta', type: 'textarea', placeholder: 'Escreva sua resposta...' }
        ]
    },
    nationalTeamProposal: {
        id: 'nationalTeamProposal',
        label: 'Proposta Seleção',
        category: 'treinador',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'country', label: 'País', type: 'text', required: true },
            { name: 'reason', label: 'Motivo', type: 'textarea', placeholder: 'Por que deseja treinar a seleção?' },
            { name: 'accept', label: 'Aceitou?', type: 'select', options: ['Sim', 'Não', 'Avaliar Proposta'] }
        ]
    },
    leagueTable: {
        id: 'leagueTable',
        label: 'Tabela de Classificação',
        category: 'liga',
        icon: '📊',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'competition', label: 'Competição', type: 'text', required: true },
            { name: 'round', label: 'Rodada', type: 'text' },
            { name: 'rows', label: 'Linhas da Tabela', type: 'tableRows' }
        ]
    },
    award: {
        id: 'award',
        label: 'Premiação',
        category: 'liga',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'award', label: 'Premiação', type: 'text', required: true }
        ]
    },
    news: {
        id: 'news',
        label: 'Notícias',
        category: 'liga',
        fields: [
            { name: 'date', label: 'Data', type: 'date' },
            { name: 'news', label: 'Notícia', type: 'textarea', required: true }
        ]
    },
    endOfContract: {
        id: 'endOfContract',
        label: 'Fim de Contrato',
        category: 'jogador',
        fields: [
            { name: 'playerName', label: 'Nome do Jogador', type: 'text', required: true },
            { name: 'playerAge', label: 'Idade do Jogador', type: 'number', min: 15, max: 99 },
            { name: 'playerOVR', label: 'OVR do Jogador', type: 'number', min: 0, max: 99 },
            { name: 'playerMarketValue', label: 'Valor de Mercado', type: 'text' },
            { name: 'playerSalary', label: 'Salário', type: 'text' },
            { name: 'monthOfContract', label: 'Duração do contrato', type: 'number', min: 1, max: 12, required: true }
        ]
    }
};
export const TYPES = {
    // Configurações do jogador
    player: {
        id: 'player',
        label: 'Jogador',
        category: 'player',
        icon: '⚽',
        fields: [
            { name: 'name', label: 'Nome', type: 'text', required: true },
            { name: 'age', label: 'Idade', type: 'number', required: true, min: 15, max: 50 },
            { name: 'country', label: 'País de Origem', type: 'text' },
            { name: 'shirtNumber', label: '# da Camisa', type: 'number' },
            { name: 'overall', label: 'Overall', type: 'number', min: 0, max: 100 },
            { name: 'status', label: 'Status', type: 'text' },
            { name: 'potential', label: 'Potencial', type: 'text' },
            { name: 'position', label: 'Posição', type: 'text' },
            { name: 'team', label: 'Time', type: 'text' },
            { name: 'value', label: 'Valor de Mercado', type: 'text' },
            { name: 'salary', label: 'Salário', type: 'text' },
            { name: 'contractYears', label: 'Duração do Contrato (anos)', type: 'number', min: 0 },
            { name: 'fine', label: 'Multa Rescisória', type: 'text', min: 0 },
            { name: 'function', label: 'Função', type: 'select', options: ['Crucial', 'Importante', 'Rodízio', 'Esporádico', 'Promessa'] },
            { name: 'patch', label: 'Fase', type: 'select', options: ['Ótima', 'Boa', 'Regular', 'Ruim', 'Péssima'] },
            { name: 'availability', label: 'Disponibilidade', type: 'select', options: ['Pode Jogar', 'Contundido'] },
            { name: 'transfer', label: 'Transferência', type: 'select', options: ['Lista de Empréstimo', 'Lista de Transferência', 'Bloquear Propostas'] },
            { name: 'conditioning', label: 'Preparo Físico', type: 'number', min: 0, max: 100 },
            { name: 'gameRhythm', label: 'Ritmo de Jogo', type: 'number', min: 0, max: 100 },
            { name: 'status', label: 'Moral', type: 'select', options: ['Muito Feliz', 'Feliz', 'Contente', 'Insatisfeito', 'Muito Insatisfeito'], default: 'Contente' },
            { name: 'playerPerformance', label: 'Desempenho do Jogador', type: 'select', options: ['Bom', 'Neutro', 'Ruim'], default: 'Neutro' },
            { name: 'playingTime', label: 'Tempo de Jogo', type: 'select', options: ['Bom', 'Neutro', 'Ruim'], default: 'Neutro' },
            { name: 'teamPerformance', label: 'Desempenho do Time', type: 'select', options: ['Bom', 'Neutro', 'Ruim'], default: 'Neutro' },
            { name: 'contract', label: 'Contrato', type: 'select', options: ['Bom', 'Neutro', 'Ruim'], default: 'Neutro' }
        ]
    },
    tatic: {
        id: 'tatic',
        label: 'Tática',
        category: 'tatic',
        icon: '📋',
        fields: [
            { name: 'formation', label: 'Formação', type: 'text', placeholder: 'Ex: 4-3-3, 4-2-3-1, 4-4-2 ...' },
            { name: 'starter', label: 'Titulares', type: 'textarea' },
            { name: 'subs', label: 'Reservas', type: 'textarea' },
            { name: 'style', label: 'Estilo de Jogo', type: 'select', options: ['Ofensivo', 'Defensivo', 'Equilibrado'] },
            { name: 'strategy', label: 'Estratégia', type: 'textarea', placeholder: 'Descreva a estratégia da equipe...' }
        ]
    },
    tableRow: {
        id: 'tabelRow',
        label: 'Linha da Tabela',
        category: 'tabela',
        fields: [
            { name: 'team', label: 'Time', type: 'text', required: true },
            { name: 'gamesPlayed', label: 'J', type: 'number', required: true, min: 0 },
            { name: 'wins', label: 'V', type: 'number', required: true, min: 0 },
            { name: 'draws', label: 'E', type: 'number', required: true, min: 0 },
            { name: 'losses', label: 'D', type: 'number', required: true, min: 0 },
            { name: 'goalsFor', label: 'GP', type: 'number', required: true, min: 0 },
            { name: 'goalsAgainst', label: 'GC', type: 'number', required: true, min: 0 },
            { name: 'points', label: 'P', type: 'number', required: true, min: 0 }
        ]
    },
    teamStatus: {
        id: 'teamStatus',
        label: 'Status do Time',
        category: 'teamStatus',
        fields: [
            { name: 'name', label: 'Nome do Time', type: 'text', required: true },
            { name: 'position', label: 'Posição na Liga', type: 'text'},
            { name: 'victories', label: 'Vitórias', type: 'number', min: 0 },
            { name: 'draws', label: 'Empates', type: 'number', min: 0 },
            { name: 'defeats', label: 'Derrotas', type: 'number', min: 0 },
            { name: 'goalsScored', label: 'Gols Marcados', type: 'number', min: 0 },
            { name: 'goalsConceded', label: 'Gols Sofridos', type: 'number', min: 0 },
            { name: 'points', label: 'Pontos', type: 'number', min: 0 }
        ]
    },
    team: {
        id: 'team',
        label: 'Time',
        category: 'team',
        fields: [
            { name: 'teamName', label: 'Nome do Time', type: 'text', required: true },
            { name: 'teamLeague', label: 'Liga', type: 'text', required: true },
            { name: 'teamStadium', label: 'Estádio', type: 'text' },
            { name: 'teamValue', label: 'Valor do Time', type: 'text' },
            { name: 'budget', label: 'Verba Para Transferência', type: 'text' }
        ]
    }
}
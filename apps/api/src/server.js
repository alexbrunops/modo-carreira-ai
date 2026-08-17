const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDatabase } = require('./database');
const teamRoutes = require('./routes/teams');
const playerRoutes = require('./routes/players');
const managerRoutes = require('./routes/managers');
const aiRoutes = require('./routes/ai');
const accountRoutes = require('./routes/accounts');
// const eventRoutes = require('./routes/events');
// const leagueRoutes = require('./routes/leagues');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rotas
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/accounts', accountRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/leagues', leagueRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'online', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Erro interno do servidor'
    });
});

// Iniciar servidor
async function start() {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            console.log(`📊 Banco: ./dev.db`);
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

start();
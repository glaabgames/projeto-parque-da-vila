
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const quadrasRoutes = require('./routes/quadras');
const agendamentosRoutes = require('./routes/agendamentos');

const app = express();
const PORT = process.env.PORT || 3000;

// Verificar chave de segurança
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('Configure JWT_SECRET com pelo menos 32 caracteres.');
    process.exit(1);
}

// Configurações de segurança
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

app.use('/api/auth', authRoutes);
app.use('/api/quadras', quadrasRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

// Verificar funcionamento da API e do banco
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');

        res.json({
            status: 'ok',
            api: 'Parque Vivo',
            banco: 'conectado'
        });
    } catch (error) {
        console.error('Erro no banco:', error.message);

        res.status(503).json({
            status: 'erro',
            api: 'Parque Vivo',
            banco: 'indisponível'
        });
    }
});

// Rota para endereços inexistentes
app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada.'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor Parque Vivo rodando na porta ${PORT}`);
});

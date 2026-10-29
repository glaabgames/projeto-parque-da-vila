require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const pool = require('./db');
const authRoutes = require('./routes/auth');
const quadrasRoutes = require('./routes/quadras');
const agendamentosRoutes = require('./routes/agendamentos');

if (
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET.length < 32 ||
  process.env.JWT_SECRET.startsWith('troque_')
) {
  console.error(
    'Configure JWT_SECRET no arquivo .env com uma chave aleatória de pelo menos 32 caracteres.'
  );
  process.exit(1);
}

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.CLIENT_ORIGIN === '*'
        ? '*'
        : (process.env.CLIENT_ORIGIN || 'http://localhost:8081')
            .split(',')
            .map((v) => v.trim()),
  })
);

app.use(express.json({ limit: '20kb' }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Teste da API e da conexão com o MySQL
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      status: 'ok',
      api: 'Parque Vivo',
      banco: 'conectado',
    });
  } catch (error) {
    console.error('Erro na conexão com MySQL:', error.message);

    res.status(503).json({
      status: 'erro',
      api: 'Parque Vivo',
      banco: 'indisponível',
    });
  }
});

// Rotas do sistema
app.use('/api/auth', authRoutes);
app.use('/api/quadras', quadrasRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

// Rota inexistente
app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada.',
  });
});

// Tratamento de erros
app.use((err, _req, res, _next) => {
  console.error('Erro interno:', err);

  res.status(500).json({
    erro: 'Erro interno do servidor.',
  });
});

const port = Number(process.env.PORT || 3000);

const server = app.listen(port, () => {
  console.log(`API Parque Vivo rodando em http://localhost:${port}`);
});

async function encerrar() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);
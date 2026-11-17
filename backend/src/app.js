require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const mentoraRoutes = require('./routes/mentoraRoutes');
const oficinaRoutes = require('./routes/oficinaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const encontrosRoutes = require('./routes/encontrosRoutes');
const gamificacaoRoutes = require('./routes/gamificacaoRoutes');
const certificadoRoutes = require('./routes/certificadoRoutes');
const meninaRoutes = require('./routes/meninaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Trilha Digital rodando!');
});

app.get('/status-banco', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW()');
    res.json({ conectado: true, horario_banco: resultado.rows[0].now });
  } catch (erro) {
    res.status(500).json({ conectado: false, erro: erro.message });
  }
});

app.use('/api', authRoutes);
app.use('/api', mentoraRoutes);
app.use('/api', oficinaRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', encontrosRoutes);
app.use('/api', gamificacaoRoutes);
app.use('/api', certificadoRoutes);
app.use('/api', meninaRoutes);

// Rota inexistente.
app.use('/api', (req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Erro inesperado (ex.: JSON malformado no corpo da requisição).
app.use((erro, req, res, next) => {
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

module.exports = app;

// O servidor só sobe quando este arquivo é executado diretamente
// (node src/app.js). Os testes importam o `app` e abrem a própria porta.
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  // No Express 5, erros ao abrir a porta chegam como argumento do callback.
  app.listen(PORT, (erro) => {
    if (erro) {
      if (erro.code === 'EADDRINUSE') {
        console.error(
          `A porta ${PORT} já está em uso. Feche o outro servidor ou defina PORT no .env.`
        );
      } else {
        console.error('Não foi possível iniciar o servidor:', erro.message);
      }
      process.exit(1);
    }
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}
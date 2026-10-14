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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
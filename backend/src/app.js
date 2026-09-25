// Ponto de entrada do back-end (Trilha Digital)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// DEBUG temporário
console.log('--- DEBUG conexão ---');
console.log('DB_PASSWORD tipo:', typeof process.env.DB_PASSWORD);
console.log('DB_PASSWORD valor:', JSON.stringify(process.env.DB_PASSWORD));
console.log('----------------------');

app.get('/', (req, res) => {
  res.send('API Trilha Digital rodando!');
});

app.get('/status-banco', async (req, res) => {
  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'trilha_digital',
  });

  try {
    await client.connect();
    const resultado = await client.query('SELECT NOW()');
    res.json({ conectado: true, horario_banco: resultado.rows[0].now });
  } catch (erro) {
    res.status(500).json({ conectado: false, erro: erro.message });
  } finally {
    await client.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
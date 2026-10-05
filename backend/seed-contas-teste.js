require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

async function criarContasTeste() {
  const senhaHash = await bcrypt.hash('123456', 10);

  try {
    const mentora = await pool.query(
      `INSERT INTO usuario (nome, email, senha_hash, tipo)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Mentora Teste', 'mentora@teste.com', senhaHash, 'mentora']
    );
    await pool.query(`INSERT INTO mentora (usuario_id) VALUES ($1)`, [mentora.rows[0].id]);
    console.log('✅ Conta de mentora criada: mentora@teste.com / 123456');

    await pool.query(
      `INSERT INTO usuario (nome, email, senha_hash, tipo)
       VALUES ($1, $2, $3, $4)`,
      ['Coordenação Teste', 'coordenacao@teste.com', senhaHash, 'coordenacao']
    );
    console.log('✅ Conta de coordenação criada: coordenacao@teste.com / 123456');
  } catch (erro) {
    console.log('Erro (talvez as contas já existam):', erro.message);
  } finally {
    await pool.end();
  }
}

criarContasTeste();
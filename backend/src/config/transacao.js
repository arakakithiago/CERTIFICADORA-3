const pool = require('./db');

// Executa `fn(client)` dentro de uma transação: faz COMMIT se der certo e
// ROLLBACK se qualquer consulta falhar.
async function comTransacao(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const resultado = await fn(client);
    await client.query('COMMIT');
    return resultado;
  } catch (erro) {
    await client.query('ROLLBACK');
    throw erro;
  } finally {
    client.release();
  }
}

module.exports = comTransacao;

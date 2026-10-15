require('dotenv').config();
const { Client } = require('pg');

const dbName = process.env.DB_NAME || 'trilha_digital';
const connection = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
};

if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(dbName)) {
  throw new Error('DB_NAME deve conter apenas letras, números e underscores e não pode começar com número.');
}

async function setupDatabase() {
  const adminClient = new Client({
    ...connection,
    database: process.env.DB_ADMIN_DB || 'postgres',
  });

  await adminClient.connect();

  try {
    const resultado = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (resultado.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Banco "${dbName}" criado.`);
    } else {
      console.log(`Banco "${dbName}" já existe.`);
    }
  } finally {
    await adminClient.end();
  }

  const dbClient = new Client({
    ...connection,
    database: dbName,
  });
  await dbClient.connect();

  try {
    await dbClient.query('BEGIN');
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        senha_hash TEXT NOT NULL,
        tipo VARCHAR(20) NOT NULL
          CHECK (tipo IN ('menina', 'mentora', 'coordenacao')),
        ativo BOOLEAN NOT NULL DEFAULT TRUE,
        criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS menina (
        usuario_id INTEGER PRIMARY KEY
          REFERENCES usuario(id) ON DELETE CASCADE
      )
    `);
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS mentora (
        usuario_id INTEGER PRIMARY KEY
          REFERENCES usuario(id) ON DELETE CASCADE
      )
    `);
    await dbClient.query('COMMIT');
    console.log('Tabelas usuario, menina e mentora configuradas.');
  } catch (erro) {
    await dbClient.query('ROLLBACK');
    throw erro;
  } finally {
    await dbClient.end();
  }
}

setupDatabase().catch((erro) => {
  console.error('Falha ao configurar o banco PostgreSQL:', erro.message);
  process.exitCode = 1;
});

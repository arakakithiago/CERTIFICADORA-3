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

async function setupDatabase({ silencioso = false } = {}) {
  const log = silencioso ? () => {} : console.log;
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
      log(`Banco "${dbName}" criado.`);
    } else {
      log(`Banco "${dbName}" já existe.`);
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

    // Gamificação e pareamento: colunas extras da menina.
    await dbClient.query(`
      ALTER TABLE menina
        ADD COLUMN IF NOT EXISTS pontos INTEGER NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS mentora_id INTEGER
          REFERENCES mentora(usuario_id) ON DELETE SET NULL
    `);

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS oficinas (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        descricao TEXT,
        categoria VARCHAR(20) NOT NULL DEFAULT 'tecnologia',
        data TIMESTAMPTZ NOT NULL,
        local VARCHAR(150) NOT NULL DEFAULT 'UTFPR-CP',
        vagas INTEGER NOT NULL CHECK (vagas > 0),
        instrutora_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL,
        criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    // Caso a tabela já existisse com menos colunas.
    await dbClient.query(`
      ALTER TABLE oficinas
        ADD COLUMN IF NOT EXISTS categoria VARCHAR(20) NOT NULL DEFAULT 'tecnologia',
        ADD COLUMN IF NOT EXISTS local VARCHAR(150) NOT NULL DEFAULT 'UTFPR-CP'
    `);

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS inscricoes (
        id SERIAL PRIMARY KEY,
        oficina_id INTEGER NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
        menina_id INTEGER NOT NULL REFERENCES menina(usuario_id) ON DELETE CASCADE,
        presenca BOOLEAN NOT NULL DEFAULT FALSE,
        inscrito_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (oficina_id, menina_id)
      )
    `);
    // Auditoria: quem marcou/desmarcou a presença por último, e quando.
    await dbClient.query(`
      ALTER TABLE inscricoes
        ADD COLUMN IF NOT EXISTS registrado_por INTEGER
          REFERENCES usuario(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS registrado_em TIMESTAMPTZ
    `);

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS encontros_mentoria (
        id SERIAL PRIMARY KEY,
        mentora_id INTEGER NOT NULL REFERENCES mentora(usuario_id) ON DELETE CASCADE,
        menina_id INTEGER NOT NULL REFERENCES menina(usuario_id) ON DELETE CASCADE,
        data DATE NOT NULL,
        resumo TEXT NOT NULL,
        avaliacao_progresso SMALLINT CHECK (avaliacao_progresso BETWEEN 1 AND 5),
        criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS conquistas (
        id SERIAL PRIMARY KEY,
        menina_id INTEGER NOT NULL REFERENCES menina(usuario_id) ON DELETE CASCADE,
        nome_emblema VARCHAR(100) NOT NULL,
        conquistado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (menina_id, nome_emblema)
      )
    `);

    await dbClient.query('COMMIT');
    log(
      'Tabelas usuario, menina, mentora, oficinas, inscricoes, encontros_mentoria e conquistas configuradas.'
    );
  } catch (erro) {
    await dbClient.query('ROLLBACK');
    throw erro;
  } finally {
    await dbClient.end();
  }
}

module.exports = setupDatabase;

// Executado diretamente (npm run db:setup).
if (require.main === module) {
  setupDatabase().catch((erro) => {
    console.error('Falha ao configurar o banco PostgreSQL:', erro.message);
    process.exitCode = 1;
  });
}

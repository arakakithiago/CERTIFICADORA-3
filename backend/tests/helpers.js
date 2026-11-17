// Infraestrutura comum dos testes.
//
// Os testes usam um banco SEPARADO (por padrão "trilha_digital_teste"), que é
// criado automaticamente e esvaziado antes de cada arquivo de teste. O banco
// de desenvolvimento (DB_NAME do .env) nunca é tocado.

require('dotenv').config({ quiet: true });

const bancoDeTeste = process.env.DB_NAME_TESTE || 'trilha_digital_teste';
if (bancoDeTeste === process.env.DB_NAME) {
  // Proteção: os testes apagam todos os dados do banco que usam.
  throw new Error('DB_NAME_TESTE não pode ser igual a DB_NAME: os testes apagariam seus dados.');
}
process.env.DB_NAME = bancoDeTeste;

const setupDatabase = require('../setup-db');
const pool = require('../src/config/db');
const app = require('../src/app');

let servidor;
let base;
let coordenacaoId;

// Cria/atualiza as tabelas do banco de teste, apaga todos os dados e sobe a
// API numa porta livre. Também cria uma conta de coordenação, usada como
// `registrado_por` nas presenças.
async function iniciar() {
  await setupDatabase({ silencioso: true });
  await pool.query('TRUNCATE usuario, oficinas RESTART IDENTITY CASCADE');

  const coordenacao = await pool.query(
    `INSERT INTO usuario (nome, email, senha_hash, tipo)
     VALUES ('Coordenação', 'coordenacao@teste.com', 'sem-login', 'coordenacao')
     RETURNING id`
  );
  coordenacaoId = coordenacao.rows[0].id;

  await new Promise((resolve) => {
    servidor = app.listen(0, resolve);
  });
  base = `http://localhost:${servidor.address().port}/api`;
}

async function encerrar() {
  await new Promise((resolve) => servidor.close(resolve));
  await pool.end();
}

// Faz uma requisição e devolve { status, corpo }. PDFs voltam como
// { tipo, bytes } para facilitar as verificações.
async function chamar(metodo, rota, corpo) {
  const resposta = await fetch(base + rota, {
    method: metodo,
    headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const tipo = resposta.headers.get('content-type') || '';
  const dados = tipo.includes('application/json')
    ? await resposta.json()
    : { tipo, bytes: (await resposta.arrayBuffer()).byteLength };
  return { status: resposta.status, corpo: dados };
}

// ---------- Fábricas de dados ----------

let contador = 0;
const unico = () => `${Date.now()}${++contador}`;

async function criarMentora(dados = {}) {
  const r = await chamar('POST', '/mentoras', {
    nome: 'Mentora ' + unico(),
    email: `mentora${unico()}@teste.com`,
    senha: '123456',
    ...dados,
  });
  if (r.status !== 201) throw new Error(`criarMentora falhou: ${JSON.stringify(r.corpo)}`);
  return r.corpo.usuario;
}

async function criarMenina(dados = {}) {
  const r = await chamar('POST', '/registro', {
    nome: 'Menina ' + unico(),
    email: `menina${unico()}@teste.com`,
    senha: '123456',
    ...dados,
  });
  if (r.status !== 201) throw new Error(`criarMenina falhou: ${JSON.stringify(r.corpo)}`);
  return r.corpo.usuario;
}

// `diasAPartirDeHoje` negativo cria uma oficina que já aconteceu (a API permite
// cadastrar atividades passadas, por exemplo para registrar uma oficina antiga).
async function criarOficina({ diasAPartirDeHoje = 7, ...dados } = {}) {
  const data = new Date(Date.now() + diasAPartirDeHoje * 86400000).toISOString();
  const r = await chamar('POST', '/oficinas', {
    titulo: 'Oficina ' + unico(),
    data,
    vagas: 10,
    categoria: 'tecnologia',
    ...dados,
  });
  if (r.status !== 201) throw new Error(`criarOficina falhou: ${JSON.stringify(r.corpo)}`);
  return r.corpo.oficina;
}

// Inscreve e marca presença. Para oficinas passadas, a inscrição é feita
// direto no banco (a API não deixa se inscrever em oficina que já passou).
async function concluirOficina(oficina, menina) {
  if (new Date(oficina.data) < new Date()) {
    await pool.query('INSERT INTO inscricoes (oficina_id, menina_id) VALUES ($1, $2)', [
      oficina.id,
      menina.id,
    ]);
  } else {
    const r = await chamar('POST', '/oficinas/inscricao', {
      oficina_id: oficina.id,
      menina_id: menina.id,
    });
    if (r.status !== 201) throw new Error(`inscrição falhou: ${JSON.stringify(r.corpo)}`);
  }
  return marcarPresenca(oficina, menina);
}

// Marca (ou desmarca) a presença registrando a coordenação como autora,
// a menos que outro `registradoPor` seja informado.
function marcarPresenca(oficina, menina, { presenca, registradoPor = coordenacaoId } = {}) {
  return chamar('PATCH', '/oficinas/presenca', {
    oficina_id: oficina.id,
    menina_id: menina.id,
    registrado_por: registradoPor,
    ...(presenca === undefined ? {} : { presenca }),
  });
}

async function mentoraDe(meninaId) {
  const r = await pool.query('SELECT mentora_id FROM menina WHERE usuario_id = $1', [meninaId]);
  return r.rows[0].mentora_id;
}

module.exports = {
  iniciar,
  encerrar,
  chamar,
  urlApi: () => base,
  pool,
  criarMentora,
  criarMenina,
  criarOficina,
  concluirOficina,
  marcarPresenca,
  mentoraDe,
  idCoordenacao: () => coordenacaoId,
};

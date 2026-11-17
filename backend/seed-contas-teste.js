require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/config/db');
const comTransacao = require('./src/config/transacao');
const { parearPendentes } = require('./src/services/pareamentoService');
const { PONTOS, adicionarPontos, verificarEmblemas } = require('./src/services/gamificacaoService');

// Pode ser executado várias vezes: o que já existe é mantido.

const CONTAS = [
  { nome: 'Coordenação Teste', email: 'coordenacao@teste.com', tipo: 'coordenacao' },
  { nome: 'Mentora Teste', email: 'mentora@teste.com', tipo: 'mentora' },
  { nome: 'Bruna Teste', email: 'bruna@teste.com', tipo: 'menina' },
];

// Datas relativas a hoje, para que as oficinas futuras continuem futuras.
const OFICINAS = [
  {
    titulo: 'Introdução ao Desenvolvimento Web',
    descricao: 'Primeiros passos com HTML e CSS criando sua própria página.',
    categoria: 'tecnologia',
    dias: -10,
    vagas: 20,
  },
  {
    titulo: 'Oficina de Programação Web',
    descricao: 'Deixe sua página interativa com JavaScript.',
    categoria: 'tecnologia',
    dias: 7,
    vagas: 20,
  },
  {
    titulo: 'Inteligência Artificial para Iniciantes',
    descricao: 'Entenda como funcionam as IAs e treine seu primeiro modelo.',
    categoria: 'ia',
    dias: 14,
    vagas: 15,
  },
  {
    titulo: 'Design Thinking na Prática',
    descricao: 'Resolva problemas reais com criatividade e empatia.',
    categoria: 'design',
    dias: 21,
    vagas: 15,
  },
];

async function garantirUsuario(client, conta, senhaHash) {
  const resultado = await client.query(
    `INSERT INTO usuario (nome, email, senha_hash, tipo)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
    [conta.nome, conta.email, senhaHash, conta.tipo]
  );
  const criado = resultado.rows.length > 0;
  const id = criado
    ? resultado.rows[0].id
    : (await client.query(`SELECT id FROM usuario WHERE email = $1`, [conta.email])).rows[0].id;

  if (conta.tipo === 'mentora') {
    await client.query(`INSERT INTO mentora (usuario_id) VALUES ($1) ON CONFLICT DO NOTHING`, [id]);
  } else if (conta.tipo === 'menina') {
    await client.query(`INSERT INTO menina (usuario_id) VALUES ($1) ON CONFLICT DO NOTHING`, [id]);
  }

  console.log(`${criado ? '✅ Criada' : '• Já existia'}: ${conta.email} / 123456`);
  return id;
}

async function garantirOficina(client, oficina, instrutoraId) {
  const existente = await client.query(`SELECT id FROM oficinas WHERE titulo = $1`, [
    oficina.titulo,
  ]);
  if (existente.rows.length) return existente.rows[0].id;

  const resultado = await client.query(
    `INSERT INTO oficinas (titulo, descricao, categoria, data, local, vagas, instrutora_id)
     VALUES ($1, $2, $3,
             date_trunc('day', NOW()) + make_interval(days => $4) + INTERVAL '14 hours',
             'UTFPR-CP', $5, $6)
     RETURNING id`,
    [oficina.titulo, oficina.descricao, oficina.categoria, oficina.dias, oficina.vagas, instrutoraId]
  );
  console.log(`✅ Oficina criada: ${oficina.titulo}`);
  return resultado.rows[0].id;
}

async function criarDadosTeste() {
  const senhaHash = await bcrypt.hash('123456', 10);

  await comTransacao(async (client) => {
    const ids = {};
    for (const conta of CONTAS) {
      ids[conta.tipo] = await garantirUsuario(client, conta, senhaHash);
    }

    const oficinaIds = [];
    for (const oficina of OFICINAS) {
      oficinaIds.push(await garantirOficina(client, oficina, ids.mentora));
    }

    const pareadas = await parearPendentes(client);
    if (pareadas) console.log(`✅ ${pareadas} menina(s) pareada(s) com mentora.`);

    // Bruna já participou da oficina que passou: assim dá para testar o
    // certificado e as conquistas logo de cara.
    const presenca = await client.query(
      `INSERT INTO inscricoes (oficina_id, menina_id, presenca, registrado_por, registrado_em)
       VALUES ($1, $2, TRUE, $3, NOW())
       ON CONFLICT (oficina_id, menina_id) DO NOTHING
       RETURNING id`,
      [oficinaIds[0], ids.menina, ids.mentora]
    );
    if (presenca.rows.length) {
      await adicionarPontos(ids.menina, PONTOS.PRESENCA, client);
      console.log('✅ Presença da Bruna registrada na oficina já realizada.');
    }

    // E está inscrita na próxima oficina de programação.
    await client.query(
      `INSERT INTO inscricoes (oficina_id, menina_id) VALUES ($1, $2)
       ON CONFLICT (oficina_id, menina_id) DO NOTHING`,
      [oficinaIds[1], ids.menina]
    );

    const novas = await verificarEmblemas(ids.menina, client);
    if (novas.length) console.log(`✅ Conquistas da Bruna: ${novas.join(', ')}`);
  });
}

criarDadosTeste()
  .catch((erro) => {
    console.error('Erro ao criar dados de teste:', erro.message);
    console.error('Você executou "npm run db:setup" antes?');
    process.exitCode = 1;
  })
  .finally(() => pool.end());

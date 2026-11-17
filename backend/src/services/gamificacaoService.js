const pool = require('../config/db');

// Pontos concedidos automaticamente por cada ação da menina.
const PONTOS = {
  PRESENCA: 50,
  ENCONTRO: 30,
};

// Quantas atividades concluídas formam uma "trilha" completa.
const ATIVIDADES_POR_TRILHA = 5;

// Emblemas na mesma ordem e com os mesmos nomes usados no frontend.
const EMBLEMAS = [
  {
    nome: 'Primeiros Passos',
    descricao: 'Sua primeira atividade concluída',
    atingido: (s) => s.presencas >= 1,
  },
  {
    nome: 'Tech Explorer',
    descricao: '3 atividades de tecnologia',
    atingido: (s) => s.presencasTecnologia >= 3,
  },
  {
    nome: 'Future AI',
    descricao: 'Concluiu uma atividade de IA',
    atingido: (s) => s.presencasIa >= 1,
  },
  {
    nome: 'Mentoria em Ação',
    descricao: 'Primeiro encontro com sua mentora',
    atingido: (s) => s.encontros >= 1,
  },
  {
    nome: 'Criadora',
    descricao: `Concluiu sua primeira trilha (${ATIVIDADES_POR_TRILHA} atividades)`,
    atingido: (s) => s.presencas >= ATIVIDADES_POR_TRILHA,
  },
  {
    nome: 'Menina Digital',
    descricao: 'Todas as etapas completas',
    // Depende de todos os anteriores; avaliado depois deles.
    atingido: (s, conquistados) =>
      EMBLEMAS.slice(0, 5).every((e) => conquistados.has(e.nome)),
  },
];

async function obterEstatisticas(meninaId, db = pool) {
  const resultado = await db.query(
    `SELECT
       COUNT(*) FILTER (WHERE i.presenca) AS presencas,
       COUNT(*) FILTER (WHERE i.presenca AND o.categoria = 'tecnologia') AS presencas_tecnologia,
       COUNT(*) FILTER (WHERE i.presenca AND o.categoria = 'ia') AS presencas_ia,
       (SELECT COUNT(*) FROM encontros_mentoria e WHERE e.menina_id = $1) AS encontros
     FROM inscricoes i
     JOIN oficinas o ON o.id = i.oficina_id
     WHERE i.menina_id = $1`,
    [meninaId]
  );
  const linha = resultado.rows[0];
  return {
    presencas: Number(linha.presencas),
    presencasTecnologia: Number(linha.presencas_tecnologia),
    presencasIa: Number(linha.presencas_ia),
    encontros: Number(linha.encontros),
  };
}

// Confere as regras e grava os emblemas que a menina ainda não tinha.
// Retorna a lista de nomes dos emblemas recém-conquistados.
async function verificarEmblemas(meninaId, db = pool) {
  const estatisticas = await obterEstatisticas(meninaId, db);
  const existentes = await db.query(
    `SELECT nome_emblema FROM conquistas WHERE menina_id = $1`,
    [meninaId]
  );
  const conquistados = new Set(existentes.rows.map((r) => r.nome_emblema));
  const novos = [];

  for (const emblema of EMBLEMAS) {
    if (!conquistados.has(emblema.nome) && emblema.atingido(estatisticas, conquistados)) {
      await db.query(
        `INSERT INTO conquistas (menina_id, nome_emblema) VALUES ($1, $2)
         ON CONFLICT (menina_id, nome_emblema) DO NOTHING`,
        [meninaId, emblema.nome]
      );
      conquistados.add(emblema.nome);
      novos.push(emblema.nome);
    }
  }

  return novos;
}

// Soma (ou subtrai, se negativo) pontos sem deixar o total abaixo de zero.
// Retorna o total atualizado ou null se a menina não existir.
async function adicionarPontos(meninaId, pontos, db = pool) {
  const resultado = await db.query(
    `UPDATE menina SET pontos = GREATEST(pontos + $1, 0)
     WHERE usuario_id = $2
     RETURNING pontos`,
    [pontos, meninaId]
  );
  return resultado.rows.length ? resultado.rows[0].pontos : null;
}

async function listarConquistas(meninaId, db = pool) {
  const resultado = await db.query(
    `SELECT nome_emblema, conquistado_em FROM conquistas WHERE menina_id = $1`,
    [meninaId]
  );
  const porNome = new Map(resultado.rows.map((r) => [r.nome_emblema, r.conquistado_em]));

  return EMBLEMAS.map((e) => ({
    nome: e.nome,
    descricao: e.descricao,
    conquistado: porNome.has(e.nome),
    conquistado_em: porNome.get(e.nome) || null,
  }));
}

module.exports = {
  PONTOS,
  ATIVIDADES_POR_TRILHA,
  EMBLEMAS,
  obterEstatisticas,
  verificarEmblemas,
  adicionarPontos,
  listarConquistas,
};

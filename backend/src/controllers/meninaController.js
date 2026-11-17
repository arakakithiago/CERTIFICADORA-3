const pool = require('../config/db');
const {
  ATIVIDADES_POR_TRILHA,
  obterEstatisticas,
  listarConquistas,
} = require('../services/gamificacaoService');
const { parearPendentes } = require('../services/pareamentoService');

async function buscarMenina(id) {
  const resultado = await pool.query(
    `SELECT u.id, u.nome, u.email, me.pontos, me.mentora_id,
            um.nome AS mentora_nome, um.email AS mentora_email
     FROM menina me
     JOIN usuario u ON u.id = me.usuario_id
     LEFT JOIN usuario um ON um.id = me.mentora_id
     WHERE me.usuario_id = $1`,
    [id]
  );
  return resultado.rows[0] || null;
}

// Coordenação: todas as meninas com resumo de progresso e mentora.
async function listarMeninas(req, res) {
  try {
    const resultado = await pool.query(
      `SELECT u.id, u.nome, u.email, u.ativo, u.criado_em, me.pontos,
              me.mentora_id, um.nome AS mentora_nome,
              (SELECT COUNT(*)::int FROM inscricoes i WHERE i.menina_id = u.id) AS total_inscricoes,
              (SELECT COUNT(*)::int FROM inscricoes i WHERE i.menina_id = u.id AND i.presenca) AS atividades_concluidas,
              (SELECT COUNT(*)::int FROM conquistas c WHERE c.menina_id = u.id) AS total_conquistas
       FROM menina me
       JOIN usuario u ON u.id = me.usuario_id
       LEFT JOIN usuario um ON um.id = me.mentora_id
       ORDER BY u.nome`
    );
    res.json({ meninas: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar meninas.' });
  }
}

// Resumo da jornada: progresso, etapas da trilha, próxima atividade e mentora.
async function obterTrilha(req, res) {
  const { id } = req.params;

  try {
    const menina = await buscarMenina(id);
    if (!menina) {
      return res.status(404).json({ erro: 'Menina não encontrada.' });
    }

    const estatisticas = await obterEstatisticas(id);
    const conquistas = await listarConquistas(id);

    const inscricoes = await pool.query(
      `SELECT o.categoria, i.presenca, o.data
       FROM inscricoes i JOIN oficinas o ON o.id = i.oficina_id
       WHERE i.menina_id = $1`,
      [id]
    );
    const totalInscricoes = inscricoes.rows.length;
    const inscritaEmIa = inscricoes.rows.some((r) => r.categoria === 'ia');

    const proxima = await pool.query(
      `SELECT o.id, o.titulo, o.categoria, o.data, o.local,
              (o.vagas - (SELECT COUNT(*) FROM inscricoes x WHERE x.oficina_id = o.id))::int AS vagas_restantes
       FROM inscricoes i JOIN oficinas o ON o.id = i.oficina_id
       WHERE i.menina_id = $1 AND o.data >= NOW()
       ORDER BY o.data ASC
       LIMIT 1`,
      [id]
    );

    const status = (concluido, emAndamento) =>
      concluido ? 'concluido' : emAndamento ? 'em_andamento' : 'em_breve';

    const etapas = [
      { chave: 'cadastro', titulo: 'Cadastro', status: 'concluido' },
      {
        chave: 'primeira_oficina',
        titulo: 'Primeira oficina',
        status: status(estatisticas.presencas >= 1, totalInscricoes >= 1),
      },
      {
        chave: 'ia',
        titulo: 'IA para iniciantes',
        status: status(estatisticas.presencasIa >= 1, inscritaEmIa),
      },
      {
        chave: 'mentoria',
        titulo: 'Mentoria',
        status: status(estatisticas.encontros >= 1, Boolean(menina.mentora_id)),
      },
      {
        chave: 'projeto',
        titulo: 'Projeto próprio',
        status: status(
          estatisticas.presencas >= ATIVIDADES_POR_TRILHA,
          estatisticas.presencas >= 1
        ),
      },
    ];
    const concluidas = etapas.filter((e) => e.status === 'concluido').length;

    res.json({
      menina: {
        id: menina.id,
        nome: menina.nome,
        pontos: menina.pontos,
      },
      mentora: menina.mentora_id
        ? { id: menina.mentora_id, nome: menina.mentora_nome, email: menina.mentora_email }
        : null,
      percentual: Math.round((concluidas / etapas.length) * 100),
      atividadesConcluidas: estatisticas.presencas,
      totalAtividades: totalInscricoes,
      totalEncontros: estatisticas.encontros,
      badges: conquistas.filter((c) => c.conquistado).length,
      certificados: estatisticas.presencas,
      etapas,
      conquistas,
      proximaAtividade: proxima.rows[0] || null,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao carregar a trilha.' });
  }
}

// Recomenda oficinas futuras, com vaga e ainda não inscritas, priorizando
// categorias que a menina ainda não experimentou.
async function recomendarAtividades(req, res) {
  const { id } = req.params;
  const limite = Math.min(Number(req.query.limite) || 3, 20);

  try {
    const menina = await buscarMenina(id);
    if (!menina) {
      return res.status(404).json({ erro: 'Menina não encontrada.' });
    }

    const resultado = await pool.query(
      `WITH feitas AS (
         SELECT DISTINCT o.categoria
         FROM inscricoes i JOIN oficinas o ON o.id = i.oficina_id
         WHERE i.menina_id = $1
       )
       SELECT o.id, o.titulo, o.descricao, o.categoria, o.data, o.local, o.vagas,
              (o.vagas - COUNT(i.id))::int AS vagas_restantes,
              (o.categoria NOT IN (SELECT categoria FROM feitas)) AS categoria_nova
       FROM oficinas o
       LEFT JOIN inscricoes i ON i.oficina_id = o.id
       WHERE o.data >= NOW()
         AND NOT EXISTS (
           SELECT 1 FROM inscricoes x WHERE x.oficina_id = o.id AND x.menina_id = $1
         )
       GROUP BY o.id
       HAVING o.vagas - COUNT(i.id) > 0
       ORDER BY categoria_nova DESC, o.data ASC
       LIMIT $2`,
      [id, limite]
    );
    res.json({ recomendacoes: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao gerar recomendações.' });
  }
}

// Atividades com presença confirmada: são as que podem gerar certificado.
async function listarAtividadesConcluidas(req, res) {
  try {
    const resultado = await pool.query(
      `SELECT o.id, o.titulo, o.categoria, o.data, o.local
       FROM inscricoes i JOIN oficinas o ON o.id = i.oficina_id
       WHERE i.menina_id = $1 AND i.presenca
       ORDER BY o.data DESC`,
      [req.params.id]
    );
    res.json({ atividades: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar atividades concluídas.' });
  }
}

// Coordenação: força o pareamento das meninas que estão sem mentora.
async function executarPareamento(req, res) {
  try {
    const pareadas = await parearPendentes();
    const restantes = await pool.query(
      `SELECT COUNT(*)::int AS total FROM menina WHERE mentora_id IS NULL`
    );
    res.json({ pareadas, semMentora: restantes.rows[0].total });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao executar pareamento.' });
  }
}

module.exports = {
  listarMeninas,
  obterTrilha,
  recomendarAtividades,
  listarAtividadesConcluidas,
  executarPareamento,
};

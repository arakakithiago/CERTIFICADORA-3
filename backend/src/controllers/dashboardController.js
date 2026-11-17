const pool = require('../config/db');

// Indicadores de impacto para a coordenação.
async function obterIndicadores(req, res) {
  try {
    const geral = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM menina)::int AS total_meninas,
        (SELECT COUNT(*) FROM menina WHERE mentora_id IS NULL)::int AS meninas_sem_mentora,
        (SELECT COUNT(*) FROM usuario WHERE tipo = 'mentora' AND ativo)::int AS mentoras_ativas,
        (SELECT COUNT(*) FROM oficinas)::int AS total_oficinas,
        (SELECT COUNT(*) FROM oficinas WHERE data >= NOW())::int AS oficinas_futuras,
        (SELECT COUNT(*) FROM inscricoes)::int AS total_inscricoes,
        (SELECT COUNT(*) FROM inscricoes WHERE presenca)::int AS total_presencas,
        (SELECT COUNT(*) FROM encontros_mentoria)::int AS total_encontros,
        (SELECT COUNT(*) FROM conquistas)::int AS total_conquistas
    `);

    // A taxa de presença só considera oficinas que já aconteceram.
    const presenca = await pool.query(`
      SELECT COUNT(*)::int AS inscricoes_passadas,
             COUNT(*) FILTER (WHERE i.presenca)::int AS presencas_passadas
      FROM inscricoes i JOIN oficinas o ON o.id = i.oficina_id
      WHERE o.data < NOW()
    `);

    const porCategoria = await pool.query(`
      SELECT o.categoria,
             COUNT(DISTINCT o.id)::int AS oficinas,
             COUNT(i.id)::int AS inscricoes,
             COUNT(i.id) FILTER (WHERE i.presenca)::int AS presencas
      FROM oficinas o
      LEFT JOIN inscricoes i ON i.oficina_id = o.id
      GROUP BY o.categoria
      ORDER BY o.categoria
    `);

    const g = geral.rows[0];
    const p = presenca.rows[0];

    res.status(200).json({
      indicadores: {
        totalMeninas: g.total_meninas,
        meninasSemMentora: g.meninas_sem_mentora,
        mentorasAtivas: g.mentoras_ativas,
        totalOficinas: g.total_oficinas,
        oficinasFuturas: g.oficinas_futuras,
        totalInscricoes: g.total_inscricoes,
        totalPresencas: g.total_presencas,
        totalEncontros: g.total_encontros,
        totalConquistas: g.total_conquistas,
        taxaPresenca: p.inscricoes_passadas
          ? Math.round((p.presencas_passadas / p.inscricoes_passadas) * 100)
          : null,
      },
      porCategoria: porCategoria.rows,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao carregar o painel de indicadores.' });
  }
}

module.exports = { obterIndicadores };

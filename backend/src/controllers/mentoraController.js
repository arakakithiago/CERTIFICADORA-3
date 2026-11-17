const bcrypt = require('bcrypt');
const pool = require('../config/db');
const comTransacao = require('../config/transacao');
const { parearPendentes, redistribuirMentorandas } = require('../services/pareamentoService');

async function criarMentora(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = await comTransacao(async (client) => {
      const resultadoUsuario = await client.query(
        `INSERT INTO usuario (nome, email, senha_hash, tipo)
         VALUES ($1, $2, $3, 'mentora')
         RETURNING id, nome, email, tipo, ativo, criado_em`,
        [nome.trim(), email.trim().toLowerCase(), senhaHash]
      );
      const usuario = resultadoUsuario.rows[0];

      await client.query(`INSERT INTO mentora (usuario_id) VALUES ($1)`, [usuario.id]);

      // Meninas que estavam sem mentora passam a ter uma.
      const pareadas = await parearPendentes(client);
      return { usuario, pareadas };
    });

    res.status(201).json(resultado);
  } catch (erro) {
    if (erro.code === '23505') {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar mentora.' });
  }
}

async function listarMentoras(req, res) {
  try {
    const resultado = await pool.query(
      `SELECT u.id, u.nome, u.email, u.ativo, u.criado_em,
              COUNT(me.usuario_id)::int AS total_mentorandas
       FROM usuario u
       LEFT JOIN menina me ON me.mentora_id = u.id
       WHERE u.tipo = 'mentora'
       GROUP BY u.id
       ORDER BY u.criado_em DESC`
    );
    res.json({ mentoras: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar mentoras.' });
  }
}

async function editarMentora(req, res) {
  const { id } = req.params;
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Preencha nome e e-mail.' });
  }

  try {
    const resultado = await pool.query(
      `UPDATE usuario SET nome = $1, email = $2
       WHERE id = $3 AND tipo = 'mentora'
       RETURNING id, nome, email, ativo, criado_em`,
      [nome.trim(), email.trim().toLowerCase(), id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Mentora não encontrada.' });
    }

    res.json({ usuario: resultado.rows[0] });
  } catch (erro) {
    if (erro.code === '23505') {
      return res.status(409).json({ erro: 'Este e-mail já está em uso.' });
    }
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao editar mentora.' });
  }
}

async function alternarStatusMentora(req, res) {
  const { id } = req.params;

  try {
    const resultado = await comTransacao(async (client) => {
      const atualizado = await client.query(
        `UPDATE usuario SET ativo = NOT ativo
         WHERE id = $1 AND tipo = 'mentora'
         RETURNING id, nome, email, ativo, criado_em`,
        [id]
      );
      if (atualizado.rows.length === 0) return null;

      const usuario = atualizado.rows[0];
      // Desativada: suas mentorandas vão para outras mentoras.
      // Reativada: passa a receber as meninas que estavam sem mentora.
      const pareadas = usuario.ativo
        ? await parearPendentes(client)
        : await redistribuirMentorandas(usuario.id, client);

      return { usuario, pareadas };
    });

    if (!resultado) {
      return res.status(404).json({ erro: 'Mentora não encontrada.' });
    }

    res.json(resultado);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao alterar status da mentora.' });
  }
}

// Coordenação define uma nova senha provisória para a mentora.
async function redefinirSenhaMentora(req, res) {
  const { id } = req.params;
  const { senha } = req.body;

  if (!senha || String(senha).length < 6) {
    return res.status(400).json({ erro: 'A nova senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    const senhaHash = await bcrypt.hash(String(senha), 10);
    const resultado = await pool.query(
      `UPDATE usuario SET senha_hash = $1
       WHERE id = $2 AND tipo = 'mentora'
       RETURNING id`,
      [senhaHash, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Mentora não encontrada.' });
    }

    res.json({ mensagem: 'Senha redefinida.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao redefinir senha.' });
  }
}

// Meninas acompanhadas por uma mentora, com um resumo do progresso de cada uma.
async function listarMentorandas(req, res) {
  const { id } = req.params;

  try {
    const mentora = await pool.query(
      `SELECT id FROM usuario WHERE id = $1 AND tipo = 'mentora'`,
      [id]
    );
    if (mentora.rows.length === 0) {
      return res.status(404).json({ erro: 'Mentora não encontrada.' });
    }

    const resultado = await pool.query(
      `SELECT u.id, u.nome, u.email, me.pontos,
              (SELECT COUNT(*)::int FROM inscricoes i
                WHERE i.menina_id = me.usuario_id AND i.presenca) AS atividades_concluidas,
              (SELECT COUNT(*)::int FROM encontros_mentoria e
                WHERE e.menina_id = me.usuario_id) AS total_encontros,
              (SELECT MAX(e.data) FROM encontros_mentoria e
                WHERE e.menina_id = me.usuario_id) AS ultimo_encontro
       FROM menina me
       JOIN usuario u ON u.id = me.usuario_id
       WHERE me.mentora_id = $1
       ORDER BY u.nome`,
      [id]
    );
    res.json({ mentorandas: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar mentorandas.' });
  }
}

module.exports = {
  criarMentora,
  listarMentoras,
  editarMentora,
  alternarStatusMentora,
  redefinirSenhaMentora,
  listarMentorandas,
};

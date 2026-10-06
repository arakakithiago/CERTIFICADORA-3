const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function criarMentora(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const resultadoUsuario = await pool.query(
      `INSERT INTO usuario (nome, email, senha_hash, tipo)
       VALUES ($1, $2, $3, 'mentora')
       RETURNING id, nome, email, tipo, criado_em`,
      [nome, email, senhaHash]
    );

    const usuario = resultadoUsuario.rows[0];

    await pool.query(`INSERT INTO mentora (usuario_id) VALUES ($1)`, [usuario.id]);

    res.status(201).json({ usuario });
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
      `SELECT u.id, u.nome, u.email, u.ativo, u.criado_em
       FROM usuario u
       WHERE u.tipo = 'mentora'
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
      [nome, email, id]
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
    const resultado = await pool.query(
      `UPDATE usuario SET ativo = NOT ativo
       WHERE id = $1 AND tipo = 'mentora'
       RETURNING id, nome, email, ativo, criado_em`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Mentora não encontrada.' });
    }

    res.json({ usuario: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao alterar status da mentora.' });
  }
}

module.exports = { criarMentora, listarMentoras, editarMentora, alternarStatusMentora };
const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function registrar(req, res) {
  const { nome, email, senha } = req.body;
  const tipo = 'menina'; // Cadastro público é sempre do tipo "menina".
  // Mentoras e coordenação são cadastradas apenas pela administração,
  // através de uma rota protegida (a construir).

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const resultadoUsuario = await pool.query(
      `INSERT INTO usuario (nome, email, senha_hash, tipo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, tipo`,
      [nome, email, senhaHash, tipo]
    );

    const usuario = resultadoUsuario.rows[0];

    await pool.query(`INSERT INTO menina (usuario_id) VALUES ($1)`, [usuario.id]);

    res.status(201).json({ usuario });
  } catch (erro) {
    if (erro.code === '23505') {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar usuária.' });
  }
}

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha e-mail e senha.' });
  }

  try {
    const resultado = await pool.query(
      `SELECT id, nome, email, senha_hash, tipo FROM usuario WHERE email = $1`,
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const usuario = resultado.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    delete usuario.senha_hash;
    res.json({ usuario });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
}

module.exports = { registrar, login };
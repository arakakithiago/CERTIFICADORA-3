const bcrypt = require('bcrypt');
const pool = require('../config/db');
const comTransacao = require('../config/transacao');
const { parearMenina } = require('../services/pareamentoService');

async function registrar(req, res) {
  const { nome, email, senha } = req.body;
  const tipo = 'menina'; // Cadastro público é sempre do tipo "menina".
  // Mentoras são cadastradas pela coordenação (POST /api/mentoras).

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await comTransacao(async (client) => {
      const resultadoUsuario = await client.query(
        `INSERT INTO usuario (nome, email, senha_hash, tipo)
         VALUES ($1, $2, $3, $4)
         RETURNING id, nome, email, tipo`,
        [nome.trim(), email.trim().toLowerCase(), senhaHash, tipo]
      );
      const novo = resultadoUsuario.rows[0];

      await client.query(`INSERT INTO menina (usuario_id) VALUES ($1)`, [novo.id]);

      // Pareamento automático com a mentora ativa de menor carga.
      await parearMenina(novo.id, client);
      return novo;
    });

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
      `SELECT id, nome, email, senha_hash, tipo, ativo FROM usuario WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const usuario = resultado.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    if (!usuario.ativo) {
      return res
        .status(403)
        .json({ erro: 'Sua conta está inativa. Fale com a coordenação do projeto.' });
    }

    delete usuario.senha_hash;
    delete usuario.ativo;
    res.json({ usuario });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
}

// Confere se o usuário salvo no navegador ainda existe e está ativo.
// Devolve os dados atualizados (ex.: nome editado pela coordenação).
// 404 = conta não existe mais; 403 = conta desativada.
async function validarSessao(req, res) {
  try {
    const resultado = await pool.query(
      `SELECT id, nome, email, tipo, ativo FROM usuario WHERE id = $1`,
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Esta conta não existe mais.' });
    }

    const usuario = resultado.rows[0];
    if (!usuario.ativo) {
      return res
        .status(403)
        .json({ erro: 'Sua conta foi desativada. Fale com a coordenação do projeto.' });
    }

    delete usuario.ativo;
    res.json({ usuario });
  } catch (erro) {
    if (erro.code === '22P02') {
      // id que não é número
      return res.status(404).json({ erro: 'Esta conta não existe mais.' });
    }
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao validar sessão.' });
  }
}

module.exports = { registrar, login, validarSessao };

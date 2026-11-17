const pool = require('../config/db');
const comTransacao = require('../config/transacao');
const { PONTOS, adicionarPontos, verificarEmblemas } = require('../services/gamificacaoService');

// Mentora registra um encontro com uma de suas mentorandas.
async function registrarEncontro(req, res) {
  const { mentora_id, menina_id, data, resumo, avaliacao_progresso } = req.body;

  if (!mentora_id || !menina_id || !data || !resumo || !String(resumo).trim()) {
    return res.status(400).json({ erro: 'Mentora, menina, data e resumo são obrigatórios.' });
  }
  if (Number.isNaN(new Date(data).getTime())) {
    return res.status(400).json({ erro: 'Data inválida.' });
  }
  const avaliacao =
    avaliacao_progresso === undefined || avaliacao_progresso === null || avaliacao_progresso === ''
      ? null
      : Number(avaliacao_progresso);
  if (avaliacao !== null && (!Number.isInteger(avaliacao) || avaliacao < 1 || avaliacao > 5)) {
    return res.status(400).json({ erro: 'A avaliação de progresso deve ser de 1 a 5.' });
  }

  try {
    const resultado = await comTransacao(async (client) => {
      // A menina precisa estar pareada com essa mentora.
      const vinculo = await client.query(
        `SELECT 1 FROM menina WHERE usuario_id = $1 AND mentora_id = $2`,
        [menina_id, mentora_id]
      );
      if (vinculo.rows.length === 0) return null;

      const encontro = await client.query(
        `INSERT INTO encontros_mentoria (mentora_id, menina_id, data, resumo, avaliacao_progresso)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [mentora_id, menina_id, data, String(resumo).trim(), avaliacao]
      );
      const pontosAtuais = await adicionarPontos(menina_id, PONTOS.ENCONTRO, client);
      const novasConquistas = await verificarEmblemas(menina_id, client);

      return { encontro: encontro.rows[0], pontosAtuais, novasConquistas };
    });

    if (!resultado) {
      return res.status(403).json({ erro: 'Esta menina não é mentoranda desta mentora.' });
    }

    res.status(201).json({ mensagem: 'Encontro registrado com sucesso!', ...resultado });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao registrar encontro de mentoria.' });
  }
}

// Lista encontros filtrando por ?mentora_id= e/ou ?menina_id=.
async function listarEncontros(req, res) {
  const { mentora_id, menina_id } = req.query;

  if (!mentora_id && !menina_id) {
    return res.status(400).json({ erro: 'Informe mentora_id ou menina_id.' });
  }

  const condicoes = [];
  const params = [];
  if (mentora_id) {
    params.push(mentora_id);
    condicoes.push(`e.mentora_id = $${params.length}`);
  }
  if (menina_id) {
    params.push(menina_id);
    condicoes.push(`e.menina_id = $${params.length}`);
  }

  try {
    const resultado = await pool.query(
      `SELECT e.id, e.data, e.resumo, e.avaliacao_progresso, e.criado_em,
              e.mentora_id, um.nome AS mentora_nome,
              e.menina_id, ume.nome AS menina_nome
       FROM encontros_mentoria e
       JOIN usuario um ON um.id = e.mentora_id
       JOIN usuario ume ON ume.id = e.menina_id
       WHERE ${condicoes.join(' AND ')}
       ORDER BY e.data DESC, e.criado_em DESC`,
      params
    );
    res.json({ encontros: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar encontros.' });
  }
}

module.exports = { registrarEncontro, listarEncontros };

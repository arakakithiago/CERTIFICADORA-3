const comTransacao = require('../config/transacao');
const {
  adicionarPontos: somarPontos,
  verificarEmblemas,
  listarConquistas: buscarConquistas,
} = require('../services/gamificacaoService');

// Ajuste manual de pontos (ex.: coordenação bonifica uma participação).
// Presenças e encontros já pontuam automaticamente.
async function adicionarPontos(req, res) {
  const { menina_id } = req.body;
  const pontos = Number(req.body.pontos);

  if (!menina_id || !Number.isInteger(pontos) || pontos === 0) {
    return res.status(400).json({ erro: 'Informe a menina e um número inteiro de pontos.' });
  }

  try {
    const resultado = await comTransacao(async (client) => {
      const pontosAtuais = await somarPontos(menina_id, pontos, client);
      if (pontosAtuais === null) return null;
      const novasConquistas = await verificarEmblemas(menina_id, client);
      return { pontosAtuais, novasConquistas };
    });

    if (!resultado) {
      return res.status(404).json({ erro: 'Menina não encontrada.' });
    }

    res.status(200).json({ mensagem: 'Pontos atualizados com sucesso!', ...resultado });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao processar a gamificação.' });
  }
}

// Todos os emblemas, indicando quais a menina já conquistou.
async function listarConquistas(req, res) {
  try {
    const conquistas = await buscarConquistas(req.params.id);
    res.json({ conquistas });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar conquistas.' });
  }
}

module.exports = { adicionarPontos, listarConquistas };

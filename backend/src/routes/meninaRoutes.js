const express = require('express');
const router = express.Router();
const {
  listarMeninas,
  obterTrilha,
  recomendarAtividades,
  listarAtividadesConcluidas,
  executarPareamento,
} = require('../controllers/meninaController');

router.get('/meninas', listarMeninas);
router.get('/meninas/:id/trilha', obterTrilha);
router.get('/meninas/:id/recomendacoes', recomendarAtividades);
router.get('/meninas/:id/atividades-concluidas', listarAtividadesConcluidas);
router.post('/pareamento/executar', executarPareamento);

module.exports = router;

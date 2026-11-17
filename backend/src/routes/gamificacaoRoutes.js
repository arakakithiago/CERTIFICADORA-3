const express = require('express');
const router = express.Router();
const { adicionarPontos, listarConquistas } = require('../controllers/gamificacaoController');

router.post('/trilha/pontuar', adicionarPontos);
router.get('/meninas/:id/conquistas', listarConquistas);

module.exports = router;

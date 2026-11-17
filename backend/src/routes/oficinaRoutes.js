const express = require('express');
const router = express.Router();
const {
  cadastrarOficina,
  listarOficinas,
  obterOficina,
  editarOficina,
  excluirOficina,
  inscreverMenina,
  cancelarInscricao,
  listarInscricoes,
  registrarPresenca,
} = require('../controllers/oficinaController');

// Rotas fixas antes das rotas com :id, para não serem confundidas com um id.
router.post('/oficinas/inscricao', inscreverMenina);
router.delete('/oficinas/inscricao', cancelarInscricao);
router.patch('/oficinas/presenca', registrarPresenca);

router.get('/oficinas', listarOficinas);
router.post('/oficinas', cadastrarOficina);
router.get('/oficinas/:id', obterOficina);
router.put('/oficinas/:id', editarOficina);
router.delete('/oficinas/:id', excluirOficina);
router.get('/oficinas/:id/inscricoes', listarInscricoes);

module.exports = router;

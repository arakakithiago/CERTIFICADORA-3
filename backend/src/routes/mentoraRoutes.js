const express = require('express');
const router = express.Router();
const {
  criarMentora,
  listarMentoras,
  editarMentora,
  alternarStatusMentora,
  listarMentorandas,
  redefinirSenhaMentora,
} = require('../controllers/mentoraController');

router.post('/mentoras', criarMentora);
router.get('/mentoras', listarMentoras);
router.put('/mentoras/:id', editarMentora);
router.patch('/mentoras/:id/status', alternarStatusMentora);
router.patch('/mentoras/:id/senha', redefinirSenhaMentora);
router.get('/mentoras/:id/mentorandas', listarMentorandas);

module.exports = router;
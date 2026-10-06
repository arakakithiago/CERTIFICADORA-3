const express = require('express');
const router = express.Router();
const {
  criarMentora,
  listarMentoras,
  editarMentora,
  alternarStatusMentora,
} = require('../controllers/mentoraController');

router.post('/mentoras', criarMentora);
router.get('/mentoras', listarMentoras);
router.put('/mentoras/:id', editarMentora);
router.patch('/mentoras/:id/status', alternarStatusMentora);

module.exports = router;
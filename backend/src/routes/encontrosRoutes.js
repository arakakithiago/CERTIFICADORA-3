const express = require('express');
const router = express.Router();
const { registrarEncontro, listarEncontros } = require('../controllers/encontrosController');

router.post('/mentorias/encontros', registrarEncontro);
router.get('/mentorias/encontros', listarEncontros);

module.exports = router;

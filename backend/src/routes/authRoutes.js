const express = require('express');
const router = express.Router();
const { registrar, login, validarSessao } = require('../controllers/authController');

router.post('/registro', registrar);
router.post('/login', login);
router.get('/sessao/:id', validarSessao);

module.exports = router;

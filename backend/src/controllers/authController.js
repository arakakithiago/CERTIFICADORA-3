async function registrar(req, res) {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }

  if (!['menina', 'mentora', 'coordenacao'].includes(tipo)) {
    return res.status(400).json({ erro: 'Tipo de usuária inválido.' });
  }
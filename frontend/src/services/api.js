const API_URL = 'http://localhost:3000/api'

export async function registrar(dados) {
  const resposta = await fetch(`${API_URL}/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })

  const resultado = await resposta.json()

  if (!resposta.ok) {
    throw new Error(resultado.erro || 'Erro ao cadastrar.')
  }

  return resultado.usuario
}

export async function fazerLogin(dados) {
  const resposta = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })

  const resultado = await resposta.json()

  if (!resposta.ok) {
    throw new Error(resultado.erro || 'Erro ao fazer login.')
  }

  return resultado.usuario
}
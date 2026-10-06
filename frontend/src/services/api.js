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

export async function criarMentora(dados) {
  const resposta = await fetch(`${API_URL}/mentoras`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })

  const resultado = await resposta.json()

  if (!resposta.ok) {
    throw new Error(resultado.erro || 'Erro ao cadastrar mentora.')
  }

  return resultado.usuario
}

export async function listarMentoras() {
  const resposta = await fetch(`${API_URL}/mentoras`)
  const resultado = await resposta.json()

  if (!resposta.ok) {
    throw new Error(resultado.erro || 'Erro ao buscar mentoras.')
  }

  return resultado.mentoras
}

export async function editarMentora(id, dados) {
  const resposta = await fetch(`${API_URL}/mentoras/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })

  const resultado = await resposta.json()

  if (!resposta.ok) {
    throw new Error(resultado.erro || 'Erro ao editar mentora.')
  }

  return resultado.usuario
}

export async function alternarStatusMentora(id) {
  const resposta = await fetch(`${API_URL}/mentoras/${id}/status`, {
    method: 'PATCH',
  })

  const resultado = await resposta.json()

  if (!resposta.ok) {
    throw new Error(resultado.erro || 'Erro ao alterar status.')
  }

  return resultado.usuario
}
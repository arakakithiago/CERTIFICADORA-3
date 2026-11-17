// URL do backend. Pode ser trocada criando frontend/.env com VITE_API_URL=...
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Error com o código HTTP (`status`); sem status = falha de conexão.
function erroDaApi(mensagem, status) {
  const erro = new Error(mensagem)
  erro.status = status
  return erro
}

// Faz a requisição e devolve o JSON; lança Error com a mensagem do backend.
async function requisicao(rota, { metodo = 'GET', corpo, mensagemErro } = {}) {
  let resposta
  try {
    resposta = await fetch(`${API_URL}${rota}`, {
      method: metodo,
      headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Ele está rodando?')
  }

  const ehJson = (resposta.headers.get('content-type') || '').includes('application/json')
  const resultado = ehJson ? await resposta.json().catch(() => ({})) : {}

  if (!resposta.ok) {
    // O backend atual sempre responde 404 em JSON. Um 404 em HTML quer dizer que
    // há um servidor antigo (ou outro programa) rodando na porta da API.
    if (resposta.status === 404 && !ehJson) {
      // Sem `status`: não é "conta inexistente", é servidor errado.
      throw erroDaApi(
        'O servidor do backend parece desatualizado. Pare-o (Ctrl+C) e rode "npm start" na pasta backend.'
      )
    }
    throw erroDaApi(resultado.erro || mensagemErro || 'Erro na requisição.', resposta.status)
  }
  return resultado
}

// ---------- Autenticação ----------

export async function registrar(dados) {
  const r = await requisicao('/registro', { metodo: 'POST', corpo: dados, mensagemErro: 'Erro ao cadastrar.' })
  return r.usuario
}

export async function fazerLogin(dados) {
  const r = await requisicao('/login', { metodo: 'POST', corpo: dados, mensagemErro: 'Erro ao fazer login.' })
  return r.usuario
}

// Confere se a conta salva no navegador ainda existe e está ativa.
// Erro com status 403/404 = a sessão deve ser encerrada.
export async function validarSessao(id) {
  const r = await requisicao(`/sessao/${id}`)
  return r.usuario
}

// ---------- Mentoras (coordenação) ----------

// Devolve { usuario, pareadas } — pareadas = meninas sem mentora que foram ligadas a ela.
export async function criarMentora(dados) {
  return requisicao('/mentoras', { metodo: 'POST', corpo: dados, mensagemErro: 'Erro ao cadastrar mentora.' })
}

export async function listarMentoras() {
  const r = await requisicao('/mentoras', { mensagemErro: 'Erro ao buscar mentoras.' })
  return r.mentoras
}

export async function editarMentora(id, dados) {
  const r = await requisicao(`/mentoras/${id}`, { metodo: 'PUT', corpo: dados, mensagemErro: 'Erro ao editar mentora.' })
  return r.usuario
}

export async function alternarStatusMentora(id) {
  const r = await requisicao(`/mentoras/${id}/status`, { metodo: 'PATCH', mensagemErro: 'Erro ao alterar status.' })
  return r.usuario
}

export async function redefinirSenhaMentora(id, senha) {
  return requisicao(`/mentoras/${id}/senha`, {
    metodo: 'PATCH',
    corpo: { senha },
    mensagemErro: 'Erro ao redefinir senha.',
  })
}

export async function listarMentorandas(mentoraId) {
  const r = await requisicao(`/mentoras/${mentoraId}/mentorandas`)
  return r.mentorandas
}

// ---------- Oficinas ----------

export async function listarOficinas({ futuras, meninaId } = {}) {
  const params = new URLSearchParams()
  if (futuras) params.set('futuras', 'true')
  if (meninaId) params.set('menina_id', meninaId)
  const query = params.toString() ? `?${params}` : ''
  const r = await requisicao(`/oficinas${query}`, { mensagemErro: 'Erro ao buscar atividades.' })
  return r.oficinas
}

export async function obterOficina(id) {
  const r = await requisicao(`/oficinas/${id}`)
  return r.oficina
}

export async function inscreverEmOficina(oficinaId, meninaId) {
  return requisicao('/oficinas/inscricao', {
    metodo: 'POST',
    corpo: { oficina_id: oficinaId, menina_id: meninaId },
  })
}

export async function cancelarInscricao(oficinaId, meninaId) {
  return requisicao('/oficinas/inscricao', {
    metodo: 'DELETE',
    corpo: { oficina_id: oficinaId, menina_id: meninaId },
  })
}

export async function criarOficina(dados) {
  return requisicao('/oficinas', { metodo: 'POST', corpo: dados, mensagemErro: 'Erro ao cadastrar atividade.' })
}

export async function editarOficina(id, dados) {
  return requisicao(`/oficinas/${id}`, { metodo: 'PUT', corpo: dados, mensagemErro: 'Erro ao editar atividade.' })
}

export async function excluirOficina(id) {
  return requisicao(`/oficinas/${id}`, { metodo: 'DELETE', mensagemErro: 'Erro ao excluir atividade.' })
}

export async function listarInscricoes(oficinaId) {
  const r = await requisicao(`/oficinas/${oficinaId}/inscricoes`)
  return r.inscricoes
}

// Marca (presenca = true) ou desmarca a presença. `registradoPor` é a mentora
// ou coordenação que está registrando. Devolve pontos e novas conquistas.
export async function registrarPresenca(oficinaId, meninaId, presenca, registradoPor) {
  return requisicao('/oficinas/presenca', {
    metodo: 'PATCH',
    corpo: { oficina_id: oficinaId, menina_id: meninaId, presenca, registrado_por: registradoPor },
    mensagemErro: 'Erro ao registrar presença.',
  })
}

// ---------- Mentoria ----------

export async function registrarEncontro(dados) {
  return requisicao('/mentorias/encontros', {
    metodo: 'POST',
    corpo: dados,
    mensagemErro: 'Erro ao registrar encontro.',
  })
}

// ---------- Coordenação ----------

export async function obterIndicadores() {
  return requisicao('/dashboard', { mensagemErro: 'Erro ao carregar indicadores.' })
}

export async function listarMeninas() {
  const r = await requisicao('/meninas', { mensagemErro: 'Erro ao listar alunas.' })
  return r.meninas
}

export async function executarPareamento() {
  return requisicao('/pareamento/executar', { metodo: 'POST', mensagemErro: 'Erro ao executar pareamento.' })
}

// ---------- Jornada da menina ----------

export async function obterTrilha(meninaId) {
  return requisicao(`/meninas/${meninaId}/trilha`, { mensagemErro: 'Erro ao carregar sua trilha.' })
}

export async function obterRecomendacoes(meninaId, limite = 3) {
  const r = await requisicao(`/meninas/${meninaId}/recomendacoes?limite=${limite}`)
  return r.recomendacoes
}

export async function listarConquistas(meninaId) {
  const r = await requisicao(`/meninas/${meninaId}/conquistas`)
  return r.conquistas
}

export async function listarAtividadesConcluidas(meninaId) {
  const r = await requisicao(`/meninas/${meninaId}/atividades-concluidas`)
  return r.atividades
}

export async function listarEncontros({ mentoraId, meninaId }) {
  const params = new URLSearchParams()
  if (mentoraId) params.set('mentora_id', mentoraId)
  if (meninaId) params.set('menina_id', meninaId)
  const r = await requisicao(`/mentorias/encontros?${params}`)
  return r.encontros
}

// ---------- Certificados ----------

// Devolve o PDF (Blob) do certificado de uma oficina com presença confirmada.
export async function gerarCertificado(meninaId, oficinaId) {
  let resposta
  try {
    resposta = await fetch(`${API_URL}/certificados/gerar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menina_id: meninaId, oficina_id: oficinaId }),
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Ele está rodando?')
  }

  if (!resposta.ok) {
    const resultado = await resposta.json().catch(() => ({}))
    throw new Error(resultado.erro || 'Erro ao gerar certificado.')
  }
  return resposta.blob()
}

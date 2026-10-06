import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  criarMentora,
  listarMentoras,
  editarMentora,
  alternarStatusMentora,
} from '../services/api'

function DashboardCoordenacao() {
  const { usuario, logout } = useAuth()
  const [mentoras, setMentoras] = useState([])
  const [carregandoLista, setCarregandoLista] = useState(true)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  const [editandoId, setEditandoId] = useState(null)
  const [nomeEdicao, setNomeEdicao] = useState('')
  const [emailEdicao, setEmailEdicao] = useState('')

  async function carregarMentoras() {
    setCarregandoLista(true)
    try {
      const dados = await listarMentoras()
      setMentoras(dados)
    } catch (err) {
      console.error(err)
    } finally {
      setCarregandoLista(false)
    }
  }

  useEffect(() => {
    carregarMentoras()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setEnviando(true)

    try {
      await criarMentora({ nome, email, senha })
      setSucesso(`Mentora "${nome}" cadastrada com sucesso!`)
      setNome('')
      setEmail('')
      setSenha('')
      carregarMentoras()
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  function iniciarEdicao(mentora) {
    setEditandoId(mentora.id)
    setNomeEdicao(mentora.nome)
    setEmailEdicao(mentora.email)
  }

  function cancelarEdicao() {
    setEditandoId(null)
  }

  async function salvarEdicao(id) {
    try {
      await editarMentora(id, { nome: nomeEdicao, email: emailEdicao })
      setEditandoId(null)
      carregarMentoras()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleAlternarStatus(id) {
    try {
      await alternarStatusMentora(id)
      carregarMentoras()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Olá, {usuario?.nome}! 👋
            </h1>
            <p className="text-gray-500">Painel da Coordenação</p>
          </div>
          <button
            onClick={logout}
            className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition text-sm"
          >
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Cadastrar nova mentora
            </h2>

            {erro && (
              <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
                {erro}
              </div>
            )}
            {sucesso && (
              <div className="bg-green-50 text-green-600 text-sm rounded-lg px-4 py-2 mb-4">
                {sucesso}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

              <label className="block text-sm font-semibold text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Senha provisória
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                minLength={6}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-purple-700 text-white font-semibold py-2.5 rounded-xl hover:bg-purple-800 transition disabled:opacity-50"
              >
                {enviando ? 'Cadastrando...' : 'Cadastrar mentora'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Mentoras cadastradas ({mentoras.length})
            </h2>

            {carregandoLista ? (
              <p className="text-sm text-gray-400">Carregando...</p>
            ) : mentoras.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhuma mentora cadastrada ainda.</p>
            ) : (
              <ul className="space-y-3">
                {mentoras.map((mentora) => (
                  <li key={mentora.id} className="border-b border-gray-100 pb-3">
                    {editandoId === mentora.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={nomeEdicao}
                          onChange={(e) => setNomeEdicao(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                        />
                        <input
                          type="email"
                          value={emailEdicao}
                          onChange={(e) => setEmailEdicao(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => salvarEdicao(mentora.id)}
                            className="text-xs font-semibold bg-purple-700 text-white px-3 py-1.5 rounded-full hover:bg-purple-800"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={cancelarEdicao}
                            className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{mentora.nome}</p>
                          <p className="text-xs text-gray-400">{mentora.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => iniciarEdicao(mentora)}
                            className="text-xs font-semibold text-purple-600 hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleAlternarStatus(mentora.id)}
                            className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                              mentora.ativo
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {mentora.ativo ? 'Ativa' : 'Inativa'}
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardCoordenacao
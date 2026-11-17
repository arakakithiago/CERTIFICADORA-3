import { useState } from 'react'
import Cartao, { Mensagem, estiloBotao, estiloInput, estiloRotulo } from './Cartao'
import EstadoCarregamento from '../EstadoCarregamento'
import { useCarregar } from '../../hooks/useCarregar'
import {
  alternarStatusMentora,
  criarMentora,
  editarMentora,
  listarMentoras,
  redefinirSenhaMentora,
} from '../../services/api'

function GerenciarMentoras() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  const [editandoId, setEditandoId] = useState(null)
  const [nomeEdicao, setNomeEdicao] = useState('')
  const [emailEdicao, setEmailEdicao] = useState('')

  const [senhaId, setSenhaId] = useState(null)
  const [novaSenha, setNovaSenha] = useState('')
  const [salvandoSenha, setSalvandoSenha] = useState(false)
  const [sucessoLista, setSucessoLista] = useState('')

  const { dados: mentoras, erro: erroLista, carregando, recarregar } = useCarregar(
    () => listarMentoras(),
    []
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setEnviando(true)
    try {
      const { pareadas } = await criarMentora({ nome, email, senha })
      setSucesso(
        `Mentora "${nome}" cadastrada!` +
          (pareadas ? ` ${pareadas} aluna(s) sem mentora foram pareadas com ela.` : '')
      )
      setNome('')
      setEmail('')
      setSenha('')
      await recarregar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  function abrirSenha(mentora) {
    setSenhaId(mentora.id)
    setNovaSenha('')
    setEditandoId(null)
    setErro('')
    setSucessoLista('')
  }

  async function salvarSenha(e, mentora) {
    e.preventDefault()
    setErro('')
    setSalvandoSenha(true)
    try {
      await redefinirSenhaMentora(mentora.id, novaSenha)
      setSenhaId(null)
      setSucessoLista(`Senha de ${mentora.nome} redefinida. Informe a nova senha a ela.`)
    } catch (err) {
      setErro(err.message)
    } finally {
      setSalvandoSenha(false)
    }
  }

  function iniciarEdicao(mentora) {
    setSenhaId(null)
    setEditandoId(mentora.id)
    setNomeEdicao(mentora.nome)
    setEmailEdicao(mentora.email)
  }

  async function salvarEdicao(id) {
    setErro('')
    try {
      await editarMentora(id, { nome: nomeEdicao, email: emailEdicao })
      setEditandoId(null)
      await recarregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  async function handleAlternarStatus(mentora) {
    if (
      mentora.ativo &&
      mentora.total_mentorandas > 0 &&
      !window.confirm(
        `Desativar ${mentora.nome}? Suas ${mentora.total_mentorandas} mentoranda(s) serão redistribuídas entre as outras mentoras ativas.`
      )
    ) {
      return
    }
    setErro('')
    setSucesso('')
    try {
      await alternarStatusMentora(mentora.id)
      await recarregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Cartao titulo="Cadastrar nova mentora" className="self-start">
        <Mensagem tipo="sucesso">{sucesso}</Mensagem>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="m-nome" className={estiloRotulo}>Nome</label>
            <input id="m-nome" value={nome} onChange={(e) => setNome(e.target.value)} className={estiloInput} required />
          </div>
          <div>
            <label htmlFor="m-email" className={estiloRotulo}>E-mail</label>
            <input id="m-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={estiloInput} required />
          </div>
          <div>
            <label htmlFor="m-senha" className={estiloRotulo}>Senha provisória</label>
            <input
              id="m-senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={6}
              className={estiloInput}
              required
            />
          </div>
          <button type="submit" disabled={enviando} className={`w-full ${estiloBotao}`}>
            {enviando ? 'Cadastrando...' : 'Cadastrar mentora'}
          </button>
        </form>
      </Cartao>

      <Cartao titulo={`Mentoras cadastradas (${mentoras?.length ?? 0})`}>
        <Mensagem>{erro}</Mensagem>
        <Mensagem tipo="sucesso">{sucessoLista}</Mensagem>
        <EstadoCarregamento
          carregando={carregando}
          erro={erroLista}
          vazio={mentoras?.length === 0}
          mensagemVazio="Nenhuma mentora cadastrada ainda."
        >
          <ul className="space-y-3">
            {mentoras?.map((mentora) => (
              <li key={mentora.id} className="border-b border-gray-100 pb-3 last:border-0">
                {editandoId === mentora.id ? (
                  <div className="space-y-2">
                    <input
                      aria-label="Nome"
                      value={nomeEdicao}
                      onChange={(e) => setNomeEdicao(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <input
                      aria-label="E-mail"
                      type="email"
                      value={emailEdicao}
                      onChange={(e) => setEmailEdicao(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => salvarEdicao(mentora.id)}
                        className="text-xs font-semibold bg-purple-700 text-white px-3 py-1.5 rounded-full hover:bg-purple-800"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditandoId(null)}
                        className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{mentora.nome}</p>
                      <p className="text-xs text-gray-400 truncate">{mentora.email}</p>
                      <p className="text-xs text-gray-500">
                        {mentora.total_mentorandas} mentoranda(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => iniciarEdicao(mentora)}
                        className="text-xs font-semibold text-purple-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => abrirSenha(mentora)}
                        className="text-xs font-semibold text-purple-600 hover:underline"
                      >
                        Senha
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAlternarStatus(mentora)}
                        title={mentora.ativo ? 'Clique para desativar' : 'Clique para reativar'}
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                          mentora.ativo
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {mentora.ativo ? 'Ativa' : 'Inativa'}
                      </button>
                    </div>
                  </div>
                )}

                {senhaId === mentora.id && (
                  <form
                    onSubmit={(e) => salvarSenha(e, mentora)}
                    className="mt-3 flex flex-col sm:flex-row gap-2 rounded-xl bg-purple-50/60 p-3"
                  >
                    <input
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      minLength={6}
                      required
                      autoFocus
                      placeholder="Nova senha (mín. 6 caracteres)"
                      aria-label={`Nova senha de ${mentora.nome}`}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={salvandoSenha}
                        className="text-xs font-semibold bg-purple-700 text-white px-3 py-1.5 rounded-full hover:bg-purple-800 disabled:opacity-50"
                      >
                        {salvandoSenha ? 'Salvando...' : 'Redefinir'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSenhaId(null)}
                        className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </EstadoCarregamento>
      </Cartao>
    </div>
  )
}

export default GerenciarMentoras

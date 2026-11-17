import { useState } from 'react'
import Cartao, { Mensagem, estiloBotao, estiloBotaoSecundario, estiloInput, estiloRotulo } from './Cartao'
import EstadoCarregamento from '../EstadoCarregamento'
import { useCarregar } from '../../hooks/useCarregar'
import { criarOficina, editarOficina, excluirOficina, listarMentoras, listarOficinas } from '../../services/api'
import {
  CATEGORIAS,
  categoria,
  deInputDataHora,
  formatarDataCurta,
  formatarHora,
  jaAconteceu,
  paraInputDataHora,
} from '../../utils/atividades'

const FORM_VAZIO = {
  titulo: '',
  descricao: '',
  categoria: 'tecnologia',
  data: '',
  local: 'UTFPR-CP',
  vagas: 20,
  instrutora_id: '',
}

// Cadastro, edição e exclusão de oficinas.
// - Mentora: passe `instrutoraId`; ela vê e cadastra apenas as próprias atividades.
// - Coordenação: sem `instrutoraId`; vê todas e escolhe a responsável.
function GerenciarOficinas({ instrutoraId }) {
  const ehCoordenacao = !instrutoraId
  const [form, setForm] = useState(FORM_VAZIO)
  const [editandoId, setEditandoId] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const { dados, erro: erroLista, carregando, recarregar } = useCarregar(async () => {
    const [oficinas, mentoras] = await Promise.all([
      listarOficinas(),
      ehCoordenacao ? listarMentoras() : Promise.resolve([]),
    ])
    return {
      oficinas: ehCoordenacao
        ? oficinas
        : oficinas.filter((o) => o.instrutora_id === instrutoraId),
      mentoras: mentoras.filter((m) => m.ativo),
    }
  }, [instrutoraId])

  function alterar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  function iniciarEdicao(oficina) {
    setEditandoId(oficina.id)
    setErro('')
    setSucesso('')
    setForm({
      titulo: oficina.titulo,
      descricao: oficina.descricao || '',
      categoria: oficina.categoria,
      data: paraInputDataHora(oficina.data),
      local: oficina.local,
      vagas: oficina.vagas,
      instrutora_id: oficina.instrutora_id || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelarEdicao() {
    setEditandoId(null)
    setForm(FORM_VAZIO)
    setErro('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setEnviando(true)

    const corpo = {
      ...form,
      data: deInputDataHora(form.data),
      vagas: Number(form.vagas),
      instrutora_id: ehCoordenacao ? form.instrutora_id || null : instrutoraId,
    }

    try {
      if (editandoId) {
        await editarOficina(editandoId, corpo)
        setSucesso(`Atividade "${form.titulo}" atualizada!`)
      } else {
        await criarOficina(corpo)
        setSucesso(`Atividade "${form.titulo}" cadastrada!`)
      }
      setEditandoId(null)
      setForm(FORM_VAZIO)
      await recarregar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  async function handleExcluir(oficina) {
    const aviso =
      oficina.total_inscritas > 0
        ? `\n\nAtenção: ${oficina.total_inscritas} inscrição(ões) e presenças serão apagadas.`
        : ''
    if (!window.confirm(`Excluir a atividade "${oficina.titulo}"?${aviso}`)) return

    setErro('')
    setSucesso('')
    try {
      await excluirOficina(oficina.id)
      if (editandoId === oficina.id) cancelarEdicao()
      setSucesso(`Atividade "${oficina.titulo}" excluída.`)
      await recarregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Cartao
        titulo={editandoId ? 'Editar atividade' : 'Nova atividade'}
        className="lg:col-span-2 self-start"
      >
        <Mensagem>{erro}</Mensagem>
        <Mensagem tipo="sucesso">{sucesso}</Mensagem>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="of-titulo" className={estiloRotulo}>Título</label>
            <input
              id="of-titulo"
              value={form.titulo}
              onChange={(e) => alterar('titulo', e.target.value)}
              className={estiloInput}
              required
            />
          </div>

          <div>
            <label htmlFor="of-descricao" className={estiloRotulo}>Descrição</label>
            <textarea
              id="of-descricao"
              value={form.descricao}
              onChange={(e) => alterar('descricao', e.target.value)}
              rows={3}
              className={estiloInput}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="of-categoria" className={estiloRotulo}>Categoria</label>
              <select
                id="of-categoria"
                value={form.categoria}
                onChange={(e) => alterar('categoria', e.target.value)}
                className={estiloInput}
              >
                {Object.entries(CATEGORIAS).map(([chave, c]) => (
                  <option key={chave} value={chave}>{c.rotulo}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="of-vagas" className={estiloRotulo}>Vagas</label>
              <input
                id="of-vagas"
                type="number"
                min={1}
                value={form.vagas}
                onChange={(e) => alterar('vagas', e.target.value)}
                className={estiloInput}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="of-data" className={estiloRotulo}>Data e horário</label>
            <input
              id="of-data"
              type="datetime-local"
              value={form.data}
              onChange={(e) => alterar('data', e.target.value)}
              className={estiloInput}
              required
            />
          </div>

          <div>
            <label htmlFor="of-local" className={estiloRotulo}>Local</label>
            <input
              id="of-local"
              value={form.local}
              onChange={(e) => alterar('local', e.target.value)}
              className={estiloInput}
            />
          </div>

          {ehCoordenacao && (
            <div>
              <label htmlFor="of-instrutora" className={estiloRotulo}>Mentora responsável</label>
              <select
                id="of-instrutora"
                value={form.instrutora_id}
                onChange={(e) => alterar('instrutora_id', e.target.value)}
                className={estiloInput}
              >
                <option value="">Coordenação</option>
                {dados?.mentoras.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2">
            <button type="submit" disabled={enviando} className={`flex-1 ${estiloBotao}`}>
              {enviando ? 'Salvando...' : editandoId ? 'Salvar alterações' : 'Cadastrar atividade'}
            </button>
            {editandoId && (
              <button type="button" onClick={cancelarEdicao} className={estiloBotaoSecundario}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </Cartao>

      <Cartao
        titulo={`${ehCoordenacao ? 'Atividades' : 'Minhas atividades'} (${dados?.oficinas.length ?? 0})`}
        className="lg:col-span-3"
      >
        <EstadoCarregamento
          carregando={carregando}
          erro={erroLista}
          vazio={dados?.oficinas.length === 0}
          mensagemVazio="Nenhuma atividade cadastrada ainda."
        >
          <ul className="divide-y divide-gray-100">
            {dados?.oficinas.map((o) => (
              <li key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoria(o.categoria).cor}`}>
                      {categoria(o.categoria).rotulo}
                    </span>
                    {jaAconteceu(o.data) && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        REALIZADA
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-800 text-sm mt-1">{o.titulo}</p>
                  <p className="text-xs text-gray-400">
                    {formatarDataCurta(o.data)} • {formatarHora(o.data)} · {o.local} ·{' '}
                    {o.total_inscritas}/{o.vagas} inscritas
                    {ehCoordenacao && o.instrutora_nome ? ` · ${o.instrutora_nome}` : ''}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => iniciarEdicao(o)}
                    className="text-xs font-semibold text-purple-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExcluir(o)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </EstadoCarregamento>
      </Cartao>
    </div>
  )
}

export default GerenciarOficinas

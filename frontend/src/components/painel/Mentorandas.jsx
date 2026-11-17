import { useState } from 'react'
import Cartao, { Mensagem, estiloBotao, estiloInput, estiloRotulo } from './Cartao'
import EstadoCarregamento from '../EstadoCarregamento'
import { useCarregar } from '../../hooks/useCarregar'
import { listarEncontros, listarMentorandas, registrarEncontro } from '../../services/api'
import { formatarDiaLongo, hojeParaInput } from '../../utils/atividades'

function Estrelas({ valor }) {
  if (!valor) return null
  return (
    <span className="text-purple-600" aria-label={`Progresso ${valor} de 5`}>
      {'★'.repeat(valor)}
      {'☆'.repeat(5 - valor)}
    </span>
  )
}

// Histórico + formulário de encontros com uma mentoranda.
function EncontrosDaMentoranda({ mentoraId, mentoranda, onRegistrado }) {
  const [data, setData] = useState(hojeParaInput())
  const [resumo, setResumo] = useState('')
  const [avaliacao, setAvaliacao] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const { dados: encontros, erro: erroLista, carregando, recarregar } = useCarregar(
    () => listarEncontros({ mentoraId, meninaId: mentoranda.id }),
    [mentoraId, mentoranda.id]
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setEnviando(true)
    try {
      const r = await registrarEncontro({
        mentora_id: mentoraId,
        menina_id: mentoranda.id,
        data,
        resumo,
        avaliacao_progresso: avaliacao || null,
      })
      const conquistas = r.novasConquistas?.length
        ? ` ${mentoranda.nome} conquistou: ${r.novasConquistas.join(', ')}! 🎉`
        : ''
      setSucesso(`Encontro registrado (+30 pontos).${conquistas}`)
      setResumo('')
      setAvaliacao('')
      await Promise.all([recarregar(), onRegistrado()])
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Cartao titulo={`Encontros com ${mentoranda.nome}`}>
      <Mensagem>{erro}</Mensagem>
      <Mensagem tipo="sucesso">{sucesso}</Mensagem>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6 rounded-xl bg-purple-50/60 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="enc-data" className={estiloRotulo}>Data do encontro</label>
            <input
              id="enc-data"
              type="date"
              value={data}
              max={hojeParaInput()}
              onChange={(e) => setData(e.target.value)}
              className={estiloInput}
              required
            />
          </div>
          <div>
            <label htmlFor="enc-avaliacao" className={estiloRotulo}>Progresso (opcional)</label>
            <select
              id="enc-avaliacao"
              value={avaliacao}
              onChange={(e) => setAvaliacao(e.target.value)}
              className={estiloInput}
            >
              <option value="">Sem avaliação</option>
              <option value="1">1 — Precisa de apoio</option>
              <option value="2">2</option>
              <option value="3">3 — Evoluindo</option>
              <option value="4">4</option>
              <option value="5">5 — Excelente</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="enc-resumo" className={estiloRotulo}>Resumo</label>
          <textarea
            id="enc-resumo"
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            rows={3}
            placeholder="O que conversaram, combinados, próximos passos..."
            className={estiloInput}
            required
          />
        </div>
        <button type="submit" disabled={enviando} className={estiloBotao}>
          {enviando ? 'Registrando...' : 'Registrar encontro'}
        </button>
      </form>

      <EstadoCarregamento
        carregando={carregando}
        erro={erroLista}
        vazio={encontros?.length === 0}
        mensagemVazio="Nenhum encontro registrado ainda."
      >
        <ul className="space-y-4">
          {encontros?.map((e) => (
            <li key={e.id} className="border-l-4 border-purple-300 pl-4">
              <p className="text-sm font-semibold text-gray-800">
                {formatarDiaLongo(e.data)} <Estrelas valor={e.avaliacao_progresso} />
              </p>
              <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{e.resumo}</p>
            </li>
          ))}
        </ul>
      </EstadoCarregamento>
    </Cartao>
  )
}

function Mentorandas({ mentoraId }) {
  const [selecionadaId, setSelecionadaId] = useState(null)
  const { dados: mentorandas, erro, carregando, recarregar } = useCarregar(
    () => listarMentorandas(mentoraId),
    [mentoraId]
  )

  const selecionada = mentorandas?.find((m) => m.id === selecionadaId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Cartao titulo={`Mentorandas (${mentorandas?.length ?? 0})`} className="lg:col-span-2 self-start">
        <EstadoCarregamento
          carregando={carregando}
          erro={erro}
          vazio={mentorandas?.length === 0}
          mensagemVazio="Nenhuma menina foi pareada com você ainda. O pareamento é automático: novas alunas são ligadas à mentora com menos mentorandas."
        >
          <ul className="space-y-2">
            {mentorandas?.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setSelecionadaId(m.id)}
                  aria-pressed={m.id === selecionadaId}
                  className={`w-full text-left rounded-xl px-4 py-3 transition ${
                    m.id === selecionadaId ? 'bg-purple-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="font-semibold text-gray-800 text-sm">{m.nome}</p>
                  <p className="text-xs text-gray-500">
                    ⭐ {m.pontos} pts · {m.atividades_concluidas} atividade(s) · {m.total_encontros}{' '}
                    encontro(s)
                  </p>
                  <p className="text-xs text-gray-400">
                    {m.ultimo_encontro
                      ? `Último encontro: ${formatarDiaLongo(m.ultimo_encontro)}`
                      : 'Ainda sem encontros'}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </EstadoCarregamento>
      </Cartao>

      <div className="lg:col-span-3">
        {selecionada ? (
          <EncontrosDaMentoranda
            key={selecionada.id}
            mentoraId={mentoraId}
            mentoranda={selecionada}
            onRegistrado={recarregar}
          />
        ) : (
          mentorandas?.length > 0 && (
            <Cartao>
              <p className="text-sm text-gray-500 text-center py-6">
                Selecione uma mentoranda para ver o histórico e registrar encontros.
              </p>
            </Cartao>
          )
        )}
      </div>
    </div>
  )
}

export default Mentorandas

import { useState } from 'react'
import Cartao, { Mensagem, estiloInput, estiloRotulo } from './Cartao'
import EstadoCarregamento from '../EstadoCarregamento'
import { useAuth } from '../../context/AuthContext'
import { useCarregar } from '../../hooks/useCarregar'
import { listarInscricoes, listarOficinas, registrarPresenca } from '../../services/api'
import {
  formatarDataCurta,
  formatarDataLonga,
  formatarHora,
  podeRegistrarPresenca,
} from '../../utils/atividades'

// Atividade mais adequada para abrir: a última que já começou (ou a próxima).
// Se `preferirInstrutoraId` for informado, prefere as atividades dessa mentora.
function escolherPadrao(oficinas, preferirInstrutoraId) {
  const candidatas = preferirInstrutoraId
    ? oficinas.filter((o) => o.instrutora_id === preferirInstrutoraId)
    : []
  const lista = candidatas.length ? candidatas : oficinas
  const liberadas = lista.filter((o) => podeRegistrarPresenca(o.data))
  const alvo = liberadas.length ? liberadas[liberadas.length - 1] : lista[0]
  return alvo ? String(alvo.id) : ''
}

function ListaPresenca({ oficina }) {
  const { usuario } = useAuth()
  const [salvandoId, setSalvandoId] = useState(null)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const liberada = podeRegistrarPresenca(oficina.data)

  const { dados: inscricoes, erro: erroLista, carregando, recarregar } = useCarregar(
    () => listarInscricoes(oficina.id),
    [oficina.id]
  )

  async function alternar(inscricao) {
    setErro('')
    setAviso('')
    setSalvandoId(inscricao.menina_id)
    try {
      const r = await registrarPresenca(
        oficina.id,
        inscricao.menina_id,
        !inscricao.presenca,
        usuario.id
      )
      if (r.novasConquistas?.length) {
        setAviso(`${inscricao.nome} conquistou: ${r.novasConquistas.join(', ')}! 🎉`)
      }
      await recarregar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setSalvandoId(null)
    }
  }

  const presentes = inscricoes?.filter((i) => i.presenca).length ?? 0

  return (
    <>
      {!liberada && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          ⏳ Esta atividade ainda não aconteceu. A presença poderá ser registrada a partir do dia{' '}
          {formatarDataCurta(oficina.data)}.
        </p>
      )}
      <Mensagem>{erro}</Mensagem>
      <Mensagem tipo="sucesso">{aviso}</Mensagem>

      <EstadoCarregamento
        carregando={carregando}
        erro={erroLista}
        vazio={inscricoes?.length === 0}
        mensagemVazio="Nenhuma menina inscrita nesta atividade."
      >
        <p className="text-sm text-gray-500 mb-3">
          {presentes} de {inscricoes?.length} presentes · cada presença vale 50 pontos para a menina.
        </p>
        <ul className="divide-y divide-gray-100">
          {inscricoes?.map((i) => (
            <li key={i.menina_id} className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{i.nome}</p>
                <p className="text-xs text-gray-400 truncate">{i.email}</p>
                {i.registrado_por_nome && (
                  <p className="text-xs text-gray-500">
                    {i.presenca ? 'Presença registrada' : 'Presença removida'} por{' '}
                    {i.registrado_por === usuario.id ? 'você' : i.registrado_por_nome}
                    {i.registrado_em && ` em ${formatarDataLonga(i.registrado_em)}`}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => alternar(i)}
                disabled={!liberada || salvandoId !== null}
                aria-pressed={i.presenca}
                className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  i.presenca
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {salvandoId === i.menina_id ? 'Salvando...' : i.presenca ? '✓ Presente' : 'Marcar presença'}
              </button>
            </li>
          ))}
        </ul>
      </EstadoCarregamento>
    </>
  )
}

// Qualquer mentora ativa ou a coordenação pode registrar presença em qualquer
// atividade. `destacarInstrutoraId` (painel da mentora) marca as atividades
// dela na lista e as abre primeiro.
function PainelPresenca({ destacarInstrutoraId }) {
  const [selecionada, setSelecionada] = useState('')

  const { dados: oficinas, erro, carregando } = useCarregar(() => listarOficinas(), [])

  const idAtual = selecionada || (oficinas ? escolherPadrao(oficinas, destacarInstrutoraId) : '')
  const oficina = oficinas?.find((o) => String(o.id) === idAtual)

  return (
    <Cartao titulo="Registro de presença">
      {destacarInstrutoraId && (
        <p className="mb-4 text-sm text-gray-500">
          Você pode registrar presença em qualquer atividade, não só nas suas. Fica gravado quem
          fez cada registro.
        </p>
      )}
      <EstadoCarregamento
        carregando={carregando}
        erro={erro}
        vazio={oficinas?.length === 0}
        mensagemVazio="Nenhuma atividade cadastrada ainda."
      >
        <div className="mb-5 max-w-md">
          <label htmlFor="presenca-oficina" className={estiloRotulo}>Atividade</label>
          <select
            id="presenca-oficina"
            value={idAtual}
            onChange={(e) => setSelecionada(e.target.value)}
            className={estiloInput}
          >
            {oficinas?.map((o) => (
              <option key={o.id} value={o.id}>
                {formatarDataCurta(o.data)} {formatarHora(o.data)} — {o.titulo}
                {destacarInstrutoraId && o.instrutora_id === destacarInstrutoraId ? ' (sua)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* `key` reinicia a lista ao trocar de atividade. */}
        {oficina && <ListaPresenca key={oficina.id} oficina={oficina} />}
      </EstadoCarregamento>
    </Cartao>
  )
}

export default PainelPresenca

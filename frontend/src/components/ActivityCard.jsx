import { useState } from 'react'
import { Link } from 'react-router-dom'
import iconDataHorario from '../assets/icons/03_data_horario.png'
import iconLocalizacao from '../assets/icons/35_localizacao.png'
import { useAuth } from '../context/AuthContext'
import { cancelarInscricao, inscreverEmOficina } from '../services/api'
import { categoria, formatarDataCurta, formatarHora, jaAconteceu } from '../utils/atividades'

// Card de uma oficina com botão de inscrição/cancelamento.
// `onAtualizado` é chamado depois de inscrever ou cancelar, para recarregar a lista.
function ActivityCard({ oficina, onAtualizado }) {
  const { usuario } = useAuth()
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  const cat = categoria(oficina.categoria)
  const passada = jaAconteceu(oficina.data)
  const lotada = oficina.vagas_restantes <= 0

  async function alternarInscricao() {
    setErro('')
    setEnviando(true)
    try {
      if (oficina.inscrita) {
        await cancelarInscricao(oficina.id, usuario.id)
      } else {
        await inscreverEmOficina(oficina.id, usuario.id)
      }
      await onAtualizado?.()
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  let botao
  if (oficina.presenca) {
    botao = (
      <span className="flex-1 text-center bg-green-100 text-green-700 font-semibold py-2 rounded-full text-sm">
        Concluída ✓
      </span>
    )
  } else if (passada) {
    botao = (
      <span className="flex-1 text-center bg-gray-100 text-gray-500 font-semibold py-2 rounded-full text-sm">
        Encerrada
      </span>
    )
  } else if (oficina.inscrita) {
    botao = (
      <button
        type="button"
        onClick={alternarInscricao}
        disabled={enviando}
        className="flex-1 bg-purple-100 text-purple-700 font-semibold py-2 rounded-full hover:bg-purple-200 transition text-sm disabled:opacity-50"
      >
        {enviando ? 'Cancelando...' : 'Inscrita ✓ · Cancelar'}
      </button>
    )
  } else {
    botao = (
      <button
        type="button"
        onClick={alternarInscricao}
        disabled={enviando || lotada}
        className="flex-1 bg-pink-500 text-white font-semibold py-2 rounded-full hover:bg-pink-600 transition text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {lotada ? 'Esgotada' : enviando ? 'Inscrevendo...' : 'Inscrever-se'}
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <img src={cat.imagem} alt="" className="w-full h-28 object-cover" />

      <div className="p-4 flex flex-col flex-1">
        <span className={`self-start text-xs font-semibold px-3 py-1 rounded-full mb-2 ${cat.cor}`}>
          {cat.rotulo}
        </span>

        <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug">{oficina.titulo}</h3>

        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <img src={iconDataHorario} alt="" className="w-3.5 h-3.5" />
            {formatarDataCurta(oficina.data)} • {formatarHora(oficina.data)}
          </span>
          <span className="flex items-center gap-1">
            <img src={iconLocalizacao} alt="" className="w-3.5 h-3.5" />
            {oficina.local}
          </span>
        </div>

        {!passada && (
          <p className="text-xs text-gray-400 mb-3">
            {lotada ? 'Sem vagas' : `${oficina.vagas_restantes} vagas restantes`}
          </p>
        )}

        {erro && <p className="text-xs text-red-600 mb-2">{erro}</p>}

        <div className="flex items-center gap-2 mt-auto">
          {botao}
          <Link
            to={`/atividades/${oficina.id}`}
            aria-label={`Ver detalhes de ${oficina.titulo}`}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition"
          >
            →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ActivityCard

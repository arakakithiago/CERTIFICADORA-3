import iconPrimeirosPassos from '../assets/icons/23_primeiros_passos.png'
import iconTechExplorer from '../assets/icons/24_tech_explorer.png'
import iconFutureAi from '../assets/icons/25_future_ai.png'
import iconMentoriaEmAcao from '../assets/icons/26_mentoria_em_acao.png'
import iconCriadora from '../assets/icons/27_criadora.png'
import iconMeninaDigital from '../assets/icons/28_menina_digital.png'
import { Link } from 'react-router-dom'
import { formatarDataLonga } from '../utils/atividades'

// Ícone de cada emblema (nomes iguais aos do backend).
const ICONES = {
  'Primeiros Passos': iconPrimeirosPassos,
  'Tech Explorer': iconTechExplorer,
  'Future AI': iconFutureAi,
  'Mentoria em Ação': iconMentoriaEmAcao,
  Criadora: iconCriadora,
  'Menina Digital': iconMeninaDigital,
}

// `conquistas`: lista vinda de GET /meninas/:id/conquistas.
// Emblemas ainda não conquistados aparecem apagados.
function AchievementsSection({ conquistas = [], mostrarLink = true, detalhado = false }) {
  const total = conquistas.filter((c) => c.conquistado).length

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Suas conquistas{' '}
          <span className="text-sm font-medium text-gray-400">
            ({total} de {conquistas.length})
          </span>
        </h2>
        {mostrarLink && (
          <Link to="/conquistas" className="text-sm text-purple-600 font-semibold hover:underline">
            Ver todas →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {conquistas.map((conquista) => (
          <div
            key={conquista.nome}
            className={`flex flex-col items-center text-center ${
              conquista.conquistado ? '' : 'opacity-40 grayscale'
            }`}
            title={conquista.conquistado ? 'Conquistado!' : 'Ainda não conquistado'}
          >
            <img src={ICONES[conquista.nome]} alt="" className="w-16 h-16 mb-2" />
            <p className="text-sm font-semibold text-gray-800">{conquista.nome}</p>
            <p className="text-xs text-gray-400 mt-1">{conquista.descricao}</p>
            {detalhado && (
              <p className="text-xs mt-1 font-semibold text-purple-600">
                {conquista.conquistado
                  ? `Em ${formatarDataLonga(conquista.conquistado_em)}`
                  : 'Bloqueado'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AchievementsSection

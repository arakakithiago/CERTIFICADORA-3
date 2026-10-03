import iconPrimeirosPassos from '../assets/icons/23_primeiros_passos.png'
import iconTechExplorer from '../assets/icons/24_tech_explorer.png'
import iconFutureAi from '../assets/icons/25_future_ai.png'
import iconMentoriaEmAcao from '../assets/icons/26_mentoria_em_acao.png'
import iconCriadora from '../assets/icons/27_criadora.png'
import iconMeninaDigital from '../assets/icons/28_menina_digital.png'

function AchievementsSection() {
  const conquistas = [
    { nome: 'Primeiros Passos', descricao: 'Sua primeira atividade concluída', icone: iconPrimeirosPassos },
    { nome: 'Tech Explorer', descricao: '3 atividades de tecnologia', icone: iconTechExplorer },
    { nome: 'Future AI', descricao: 'Concluiu uma atividade de IA', icone: iconFutureAi },
    { nome: 'Mentoria em Ação', descricao: 'Primeiro encontro com sua mentora', icone: iconMentoriaEmAcao },
    { nome: 'Criadora', descricao: 'Concluiu sua primeira trilha', icone: iconCriadora },
    { nome: 'Menina Digital', descricao: 'Todas as etapas completas', icone: iconMeninaDigital },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Suas conquistas</h2>
        <button className="text-sm text-purple-600 font-semibold hover:underline">
          Ver todas →
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {conquistas.map((conquista) => (
          <div key={conquista.nome} className="flex flex-col items-center text-center">
            <img src={conquista.icone} alt={conquista.nome} className="w-16 h-16 mb-2" />
            <p className="text-sm font-semibold text-gray-800">{conquista.nome}</p>
            <p className="text-xs text-gray-400 mt-1">{conquista.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AchievementsSection
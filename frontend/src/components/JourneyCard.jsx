import iconAtividades from '../assets/icons/03_atividades.png'
import iconBadges from '../assets/icons/05_conquistas.png'
import iconCertificados from '../assets/icons/06_certificados.png'

function JourneyCard({ percentual, atividadesConcluidas, totalAtividades, badges, certificados }) {
  // Cálculo do círculo de progresso em SVG
  const raio = 54
  const circunferencia = 2 * Math.PI * raio
  const offset = circunferencia - (percentual / 100) * circunferencia

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Sua jornada</h2>

      <div className="flex items-center gap-4 mb-6">
        {/* Círculo de progresso */}
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={raio}
              stroke="#f3e8ff"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="56"
              cy="56"
              r={raio}
              stroke="url(#gradiente)"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circunferencia}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradiente" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c026d3" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">
            {percentual}%
          </span>
        </div>

        <div>
          <p className="font-semibold text-gray-800">
            {atividadesConcluidas} de {totalAtividades} atividades concluídas
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="flex justify-between border-t pt-4 mb-4">
        <div className="flex flex-col items-center">
          <img src={iconAtividades} alt="" className="w-6 h-6 mb-1" />
          <span className="font-bold text-gray-800">{atividadesConcluidas}</span>
          <span className="text-xs text-gray-500">atividades</span>
        </div>
        <div className="flex flex-col items-center">
          <img src={iconBadges} alt="" className="w-6 h-6 mb-1" />
          <span className="font-bold text-gray-800">{badges}</span>
          <span className="text-xs text-gray-500">badges</span>
        </div>
        <div className="flex flex-col items-center">
          <img src={iconCertificados} alt="" className="w-6 h-6 mb-1" />
          <span className="font-bold text-gray-800">{certificados}</span>
          <span className="text-xs text-gray-500">certificados</span>
        </div>
      </div>

      <button className="w-full bg-purple-700 text-white font-semibold py-3 rounded-xl hover:bg-purple-800 transition">
        Continuar minha jornada →
      </button>
    </div>
  )
}

export default JourneyCard
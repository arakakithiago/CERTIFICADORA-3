import iconAtividades from '../assets/icons/03_atividades.png'
import iconBadges from '../assets/icons/05_conquistas.png'
import iconCertificados from '../assets/icons/06_certificados.png'

function JourneyCard({ percentual, atividadesConcluidas, totalAtividades, badges, certificados }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Sua jornada</h2>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-28 h-28">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#c026d3 0%, #f97316 ${percentual}%, #f3e8ff ${percentual}%, #f3e8ff 100%)`,
            }}
          ></div>
          <div className="absolute inset-[10px] bg-white rounded-full"></div>
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
import iconDataHorario from '../assets/icons/03_data_horario.png'
import iconLocalizacao from '../assets/icons/35_localizacao.png'
import iconCapa from '../assets/icons/54_notebook.png'
import iconCalendario from '../assets/icons/34_calendario.png'

function NextActivityCard({ categoria, titulo, data, hora, local, vagas }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 w-full max-w-sm">
      <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
        <img src={iconCalendario} alt="" className="w-5 h-5" />
        Próxima atividade
      </h2>

      <div className="relative bg-gradient-to-br from-fuchsia-600 via-purple-600 to-purple-800 rounded-xl h-24 flex items-center justify-center mb-3 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -right-2 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl"></div>
        <img src={iconCapa} alt="" className="relative w-16 h-16 object-contain drop-shadow-lg" />
      </div>

      <span className="inline-block bg-pink-100 text-pink-600 text-xs font-semibold px-3 py-1 rounded-full mb-2">
        {categoria}
      </span>

      <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">{titulo}</h3>

      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <img src={iconDataHorario} alt="" className="w-4 h-4" />
          {data} • {hora}
        </span>
        <span className="flex items-center gap-1">
          <img src={iconLocalizacao} alt="" className="w-4 h-4" />
          {local}
        </span>
      </div>

      <span className="inline-block bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full mb-3">
        {vagas} vagas restantes
      </span>

      <button className="w-full bg-purple-50 text-purple-700 font-semibold py-2.5 rounded-full hover:bg-purple-100 transition text-sm">
        Ver detalhes →
      </button>
    </div>
  )
}

export default NextActivityCard
import { Link } from 'react-router-dom'
import iconDataHorario from '../assets/icons/03_data_horario.png'
import iconLocalizacao from '../assets/icons/35_localizacao.png'
import iconCapa from '../assets/icons/54_notebook.png'
import iconCalendario from '../assets/icons/34_calendario.png'
import { categoria, formatarDataCurta, formatarHora } from '../utils/atividades'

// `atividade`: próxima oficina em que a menina está inscrita (ou null).
function NextActivityCard({ atividade }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 w-full h-full flex flex-col">
      <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
        <img src={iconCalendario} alt="" className="w-5 h-5" />
        Próxima atividade
      </h2>

      <div className="relative bg-gradient-to-br from-fuchsia-600 via-purple-600 to-purple-800 rounded-xl h-24 flex items-center justify-center mb-3 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -right-2 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl"></div>
        <img src={iconCapa} alt="" className="relative w-16 h-16 object-contain drop-shadow-lg" />
      </div>

      {atividade ? (
        <>
          <span
            className={`self-start text-xs font-semibold px-3 py-1 rounded-full mb-2 ${
              categoria(atividade.categoria).cor
            }`}
          >
            {categoria(atividade.categoria).rotulo}
          </span>

          <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">{atividade.titulo}</h3>

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <img src={iconDataHorario} alt="" className="w-4 h-4" />
              {formatarDataCurta(atividade.data)} • {formatarHora(atividade.data)}
            </span>
            <span className="flex items-center gap-1">
              <img src={iconLocalizacao} alt="" className="w-4 h-4" />
              {atividade.local}
            </span>
          </div>

          <Link
            to={`/atividades/${atividade.id}`}
            className="mt-auto block text-center w-full bg-purple-50 text-purple-700 font-semibold py-2.5 rounded-full hover:bg-purple-100 transition text-sm"
          >
            Ver detalhes →
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-3">
            Você ainda não está inscrita em nenhuma atividade futura.
          </p>
          <Link
            to="/atividades"
            className="mt-auto block text-center w-full bg-purple-50 text-purple-700 font-semibold py-2.5 rounded-full hover:bg-purple-100 transition text-sm"
          >
            Encontrar atividades →
          </Link>
        </>
      )}
    </div>
  )
}

export default NextActivityCard

import iconDataHorario from '../assets/icons/03_data_horario.png'
import iconLocalizacao from '../assets/icons/35_localizacao.png'
import imgTecnologia from '../assets/icons/notebook.jpg'
import imgIa from '../assets/icons/IA.jpg'
import imgDesign from '../assets/icons/ideia.jpg'

function FeaturedActivities() {
  const atividades = [
    {
      categoria: 'TECNOLOGIA',
      corCategoria: 'bg-pink-100 text-pink-600',
      titulo: 'Oficina de Programação Web',
      data: '12 de out',
      hora: '14h',
      local: 'UTFPR-CP',
      imagem: imgTecnologia,
    },
    {
      categoria: 'IA & DADOS',
      corCategoria: 'bg-purple-100 text-purple-600',
      titulo: 'Inteligência Artificial para Iniciantes',
      data: '18 de out',
      hora: '14h',
      local: 'UTFPR-CP',
      imagem: imgIa,
    },
    {
      categoria: 'CRIATIVIDADE',
      corCategoria: 'bg-orange-100 text-orange-600',
      titulo: 'Design Thinking na Prática',
      data: '22 de out',
      hora: '14h',
      local: 'UTFPR-CP',
      imagem: imgDesign,
    },
  ]

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Atividades em destaque</h2>
        <button className="text-sm text-purple-600 font-semibold hover:underline">
          Ver todas →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {atividades.map((atividade) => (
          <div key={atividade.titulo} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <img
              src={atividade.imagem}
              alt={atividade.titulo}
              className="w-full h-28 object-cover"
            />

            <div className="p-4">
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${atividade.corCategoria}`}>
                {atividade.categoria}
              </span>

              <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug">
                {atividade.titulo}
              </h3>

              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <img src={iconDataHorario} alt="" className="w-3.5 h-3.5" />
                  {atividade.data} • {atividade.hora}
                </span>
                <span className="flex items-center gap-1">
                  <img src={iconLocalizacao} alt="" className="w-3.5 h-3.5" />
                  {atividade.local}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 bg-pink-500 text-white font-semibold py-2 rounded-full hover:bg-pink-600 transition text-sm">
                  Inscrever-se
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition">
                  →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedActivities
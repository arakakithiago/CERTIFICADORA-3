import iconCadastro from '../assets/icons/06_adicionar.png'
import iconOficina from '../assets/icons/54_notebook.png'
import iconIa from '../assets/icons/30_ia.png'
import iconMentoria from '../assets/icons/03_mentoria.png'
import iconProjeto from '../assets/icons/48_foguete_papel.png'
import iconConcluido from '../assets/icons/22_concluido.png'

function TrailTimeline() {
  const etapas = [
    { titulo: 'Cadastro', status: 'concluido', icone: iconCadastro },
    { titulo: 'Primeira oficina', status: 'concluido', icone: iconOficina },
    { titulo: 'IA para iniciantes', status: 'em_andamento', icone: iconIa },
    { titulo: 'Mentoria', status: 'em_breve', icone: iconMentoria },
    { titulo: 'Projeto próprio', status: 'em_breve', icone: iconProjeto },
  ]

  const textoPorStatus = {
    concluido: 'Concluído',
    em_andamento: 'Em andamento',
    em_breve: 'Em breve',
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Minha trilha</h2>
        <button className="text-sm text-purple-600 font-semibold hover:underline">
          Ver completa →
        </button>
      </div>

      <div className="relative pl-2">
        <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gray-200"></div>

        <div className="flex flex-col gap-5">
          {etapas.map((etapa) => (
            <div key={etapa.titulo} className="relative flex items-start gap-3">
              <div
                className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                  etapa.status === 'em_breve' ? 'bg-gray-100 opacity-50' : 'bg-purple-50'
                }`}
              >
                <img src={etapa.icone} alt="" className="w-7 h-7 object-contain" />
                {etapa.status === 'concluido' && (
                  <img
                    src={iconConcluido}
                    alt=""
                    className="absolute -bottom-1 -right-1 w-4 h-4"
                  />
                )}
              </div>
              <div className="pt-2">
                <p className="font-semibold text-gray-800 text-sm">{etapa.titulo}</p>
                <p
                  className={`text-xs ${
                    etapa.status === 'concluido'
                      ? 'text-purple-600'
                      : etapa.status === 'em_andamento'
                      ? 'text-purple-600 font-semibold'
                      : 'text-gray-400'
                  }`}
                >
                  {textoPorStatus[etapa.status]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrailTimeline
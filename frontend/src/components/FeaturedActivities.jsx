import { Link } from 'react-router-dom'
import ActivityCard from './ActivityCard'

// Grade de atividades (recebe as oficinas já carregadas).
function FeaturedActivities({
  titulo = 'Atividades em destaque',
  oficinas = [],
  onAtualizado,
  mostrarVerTodas = true,
  mensagemVazio = 'Nenhuma atividade disponível no momento.',
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{titulo}</h2>
        {mostrarVerTodas && (
          <Link to="/atividades" className="text-sm text-purple-600 font-semibold hover:underline">
            Ver todas →
          </Link>
        )}
      </div>

      {oficinas.length === 0 ? (
        <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-gray-500 shadow-sm">
          {mensagemVazio}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {oficinas.map((oficina) => (
            <ActivityCard key={oficina.id} oficina={oficina} onAtualizado={onAtualizado} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FeaturedActivities

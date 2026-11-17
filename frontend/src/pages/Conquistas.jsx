import LayoutAluna from '../components/LayoutAluna'
import AchievementsSection from '../components/AchievementsSection'
import EstadoCarregamento from '../components/EstadoCarregamento'
import { useAuth } from '../context/AuthContext'
import { useCarregar } from '../hooks/useCarregar'
import { listarConquistas } from '../services/api'

function Conquistas() {
  const { usuario } = useAuth()
  const { dados: conquistas, erro, carregando } = useCarregar(
    () => listarConquistas(usuario.id),
    [usuario.id]
  )

  return (
    <LayoutAluna>
      <section className="mx-auto mt-4 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Conquistas</h1>
          <p className="mt-2 text-gray-500">
            Veja os emblemas que celebram seu progresso no Meninas Digitais. Os emblemas
            apagados ainda estão esperando por você!
          </p>
        </div>

        <EstadoCarregamento carregando={carregando} erro={erro}>
          {conquistas && (
            <AchievementsSection conquistas={conquistas} mostrarLink={false} detalhado />
          )}
        </EstadoCarregamento>
      </section>
    </LayoutAluna>
  )
}

export default Conquistas

import LayoutAluna from '../components/LayoutAluna'
import TrailTimeline from '../components/TrailTimeline'
import JourneyCard from '../components/JourneyCard'
import EstadoCarregamento from '../components/EstadoCarregamento'
import { useAuth } from '../context/AuthContext'
import { useCarregar } from '../hooks/useCarregar'
import { obterTrilha } from '../services/api'

function MinhaTrilha() {
  const { usuario } = useAuth()
  const { dados: trilha, erro, carregando } = useCarregar(() => obterTrilha(usuario.id), [usuario.id])

  return (
    <LayoutAluna>
      <section className="mx-auto mt-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Minha trilha</h1>
          <p className="mt-2 text-gray-500">
            Acompanhe suas etapas, veja o que já concluiu e descubra o que vem pela frente.
          </p>
        </div>

        <EstadoCarregamento carregando={carregando} erro={erro}>
          {trilha && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TrailTimeline etapas={trilha.etapas} mostrarLink={false} mostrarDicas />
              <div className="space-y-6">
                <JourneyCard
                  percentual={trilha.percentual}
                  atividadesConcluidas={trilha.atividadesConcluidas}
                  totalAtividades={trilha.totalAtividades}
                  badges={trilha.badges}
                  certificados={trilha.certificados}
                />
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900">Pontuação</h2>
                  <p className="mt-2 text-3xl font-bold text-purple-700">
                    ⭐ {trilha.menina.pontos}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Cada presença em atividade vale 50 pontos e cada encontro de mentoria, 30.
                  </p>
                </div>
              </div>
            </div>
          )}
        </EstadoCarregamento>
      </section>
    </LayoutAluna>
  )
}

export default MinhaTrilha

import LayoutAluna from '../components/LayoutAluna'
import Hero from '../components/Hero'
import JourneyCard from '../components/JourneyCard'
import NextActivityCard from '../components/NextActivityCard'
import AchievementsSection from '../components/AchievementsSection'
import FeaturedActivities from '../components/FeaturedActivities'
import HighlightCard from '../components/HighlightCard'
import TrailTimeline from '../components/TrailTimeline'
import JoinCard from '../components/JoinCard'
import EstadoCarregamento from '../components/EstadoCarregamento'
import { useAuth } from '../context/AuthContext'
import { useCarregar } from '../hooks/useCarregar'
import { obterRecomendacoes, obterTrilha } from '../services/api'

function Dashboard() {
  const { usuario } = useAuth()
  const { dados, erro, carregando, recarregar } = useCarregar(async () => {
    const [trilha, recomendacoes] = await Promise.all([
      obterTrilha(usuario.id),
      obterRecomendacoes(usuario.id, 3),
    ])
    return { trilha, recomendacoes }
  }, [usuario.id])

  return (
    <LayoutAluna>
      <Hero />

      <EstadoCarregamento carregando={carregando} erro={erro}>
        {dados && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <JourneyCard
                    percentual={dados.trilha.percentual}
                    atividadesConcluidas={dados.trilha.atividadesConcluidas}
                    totalAtividades={dados.trilha.totalAtividades}
                    badges={dados.trilha.badges}
                    certificados={dados.trilha.certificados}
                  />
                </div>
                <div className="flex-1">
                  <NextActivityCard atividade={dados.trilha.proximaAtividade} />
                </div>
              </div>

              <AchievementsSection conquistas={dados.trilha.conquistas} />
              <FeaturedActivities
                titulo="Recomendadas para você"
                oficinas={dados.recomendacoes}
                onAtualizado={recarregar}
                mensagemVazio="Você já está inscrita em todas as atividades abertas. 🎉"
              />
            </div>

            <div className="space-y-6">
              <HighlightCard />
              <TrailTimeline etapas={dados.trilha.etapas} />
              <JoinCard />
            </div>
          </div>
        )}
      </EstadoCarregamento>
    </LayoutAluna>
  )
}

export default Dashboard

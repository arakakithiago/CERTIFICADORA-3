import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Hero from '../components/Hero'
import JourneyCard from '../components/JourneyCard'
import NextActivityCard from '../components/NextActivityCard'
import AchievementsSection from '../components/AchievementsSection'
import FeaturedActivities from '../components/FeaturedActivities'
import HighlightCard from '../components/HighlightCard'
import TrailTimeline from '../components/TrailTimeline'
import JoinCard from '../components/JoinCard'

function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-8">
        <Header />
        <Hero />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <JourneyCard
                  percentual={68}
                  atividadesConcluidas={8}
                  totalAtividades={12}
                  badges={3}
                  certificados={2}
                />
              </div>
              <div className="flex-1">
                <NextActivityCard
                  categoria="TECNOLOGIA"
                  titulo="Introdução ao Desenvolvimento Web"
                  data="12 de out"
                  hora="14h"
                  local="UTFPR-CP"
                  vagas={12}
                />
              </div>
            </div>

            <AchievementsSection />
            <FeaturedActivities />
          </div>

          <div className="space-y-6">
            <HighlightCard />
            <TrailTimeline />
            <JoinCard />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
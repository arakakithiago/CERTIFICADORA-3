import Sidebar from './components/Sidebar'
import Header from './components/Header'
import JourneyCard from './components/JourneyCard'
import NextActivityCard from './components/NextActivityCard'
import AchievementsSection from './components/AchievementsSection'

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-8">
        <Header nomeUsuaria="Bruna" />

        <div className="flex gap-6">
          <JourneyCard
            percentual={68}
            atividadesConcluidas={8}
            totalAtividades={12}
            badges={3}
            certificados={2}
          />

          <NextActivityCard
            categoria="TECNOLOGIA"
            titulo="Introdução ao Desenvolvimento Web"
            data="12 de out"
            hora="14h"
            local="UTFPR-CP"
            vagas={12}
          />
        </div>

        <AchievementsSection />
      </main>
    </div>
  )
}

export default App
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import AchievementsSection from '../components/AchievementsSection'

function Conquistas() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <Header />
        <section className="mx-auto mt-8 max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Conquistas</h1>
            <p className="mt-2 text-gray-500">
              Veja os emblemas que celebram seu progresso no Meninas Digitais.
            </p>
          </div>
          <AchievementsSection />
        </section>
      </main>
    </div>
  )
}

export default Conquistas

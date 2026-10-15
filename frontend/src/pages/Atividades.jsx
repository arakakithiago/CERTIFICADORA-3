import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import FeaturedActivities from '../components/FeaturedActivities'

function Atividades() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <Header />
        <section className="mx-auto mt-8 max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Atividades</h1>
            <p className="mt-2 text-gray-500">
              Explore oficinas e atividades para aprender e avançar na sua trilha.
            </p>
          </div>
          <FeaturedActivities />
        </section>
      </main>
    </div>
  )
}

export default Atividades

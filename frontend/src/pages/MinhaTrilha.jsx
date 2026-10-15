import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import TrailTimeline from '../components/TrailTimeline'

function MinhaTrilha() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <Header />
        <section className="mx-auto mt-8 max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Minha trilha</h1>
            <p className="mt-2 text-gray-500">
              Acompanhe suas etapas, veja o que já concluiu e descubra o que vem
              pela frente.
            </p>
          </div>
          <TrailTimeline />
        </section>
      </main>
    </div>
  )
}

export default MinhaTrilha

import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

function Mentorias() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <Header />
        <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Mentorias</h1>
          <p className="mt-2 text-gray-500">
            Acompanhe seus encontros e conexões com mentoras do projeto.
          </p>
          <div className="mt-6 rounded-xl bg-purple-50 p-5">
            <h2 className="font-semibold text-purple-900">
              Sua jornada de mentoria
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-purple-800">
              As informações dos encontros aparecerão aqui quando forem
              disponibilizadas. Enquanto isso, você pode acompanhar as etapas da
              sua jornada.
            </p>
            <Link
              to="/minha-trilha"
              className="mt-4 inline-block font-semibold text-purple-700 hover:underline"
            >
              Acompanhar minha trilha →
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Mentorias

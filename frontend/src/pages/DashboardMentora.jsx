import { useAuth } from '../context/AuthContext'

function DashboardMentora() {
  const { usuario, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Olá, {usuario?.nome}! 👋
        </h1>
        <p className="text-gray-500 mb-6">Painel da Mentora — em construção</p>
        <p className="text-sm text-gray-400 mb-6">
          Em breve: cadastro de atividades, registro de presença e
          encontros de mentoria.
        </p>
        <button
          onClick={logout}
          className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition text-sm"
        >
          Sair
        </button>
      </div>
    </div>
  )
}

export default DashboardMentora
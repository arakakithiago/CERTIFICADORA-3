import { useAuth } from '../context/AuthContext'
import Dashboard from './Dashboard'
import DashboardMentora from './DashboardMentora'
import DashboardCoordenacao from './DashboardCoordenacao'
import LandingPage from './LandingPage'

function PaginaInicial() {
  const { usuario } = useAuth()

  if (!usuario) {
    return <LandingPage />
  }

  if (usuario.tipo === 'mentora') {
    return <DashboardMentora />
  }

  if (usuario.tipo === 'coordenacao') {
    return <DashboardCoordenacao />
  }

  return <Dashboard />
}

export default PaginaInicial
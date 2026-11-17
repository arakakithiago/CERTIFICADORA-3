import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Dashboard from './Dashboard'
import DashboardMentora from './DashboardMentora'
import DashboardCoordenacao from './DashboardCoordenacao'
import LandingPage from './LandingPage'

function PaginaInicial() {
  const { usuario, avisoSessao } = useAuth()

  if (!usuario) {
    // Desconectada automaticamente (ex.: conta desativada): o login explica o motivo.
    if (avisoSessao) return <Navigate to="/login" replace />
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

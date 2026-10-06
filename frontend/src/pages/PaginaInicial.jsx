import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Dashboard from './Dashboard'
import DashboardMentora from './DashboardMentora'
import DashboardCoordenacao from './DashboardCoordenacao'

function PaginaInicial() {
  const { usuario } = useAuth()

  if (!usuario) {
    return <Navigate to="/login" replace />
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
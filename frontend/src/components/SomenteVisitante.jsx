import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Telas que só fazem sentido para quem NÃO está logado (login e cadastro).
// Quem já entrou é levado para o próprio painel.
function SomenteVisitante({ children }) {
  const { usuario } = useAuth()
  if (usuario) return <Navigate to="/" replace />
  return children
}

export default SomenteVisitante

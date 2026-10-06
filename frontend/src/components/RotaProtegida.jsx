import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RotaProtegida({ tiposPermitidos, children }) {
  const { usuario } = useAuth()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (tiposPermitidos && !tiposPermitidos.includes(usuario.tipo)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RotaProtegida
import { Link } from 'react-router-dom'
import iconNotificacoes from '../assets/icons/08_notificacoes.png'
import iconPerfil from '../assets/icons/09_perfil_menu.png'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { usuario } = useAuth()

  return (
    <header className="flex items-center justify-end gap-4 mb-4">
      <button className="relative">
        <img src={iconNotificacoes} alt="Notificações" className="w-7 h-7" />
      </button>

      {usuario ? (
        <button className="flex items-center gap-2">
          <img src={iconPerfil} alt="Perfil" className="w-9 h-9 rounded-full" />
          <span className="font-semibold text-gray-800 text-sm">{usuario.nome}</span>
        </button>
      ) : (
        <Link
          to="/login"
          className="bg-purple-700 text-white font-semibold px-5 py-2 rounded-full hover:bg-purple-800 transition text-sm"
        >
          Entrar
        </Link>
      )}
    </header>
  )
}

export default Header
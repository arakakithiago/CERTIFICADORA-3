import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import iconNotificacoes from '../assets/icons/08_notificacoes.png'
import iconPerfil from '../assets/icons/09_perfil_menu.png'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)

  function handleLogout() {
    logout()
    setMenuAberto(false)
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-end gap-4 mb-4">
      <button type="button" className="relative" aria-label="Notificações">
        <img src={iconNotificacoes} alt="Notificações" className="w-7 h-7" />
      </button>

      {usuario ? (
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            aria-expanded={menuAberto}
            aria-label="Menu do usuário"
          >
            <img src={iconPerfil} alt="Perfil" className="w-9 h-9 rounded-full" />
            <span className="font-semibold text-gray-800 text-sm">{usuario.nome}</span>
          </button>

          {menuAberto && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                Sair
              </button>
            </div>
          )}
        </div>
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
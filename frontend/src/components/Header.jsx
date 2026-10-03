import iconNotificacoes from '../assets/icons/08_notificacoes.png'
import iconPerfil from '../assets/icons/09_perfil_menu.png'

function Header({ nomeUsuaria }) {
  return (
    <header className="flex items-center justify-end gap-4 mb-4">
      <button className="relative">
        <img src={iconNotificacoes} alt="Notificações" className="w-8 h-8" />
      </button>
      <button className="flex items-center gap-2">
        <img src={iconPerfil} alt="Perfil" className="w-10 h-10 rounded-full" />
        <span className="font-semibold text-gray-800">{nomeUsuaria}</span>
      </button>
    </header>
  )
}

export default Header
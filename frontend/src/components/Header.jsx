import iconNotificacoes from '../assets/icons/08_notificacoes.png'
import iconPerfil from '../assets/icons/09_perfil_menu.png'

function Header({ nomeUsuaria }) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {nomeUsuaria}! <span>✨</span>
        </h1>
        <p className="text-gray-500 mt-1">Que bom te ver por aqui</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative">
          <img src={iconNotificacoes} alt="Notificações" className="w-8 h-8" />
        </button>

        <button className="flex items-center gap-2">
          <img src={iconPerfil} alt="Perfil" className="w-10 h-10 rounded-full" />
          <span className="font-semibold text-gray-800">{nomeUsuaria}</span>
        </button>
      </div>
    </header>
  )
}

export default Header
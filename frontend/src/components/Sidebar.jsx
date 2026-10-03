import iconInicio from '../assets/icons/01_inicio.png'
import iconMinhaTrilha from '../assets/icons/02_minha_trilha.png'
import iconAtividades from '../assets/icons/03_atividades.png'
import iconMentorias from '../assets/icons/04_mentorias.png'
import iconConquistas from '../assets/icons/05_conquistas.png'
import iconCertificados from '../assets/icons/06_certificados.png'

function Sidebar() {
  const menuItems = [
    { nome: 'Início', icone: iconInicio, ativo: true },
    { nome: 'Minha Trilha', icone: iconMinhaTrilha, ativo: false },
    { nome: 'Atividades', icone: iconAtividades, ativo: false },
    { nome: 'Mentorias', icone: iconMentorias, ativo: false },
    { nome: 'Conquistas', icone: iconConquistas, ativo: false },
    { nome: 'Certificados', icone: iconCertificados, ativo: false },
  ]

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 text-white flex flex-col p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-purple-400 rounded-full"></div>
        <div>
          <h1 className="font-bold text-sm leading-tight">MENINAS<br />DIGITAIS</h1>
          <p className="text-xs text-purple-300">UTFPR-CP</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.nome}
            className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg transition ${
              item.ativo
                ? 'bg-purple-700 font-semibold'
                : 'hover:bg-purple-800 text-purple-200'
            }`}
          >
            <img src={item.icone} alt="" className="w-5 h-5" />
            {item.nome}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
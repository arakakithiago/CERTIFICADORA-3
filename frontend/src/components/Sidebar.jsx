import iconInicio from '../assets/icons/01_inicio.png'
import iconMinhaTrilha from '../assets/icons/02_minha_trilha.png'
import iconAtividades from '../assets/icons/03_atividades.png'
import iconMentorias from '../assets/icons/04_mentorias.png'
import iconConquistas from '../assets/icons/05_conquistas.png'
import iconCertificados from '../assets/icons/06_certificados.png'
import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
  const { pathname } = useLocation()
  const menuItems = [
    { nome: 'Início', icone: iconInicio, destino: '/' },
    { nome: 'Minha Trilha', icone: iconMinhaTrilha, destino: '/minha-trilha' },
    { nome: 'Atividades', icone: iconAtividades, destino: '/atividades' },
    { nome: 'Mentorias', icone: iconMentorias, destino: '/mentorias' },
    { nome: 'Conquistas', icone: iconConquistas, destino: '/conquistas' },
    { nome: 'Certificados', icone: iconCertificados, destino: '/certificados' },
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
        {menuItems.map((item) => {
          const ativo = item.destino === pathname
          const className = `flex items-center gap-3 text-left px-4 py-3 rounded-lg transition ${
            ativo
              ? 'bg-purple-700 font-semibold'
              : 'hover:bg-purple-800 text-purple-200'
          }`
          const conteudo = (
            <>
              <img src={item.icone} alt="" className="w-5 h-5" />
              {item.nome}
            </>
          )

          return item.destino ? (
            <Link
              key={item.nome}
              to={item.destino}
              className={className}
              aria-current={ativo ? 'page' : undefined}
            >
              {conteudo}
            </Link>
          ) : (
            <button key={item.nome} type="button" className={className}>
              {conteudo}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
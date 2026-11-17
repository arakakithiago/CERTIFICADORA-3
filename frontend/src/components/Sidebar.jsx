import iconInicio from '../assets/icons/01_inicio.png'
import iconMinhaTrilha from '../assets/icons/02_minha_trilha.png'
import iconAtividades from '../assets/icons/03_atividades.png'
import iconMentorias from '../assets/icons/04_mentorias.png'
import iconConquistas from '../assets/icons/05_conquistas.png'
import iconCertificados from '../assets/icons/06_certificados.png'
import iconLogo from '../assets/icons/28_menina_digital.png'
import { Link, useLocation } from 'react-router-dom'

const MENU = [
  { nome: 'Início', icone: iconInicio, destino: '/' },
  { nome: 'Minha Trilha', icone: iconMinhaTrilha, destino: '/minha-trilha' },
  { nome: 'Atividades', icone: iconAtividades, destino: '/atividades' },
  { nome: 'Mentorias', icone: iconMentorias, destino: '/mentorias' },
  { nome: 'Conquistas', icone: iconConquistas, destino: '/conquistas' },
  { nome: 'Certificados', icone: iconCertificados, destino: '/certificados' },
]

// Em telas grandes fica fixa ao lado; no celular abre por cima (`aberta`).
function Sidebar({ aberta = false, onFechar }) {
  const { pathname } = useLocation()

  // "/atividades/3" também deixa "Atividades" marcado.
  const estaAtivo = (destino) =>
    destino === '/' ? pathname === '/' : pathname === destino || pathname.startsWith(`${destino}/`)

  return (
    <>
      {aberta && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onFechar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 text-white flex flex-col p-6 transition-transform lg:translate-x-0 ${
          aberta ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center gap-3" onClick={onFechar}>
            <img src={iconLogo} alt="" className="w-10 h-10 rounded-full bg-purple-400 p-1" />
            <div>
              <h1 className="font-bold text-sm leading-tight">
                MENINAS
                <br />
                DIGITAIS
              </h1>
              <p className="text-xs text-purple-300">UTFPR-CP</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onFechar}
            className="lg:hidden text-purple-200 hover:text-white text-2xl leading-none"
            aria-label="Fechar menu"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {MENU.map((item) => {
            const ativo = estaAtivo(item.destino)
            return (
              <Link
                key={item.nome}
                to={item.destino}
                onClick={onFechar}
                aria-current={ativo ? 'page' : undefined}
                className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg transition ${
                  ativo ? 'bg-purple-700 font-semibold' : 'hover:bg-purple-800 text-purple-200'
                }`}
              >
                <img src={item.icone} alt="" className="w-5 h-5" />
                {item.nome}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

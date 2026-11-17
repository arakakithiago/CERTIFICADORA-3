import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import iconNotificacoes from '../assets/icons/08_notificacoes.png'
import iconPerfil from '../assets/icons/09_perfil_menu.png'
import { useAuth } from '../context/AuthContext'
import { useCarregar } from '../hooks/useCarregar'
import { obterTrilha } from '../services/api'
import { formatarDataCurta, formatarHora } from '../utils/atividades'

const UM_DIA = 24 * 60 * 60 * 1000

// Notificações da menina, montadas a partir da trilha:
// atividades nos próximos 7 dias e conquistas dos últimos 7 dias.
function montarNotificacoes(trilha) {
  if (!trilha) return []
  const agora = Date.now()
  const lista = []

  const proxima = trilha.proximaAtividade
  if (proxima && new Date(proxima.data) - agora <= 7 * UM_DIA) {
    lista.push({
      chave: `atividade-${proxima.id}`,
      texto: `Lembrete: "${proxima.titulo}" em ${formatarDataCurta(proxima.data)} às ${formatarHora(proxima.data)}.`,
      destino: `/atividades/${proxima.id}`,
    })
  }

  for (const c of trilha.conquistas) {
    if (c.conquistado && agora - new Date(c.conquistado_em) <= 7 * UM_DIA) {
      lista.push({
        chave: `conquista-${c.nome}`,
        texto: `Nova conquista: ${c.nome}! 🎉`,
        destino: '/conquistas',
      })
    }
  }

  return lista
}

// Fecha o menu ao clicar fora dele.
function useFecharAoClicarFora(ref, aberto, fechar) {
  useEffect(() => {
    if (!aberto) return
    function aoClicar(evento) {
      if (ref.current && !ref.current.contains(evento.target)) fechar()
    }
    document.addEventListener('mousedown', aoClicar)
    return () => document.removeEventListener('mousedown', aoClicar)
  }, [ref, aberto, fechar])
}

function Header({ onAbrirMenu }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false)
  const refMenu = useRef(null)
  const refNotificacoes = useRef(null)

  const ehMenina = usuario?.tipo === 'menina'
  const { dados: trilha } = useCarregar(
    () => (ehMenina ? obterTrilha(usuario.id) : Promise.resolve(null)),
    [ehMenina, usuario?.id]
  )
  const notificacoes = montarNotificacoes(trilha)

  useFecharAoClicarFora(refMenu, menuAberto, () => setMenuAberto(false))
  useFecharAoClicarFora(refNotificacoes, notificacoesAbertas, () => setNotificacoesAbertas(false))

  function handleLogout() {
    logout()
    setMenuAberto(false)
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between gap-4 mb-4">
      <div>
        {onAbrirMenu && (
          <button
            type="button"
            onClick={onAbrirMenu}
            className="lg:hidden text-2xl text-purple-800 px-2"
            aria-label="Abrir menu"
          >
            ☰
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {ehMenina && (
          <div className="relative" ref={refNotificacoes}>
            <button
              type="button"
              className="relative"
              aria-label={`Notificações (${notificacoes.length})`}
              aria-expanded={notificacoesAbertas}
              onClick={() => setNotificacoesAbertas((aberto) => !aberto)}
            >
              <img src={iconNotificacoes} alt="" className="w-7 h-7" />
              {notificacoes.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {notificacoes.length}
                </span>
              )}
            </button>

            {notificacoesAbertas && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                <p className="px-4 py-3 text-sm font-bold text-gray-900 border-b border-gray-100">
                  Notificações
                </p>
                {notificacoes.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-gray-500">Nada de novo por aqui. 💜</p>
                ) : (
                  notificacoes.map((n) => (
                    <Link
                      key={n.chave}
                      to={n.destino}
                      onClick={() => setNotificacoesAbertas(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 border-b border-gray-50 last:border-0"
                    >
                      {n.texto}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {usuario ? (
          <div className="relative" ref={refMenu}>
            <button
              type="button"
              className="flex items-center gap-2"
              onClick={() => setMenuAberto((aberto) => !aberto)}
              aria-expanded={menuAberto}
              aria-label="Menu do usuário"
            >
              <img src={iconPerfil} alt="" className="w-9 h-9 rounded-full" />
              <span className="font-semibold text-gray-800 text-sm hidden sm:inline">
                {usuario.nome}
              </span>
            </button>

            {menuAberto && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                {ehMenina && trilha && (
                  <p className="px-4 py-3 text-xs text-gray-500 border-b border-gray-100">
                    ⭐ {trilha.menina.pontos} pontos
                  </p>
                )}
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
      </div>
    </header>
  )
}

export default Header

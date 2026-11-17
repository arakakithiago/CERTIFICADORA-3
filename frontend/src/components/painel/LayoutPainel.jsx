import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Painel com abas para mentora e coordenação. A aba atual fica na URL
// (?aba=...), então recarregar a página mantém a aba aberta.
function LayoutPainel({ subtitulo, abas }) {
  const { usuario, logout } = useAuth()
  const [params, setParams] = useSearchParams()

  const abaAtual = abas.find((a) => a.chave === params.get('aba')) || abas[0]

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Olá, {usuario?.nome}! 👋</h1>
            <p className="text-gray-500">{subtitulo}</p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition text-sm"
          >
            Sair
          </button>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-2 mb-6" role="tablist">
          {abas.map((aba) => (
            <button
              key={aba.chave}
              type="button"
              role="tab"
              aria-selected={aba.chave === abaAtual.chave}
              onClick={() => setParams({ aba: aba.chave })}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition ${
                aba.chave === abaAtual.chave
                  ? 'bg-purple-700 text-white'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              {aba.rotulo}
            </button>
          ))}
        </nav>

        <div role="tabpanel">{abaAtual.conteudo}</div>
      </div>
    </div>
  )
}

export default LayoutPainel

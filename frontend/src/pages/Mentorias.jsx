import { Link } from 'react-router-dom'
import LayoutAluna from '../components/LayoutAluna'
import EstadoCarregamento from '../components/EstadoCarregamento'
import { useAuth } from '../context/AuthContext'
import { useCarregar } from '../hooks/useCarregar'
import { listarEncontros, obterTrilha } from '../services/api'
import { formatarDiaLongo } from '../utils/atividades'

function Mentorias() {
  const { usuario } = useAuth()
  const { dados, erro, carregando } = useCarregar(async () => {
    const [trilha, encontros] = await Promise.all([
      obterTrilha(usuario.id),
      listarEncontros({ meninaId: usuario.id }),
    ])
    return { mentora: trilha.mentora, encontros }
  }, [usuario.id])

  return (
    <LayoutAluna>
      <section className="mx-auto mt-4 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mentorias</h1>
          <p className="mt-2 text-gray-500">
            Acompanhe seus encontros e conexões com mentoras do projeto.
          </p>
        </div>

        <EstadoCarregamento carregando={carregando} erro={erro}>
          {dados && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-purple-50 p-6">
                <h2 className="font-semibold text-purple-900">Sua mentora</h2>
                {dados.mentora ? (
                  <>
                    <p className="mt-2 text-lg font-bold text-purple-900">{dados.mentora.nome}</p>
                    <a
                      href={`mailto:${dados.mentora.email}`}
                      className="text-sm text-purple-700 hover:underline"
                    >
                      {dados.mentora.email}
                    </a>
                  </>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-purple-800">
                    Você ainda não tem uma mentora. Assim que houver uma mentora disponível, ela
                    será ligada a você automaticamente.
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Encontros ({dados.encontros.length})
                </h2>
                {dados.encontros.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Nenhum encontro registrado ainda. Enquanto isso, você pode{' '}
                    <Link to="/minha-trilha" className="font-semibold text-purple-700 hover:underline">
                      acompanhar sua trilha →
                    </Link>
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {dados.encontros.map((e) => (
                      <li key={e.id} className="border-l-4 border-purple-300 pl-4">
                        <p className="text-sm font-semibold text-gray-800">
                          {formatarDiaLongo(e.data)}
                          <span className="font-normal text-gray-400"> · com {e.mentora_nome}</span>
                        </p>
                        <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{e.resumo}</p>
                        {e.avaliacao_progresso && (
                          <p
                            className="mt-1 text-xs text-purple-600"
                            aria-label={`Progresso avaliado em ${e.avaliacao_progresso} de 5`}
                          >
                            Progresso: {'★'.repeat(e.avaliacao_progresso)}
                            {'☆'.repeat(5 - e.avaliacao_progresso)}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </EstadoCarregamento>
      </section>
    </LayoutAluna>
  )
}

export default Mentorias

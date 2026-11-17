import { Link, useParams } from 'react-router-dom'
import LayoutAluna from '../components/LayoutAluna'
import ActivityCard from '../components/ActivityCard'
import EstadoCarregamento from '../components/EstadoCarregamento'
import { useAuth } from '../context/AuthContext'
import { useCarregar } from '../hooks/useCarregar'
import { listarOficinas } from '../services/api'
import { categoria, formatarDataLonga, formatarHora } from '../utils/atividades'

function AtividadeDetalhe() {
  const { id } = useParams()
  const { usuario } = useAuth()

  // A listagem com menina_id já traz se ela está inscrita e se teve presença.
  const { dados: oficina, erro, carregando, recarregar } = useCarregar(async () => {
    const oficinas = await listarOficinas({ meninaId: usuario.id })
    const encontrada = oficinas.find((o) => String(o.id) === String(id))
    if (!encontrada) throw new Error('Atividade não encontrada.')
    return encontrada
  }, [id, usuario.id])

  return (
    <LayoutAluna>
      <section className="mx-auto mt-4 max-w-4xl">
        <Link to="/atividades" className="text-sm font-semibold text-purple-600 hover:underline">
          ← Voltar para atividades
        </Link>

        <div className="mt-4">
          <EstadoCarregamento carregando={carregando} erro={erro}>
            {oficina && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
                      categoria(oficina.categoria).cor
                    }`}
                  >
                    {categoria(oficina.categoria).rotulo}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900">{oficina.titulo}</h1>

                  <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-400">Data</dt>
                      <dd className="font-semibold text-gray-800">
                        {formatarDataLonga(oficina.data)} às {formatarHora(oficina.data)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Local</dt>
                      <dd className="font-semibold text-gray-800">{oficina.local}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Vagas</dt>
                      <dd className="font-semibold text-gray-800">
                        {oficina.vagas_restantes} de {oficina.vagas} disponíveis
                      </dd>
                    </div>
                    {oficina.instrutora_nome && (
                      <div>
                        <dt className="text-gray-400">Responsável</dt>
                        <dd className="font-semibold text-gray-800">{oficina.instrutora_nome}</dd>
                      </div>
                    )}
                  </dl>

                  <h2 className="mt-6 font-bold text-gray-900">Sobre a atividade</h2>
                  <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">
                    {oficina.descricao || 'A descrição desta atividade ainda não foi publicada.'}
                  </p>

                  {oficina.presenca && (
                    <Link
                      to="/certificados"
                      className="mt-6 inline-block rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800"
                    >
                      Baixar meu certificado →
                    </Link>
                  )}
                </div>

                <div>
                  <ActivityCard oficina={oficina} onAtualizado={recarregar} />
                </div>
              </div>
            )}
          </EstadoCarregamento>
        </div>
      </section>
    </LayoutAluna>
  )
}

export default AtividadeDetalhe

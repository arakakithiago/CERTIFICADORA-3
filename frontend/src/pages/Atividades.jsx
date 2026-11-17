import { useState } from 'react'
import LayoutAluna from '../components/LayoutAluna'
import FeaturedActivities from '../components/FeaturedActivities'
import EstadoCarregamento from '../components/EstadoCarregamento'
import { useAuth } from '../context/AuthContext'
import { useCarregar } from '../hooks/useCarregar'
import { listarOficinas } from '../services/api'
import { CATEGORIAS, jaAconteceu } from '../utils/atividades'

const ABAS = [
  { chave: 'proximas', rotulo: 'Próximas', filtro: (o) => !jaAconteceu(o.data) },
  { chave: 'inscritas', rotulo: 'Minhas inscrições', filtro: (o) => o.inscrita },
  { chave: 'realizadas', rotulo: 'Já realizadas', filtro: (o) => jaAconteceu(o.data) },
]

const MENSAGEM_VAZIO = {
  proximas: 'Nenhuma atividade programada no momento. Volte em breve!',
  inscritas: 'Você ainda não se inscreveu em nenhuma atividade.',
  realizadas: 'Nenhuma atividade realizada ainda.',
}

function Atividades() {
  const { usuario } = useAuth()
  const [aba, setAba] = useState('proximas')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')

  const { dados: oficinas, erro, carregando, recarregar } = useCarregar(
    () => listarOficinas({ meninaId: usuario.id }),
    [usuario.id]
  )

  const abaAtual = ABAS.find((a) => a.chave === aba)
  const visiveis = (oficinas || [])
    .filter(abaAtual.filtro)
    .filter((o) => !categoriaFiltro || o.categoria === categoriaFiltro)
  // Realizadas: as mais recentes primeiro.
  if (aba === 'realizadas') visiveis.reverse()

  return (
    <LayoutAluna>
      <section className="mx-auto mt-4 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Atividades</h1>
          <p className="mt-2 text-gray-500">
            Explore oficinas e atividades para aprender e avançar na sua trilha.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="tablist">
            {ABAS.map((a) => (
              <button
                key={a.chave}
                type="button"
                role="tab"
                aria-selected={aba === a.chave}
                onClick={() => setAba(a.chave)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  aba === a.chave
                    ? 'bg-purple-700 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                {a.rotulo}
              </button>
            ))}
          </div>

          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            aria-label="Filtrar por categoria"
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
          >
            <option value="">Todas as categorias</option>
            {Object.entries(CATEGORIAS).map(([chave, c]) => (
              <option key={chave} value={chave}>
                {c.rotulo}
              </option>
            ))}
          </select>
        </div>

        <EstadoCarregamento carregando={carregando} erro={erro}>
          <FeaturedActivities
            titulo={abaAtual.rotulo}
            oficinas={visiveis}
            onAtualizado={recarregar}
            mostrarVerTodas={false}
            mensagemVazio={MENSAGEM_VAZIO[aba]}
          />
        </EstadoCarregamento>
      </section>
    </LayoutAluna>
  )
}

export default Atividades

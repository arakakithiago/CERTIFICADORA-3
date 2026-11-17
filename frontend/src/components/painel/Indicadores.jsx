import Cartao from './Cartao'
import EstadoCarregamento from '../EstadoCarregamento'
import { useCarregar } from '../../hooks/useCarregar'
import { obterIndicadores } from '../../services/api'
import { categoria } from '../../utils/atividades'

// Número em destaque com rótulo e contexto.
function Bloco({ rotulo, valor, detalhe }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <p className="text-sm text-gray-500">{rotulo}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-gray-400">{detalhe}</p>}
    </div>
  )
}

function Indicadores() {
  const { dados, erro, carregando } = useCarregar(() => obterIndicadores(), [])
  const i = dados?.indicadores
  const porCategoria = dados?.porCategoria ?? []

  return (
    <EstadoCarregamento carregando={carregando} erro={erro}>
      {i && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Bloco
              rotulo="Meninas participantes"
              valor={i.totalMeninas}
              detalhe={
                i.meninasSemMentora
                  ? `${i.meninasSemMentora} sem mentora`
                  : 'Todas com mentora'
              }
            />
            <Bloco rotulo="Mentoras ativas" valor={i.mentorasAtivas} />
            <Bloco
              rotulo="Atividades"
              valor={i.totalOficinas}
              detalhe={`${i.oficinasFuturas} programada(s)`}
            />
            <Bloco
              rotulo="Taxa de presença"
              valor={i.taxaPresenca === null ? '—' : `${i.taxaPresenca}%`}
              detalhe="em atividades já realizadas"
            />
            <Bloco rotulo="Inscrições" valor={i.totalInscricoes} />
            <Bloco
              rotulo="Presenças (certificados)"
              valor={i.totalPresencas}
            />
            <Bloco rotulo="Encontros de mentoria" valor={i.totalEncontros} />
            <Bloco rotulo="Emblemas conquistados" valor={i.totalConquistas} />
          </div>

          <Cartao titulo="Por categoria">
            {porCategoria.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma atividade cadastrada ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="py-2 pr-4 font-semibold">Categoria</th>
                      <th className="py-2 px-4 font-semibold text-right">Atividades</th>
                      <th className="py-2 px-4 font-semibold text-right">Inscrições</th>
                      <th className="py-2 pl-4 font-semibold text-right">Presenças</th>
                    </tr>
                  </thead>
                  <tbody>
                    {porCategoria.map((c) => (
                      <tr key={c.categoria} className="border-b border-gray-50 last:border-0">
                        <td className="py-2 pr-4 text-gray-800">{categoria(c.categoria).rotulo}</td>
                        <td className="py-2 px-4 text-right tabular-nums">{c.oficinas}</td>
                        <td className="py-2 px-4 text-right tabular-nums">{c.inscricoes}</td>
                        <td className="py-2 pl-4 text-right tabular-nums">{c.presencas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Cartao>
        </div>
      )}
    </EstadoCarregamento>
  )
}

export default Indicadores

import { useState } from 'react'
import Cartao, { Mensagem, estiloBotao, estiloInput } from './Cartao'
import EstadoCarregamento from '../EstadoCarregamento'
import { useCarregar } from '../../hooks/useCarregar'
import { executarPareamento, listarMeninas } from '../../services/api'

function ListaAlunas() {
  const [busca, setBusca] = useState('')
  const [pareando, setPareando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const { dados: meninas, erro: erroLista, carregando, recarregar } = useCarregar(
    () => listarMeninas(),
    []
  )

  const semMentora = meninas?.filter((m) => !m.mentora_id).length ?? 0
  const termo = busca.trim().toLowerCase()
  const visiveis = (meninas || []).filter(
    (m) => !termo || m.nome.toLowerCase().includes(termo) || m.email.toLowerCase().includes(termo)
  )

  async function handleParear() {
    setErro('')
    setMensagem('')
    setPareando(true)
    try {
      const r = await executarPareamento()
      setMensagem(
        r.semMentora
          ? `${r.pareadas} aluna(s) pareada(s). ${r.semMentora} continuam sem mentora: cadastre ou reative uma mentora.`
          : `${r.pareadas} aluna(s) pareada(s). Todas as alunas têm mentora.`
      )
      await recarregar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setPareando(false)
    }
  }

  return (
    <Cartao
      titulo={`Alunas (${meninas?.length ?? 0})`}
      acoes={
        semMentora > 0 && (
          <button type="button" onClick={handleParear} disabled={pareando} className={`text-sm ${estiloBotao}`}>
            {pareando ? 'Pareando...' : `Parear ${semMentora} sem mentora`}
          </button>
        )
      }
    >
      <Mensagem>{erro}</Mensagem>
      <Mensagem tipo="sucesso">{mensagem}</Mensagem>

      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome ou e-mail"
        aria-label="Buscar aluna"
        className={`${estiloInput} mb-4 max-w-sm`}
      />

      <EstadoCarregamento
        carregando={carregando}
        erro={erroLista}
        vazio={visiveis.length === 0}
        mensagemVazio={termo ? 'Nenhuma aluna encontrada.' : 'Nenhuma aluna cadastrada ainda.'}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="py-2 pr-4 font-semibold">Aluna</th>
                <th className="py-2 px-4 font-semibold">Mentora</th>
                <th className="py-2 px-4 font-semibold text-right">Concluídas</th>
                <th className="py-2 px-4 font-semibold text-right">Emblemas</th>
                <th className="py-2 pl-4 font-semibold text-right">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2 pr-4">
                    <p className="font-semibold text-gray-800">{m.nome}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </td>
                  <td className="py-2 px-4">
                    {m.mentora_nome || <span className="text-amber-700">Sem mentora</span>}
                  </td>
                  <td className="py-2 px-4 text-right tabular-nums">
                    {m.atividades_concluidas}/{m.total_inscricoes}
                  </td>
                  <td className="py-2 px-4 text-right tabular-nums">{m.total_conquistas}</td>
                  <td className="py-2 pl-4 text-right tabular-nums">{m.pontos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EstadoCarregamento>
    </Cartao>
  )
}

export default ListaAlunas

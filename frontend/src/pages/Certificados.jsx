import { useState } from 'react'
import { Link } from 'react-router-dom'
import LayoutAluna from '../components/LayoutAluna'
import EstadoCarregamento from '../components/EstadoCarregamento'
import { useAuth } from '../context/AuthContext'
import { useCarregar } from '../hooks/useCarregar'
import { gerarCertificado, listarAtividadesConcluidas } from '../services/api'
import { categoria, formatarDataLonga } from '../utils/atividades'

function Certificados() {
  const { usuario } = useAuth()
  const [gerandoId, setGerandoId] = useState(null)
  const [erroDownload, setErroDownload] = useState('')

  const { dados: atividades, erro, carregando } = useCarregar(
    () => listarAtividadesConcluidas(usuario.id),
    [usuario.id]
  )

  async function baixar(atividade) {
    setErroDownload('')
    setGerandoId(atividade.id)
    try {
      const pdf = await gerarCertificado(usuario.id, atividade.id)
      const url = URL.createObjectURL(pdf)
      const link = document.createElement('a')
      const nomeArquivo = `${usuario.nome}-${atividade.titulo}`
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
      link.href = url
      link.download = `Certificado-${nomeArquivo}.pdf`
      link.click()
      // Espera o navegador iniciar o download antes de liberar a memória.
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      setErroDownload(err.message)
    } finally {
      setGerandoId(null)
    }
  }

  return (
    <LayoutAluna>
      <section className="mx-auto mt-4 max-w-3xl rounded-2xl bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meus certificados</h1>
          <p className="mt-2 text-gray-500">
            Cada atividade com presença confirmada gera um certificado de participação em PDF.
          </p>
        </div>

        {erroDownload && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {erroDownload}
          </p>
        )}

        <EstadoCarregamento
          carregando={carregando}
          erro={erro}
          vazio={atividades?.length === 0}
          mensagemVazio={
            <>
              Você ainda não concluiu nenhuma atividade.{' '}
              <Link to="/atividades" className="font-semibold text-purple-700 hover:underline">
                Ver atividades →
              </Link>
            </>
          }
        >
          <ul className="divide-y divide-gray-100">
            {atividades?.map((atividade) => (
              <li
                key={atividade.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4"
              >
                <div>
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-1 ${
                      categoria(atividade.categoria).cor
                    }`}
                  >
                    {categoria(atividade.categoria).rotulo}
                  </span>
                  <p className="font-semibold text-gray-900">{atividade.titulo}</p>
                  <p className="text-xs text-gray-400">{formatarDataLonga(atividade.data)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => baixar(atividade)}
                  disabled={gerandoId !== null}
                  className="rounded-xl bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {gerandoId === atividade.id ? 'Gerando...' : 'Baixar PDF'}
                </button>
              </li>
            ))}
          </ul>
        </EstadoCarregamento>
      </section>
    </LayoutAluna>
  )
}

export default Certificados

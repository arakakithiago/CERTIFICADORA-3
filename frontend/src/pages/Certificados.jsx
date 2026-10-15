import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { gerarCertificado } from '../services/api'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

function Certificados() {
  const { usuario } = useAuth()
  const [nomeAtividade, setNomeAtividade] = useState('')
  const [erro, setErro] = useState('')
  const [gerando, setGerando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setGerando(true)

    try {
      const pdf = await gerarCertificado({
        nome_menina: usuario?.nome,
        nome_atividade: nomeAtividade,
      })
      const url = URL.createObjectURL(pdf)
      const link = document.createElement('a')
      const nomeArquivo = (usuario?.nome || 'participante').replace(/\s+/g, '')
      link.href = url
      link.download = `Certificado-${nomeArquivo}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      setErro(error.message)
    } finally {
      setGerando(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <Header />
        <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Meus certificados</h1>
            <p className="mt-2 text-gray-500">
              Gere o certificado de participação de uma atividade concluída.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="nome-participante"
                className="mb-1 block text-sm font-semibold text-gray-700"
              >
                Nome da participante
              </label>
              <input
                id="nome-participante"
                type="text"
                value={usuario?.nome || ''}
                readOnly
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-600"
              />
            </div>

            <div>
              <label
                htmlFor="nome-atividade"
                className="mb-1 block text-sm font-semibold text-gray-700"
              >
                Atividade concluída
              </label>
              <input
                id="nome-atividade"
                type="text"
                value={nomeAtividade}
                onChange={(event) => setNomeAtividade(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex.: Introdução ao Desenvolvimento Web"
              />
            </div>

            {erro && (
              <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={gerando || !usuario?.nome}
              className="w-full rounded-xl bg-purple-700 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {gerando ? 'Gerando certificado...' : 'Gerar certificado em PDF'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Certificados


import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fazerLogin } from '../services/api'
import { useAuth } from '../context/AuthContext'
import meninasDigitais from '../assets/meninas_digitais.jpg'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { login, avisoSessao } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const usuario = await fazerLogin({ email, senha })
      login(usuario)
      navigate('/')
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#180d2b] flex items-center justify-center p-5">

      <div className="absolute -top-40 -left-32 w-96 h-96 rounded-full bg-purple-700/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 w-96 h-96 rounded-full bg-pink-600/30 blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[28px] overflow-hidden shadow-2xl shadow-black/30">

        <div className="hidden md:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#5410a0] via-[#9214bd] to-[#e54a91] p-12 text-white">

          <div className="absolute -right-20 -top-20 w-72 h-72 border border-white/10 rounded-full" />
          <div className="absolute -right-10 -top-10 w-52 h-52 border border-white/10 rounded-full" />
          <div className="absolute -left-20 -bottom-24 w-80 h-80 border border-white/10 rounded-full" />

          <div className="relative z-10">

            <img
              src={meninasDigitais}
              alt="Meninas Digitais"
              className="w-16 h-16 object-contain mb-6"
            />

            <p className="text-sm tracking-[0.25em] font-semibold text-white/80">
              UTFPR - CP
            </p>

            <h1 className="text-4xl font-extrabold leading-tight mt-3">
              MENINAS
              <br />
              DIGITAIS
            </h1>

            <div className="w-16 h-1 bg-orange-300 rounded-full mt-5" />

            <p className="text-white/85 text-base leading-relaxed mt-6 max-w-xs">
              A tecnologia também é lugar de menina.
              Descubra, aprenda, crie e transforme o futuro com a gente!
            </p>
          </div>

          <div className="relative z-10">
            <p className="text-white/80 text-sm">
              Conhecimento que conecta. Tecnologia que transforma.
            </p>

            <p className="text-white/50 text-xs mt-2">
              Meninas Digitais • UTFPR-CP
            </p>
          </div>
        </div>

        <div className="p-7 sm:p-10 md:p-12 flex flex-col justify-center">

          <div className="md:hidden mb-7">
            <p className="text-xs font-bold tracking-[0.2em] text-purple-700">
              UTFPR - CP
            </p>

            <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
              Meninas Digitais
            </h2>
          </div>

          <div className="mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-purple-600">
              Que bom ter você aqui!
            </span>

            <h2 className="text-3xl font-extrabold text-[#241438] mt-2">
              Bem-vinda de volta!
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              Entre na sua conta para continuar sua jornada.
            </p>
          </div>

          {avisoSessao && !erro && (
            <div
              role="status"
              className="bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-xl px-4 py-3 mb-5"
            >
              Você foi desconectada: {avisoSessao}
            </div>
          )}

          {erro && (
            <div
              role="alert"
              className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-5"
            >
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                required
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>

              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-200 hover:from-purple-800 hover:to-fuchsia-700 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? 'Entrando...' : 'Entrar na minha conta'}
            </button>
          </form>

          <div className="border-t border-gray-100 mt-8 pt-6">

            <p className="text-center text-sm text-gray-500">
              Ainda não faz parte do projeto?
            </p>

            <p className="text-center text-sm mt-2">
              <Link
                to="/cadastro"
                className="font-bold text-purple-700 hover:text-fuchsia-600 transition"
              >
                Criar minha conta
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Meninas Digitais • UTFPR-CP
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login

import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <span className="font-bold text-purple-800">Meninas Digitais</span>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-purple-700 font-semibold px-5 py-2 rounded-full hover:bg-purple-50 transition text-sm"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="bg-purple-700 text-white font-semibold px-5 py-2 rounded-full hover:bg-purple-800 transition text-sm"
          >
            Cadastre-se
          </Link>
        </div>
      </header>

      <section className="relative bg-gradient-to-r from-purple-700 via-fuchsia-600 to-orange-400 overflow-hidden mx-4 sm:mx-8 rounded-2xl p-8 sm:p-12 mb-10">
        <div className="relative z-10 max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Incentivando meninas a trilharem carreiras em tecnologia
          </h1>
          <p className="text-white/90 mb-6">
            O Meninas Digitais UTFPR-CP é um projeto de extensão que leva
            oficinas, mentorias e minicursos para estudantes do ensino
            fundamental e médio de Cornélio Procópio. 💜
          </p>
          <Link
            to="/cadastro"
            className="inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-full hover:bg-purple-50 transition"
          >
            Quero participar →
          </Link>
        </div>

        <div className="hidden sm:block absolute -right-4 -bottom-6 w-64 h-64 pointer-events-none">
          <div
            className="absolute inset-0 bg-gradient-to-br from-pink-300 via-pink-400 to-orange-300"
            style={{ borderRadius: '42% 58% 65% 35% / 45% 40% 60% 55%' }}
          ></div>
          <img
            src={heroImg}
            alt="Menina participante do projeto"
            className="relative w-full h-full object-cover"
            style={{ borderRadius: '42% 58% 65% 35% / 45% 40% 60% 55%' }}
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-2">Para Meninas</h3>
          <p className="text-sm text-gray-500">
            Participe de oficinas, acompanhe sua trilha de aprendizado e
            conquiste emblemas e certificados.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-2">Para Mentoras</h3>
          <p className="text-sm text-gray-500">
            Conecte-se com suas mentorandas, registre encontros e
            acompanhe o progresso de cada uma delas.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-2">Para Coordenação</h3>
          <p className="text-sm text-gray-500">
            Gerencie mentoras, cadastre atividades e acompanhe
            indicadores de impacto do projeto.
          </p>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
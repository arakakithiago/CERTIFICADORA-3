import heroImg from '../assets/hero.png'
import { useAuth } from '../context/AuthContext'

function Hero() {
  const { usuario } = useAuth()
  const nomeExibido = usuario ? usuario.nome : 'visitante'

  return (
    <div className="relative bg-gradient-to-r from-purple-700 via-fuchsia-600 to-orange-400 rounded-2xl overflow-hidden mb-6 p-8 min-h-[220px]">
      <div className="relative z-10 max-w-sm">
        <h1 className="text-3xl font-bold text-white mb-2">
          Olá, {nomeExibido}! <span>✨</span>
        </h1>
        <p className="text-white/90 font-medium mb-3">Que bom te ver por aqui!</p>
        <p className="text-white/80 text-sm leading-relaxed">
          Sua jornada no Meninas Digitais está apenas começando. Continue explorando, aprendendo e construindo o seu futuro! 💜
        </p>
      </div>

      <div className="absolute -right-4 -bottom-6 w-64 h-64 pointer-events-none">
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
    </div>
  )
}

export default Hero
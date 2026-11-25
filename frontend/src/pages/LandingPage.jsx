
import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import logoMeninas from '../assets/meninas_digitais.jpg'
import iconMeninas from '../assets/icons/05_conquistas.png'
import iconMentoras from '../assets/icons/03_mentoria.png'
import iconCoordenacao from '../assets/icons/03_atividades.png'

const perfis = [
  {
    titulo: 'Para Meninas',
    subtitulo: 'Sua jornada começa aqui',
    texto: 'Inscreva-se em oficinas, acompanhe sua trilha e conquiste emblemas e certificados.',
    icone: iconMeninas,
    fundo: 'bg-pink-50',
    cor: 'text-pink-600',
    detalhe: 'bg-pink-400',
  },
  {
    titulo: 'Para Mentoras',
    subtitulo: 'Compartilhe conhecimento',
    texto: 'Registre presenças e encontros de mentoria e acompanhe o progresso de cada menina.',
    icone: iconMentoras,
    fundo: 'bg-purple-50',
    cor: 'text-purple-700',
    detalhe: 'bg-purple-500',
  },
  {
    titulo: 'Para Coordenação',
    subtitulo: 'Faça acontecer',
    texto: 'Cadastre mentoras e atividades e acompanhe os indicadores de impacto do projeto.',
    icone: iconCoordenacao,
    fundo: 'bg-orange-50',
    cor: 'text-orange-600',
    detalhe: 'bg-orange-400',
  },
]

const passos = [
  {
    numero: '01',
    titulo: 'Cadastre-se',
    texto: 'Crie sua conta e faça parte da comunidade Meninas Digitais.',
    cor: 'from-purple-600 to-purple-800',
  },
  {
    numero: '02',
    titulo: 'Explore',
    texto: 'Descubra oficinas, atividades e minicursos disponíveis.',
    cor: 'from-fuchsia-500 to-pink-600',
  },
  {
    numero: '03',
    titulo: 'Participe',
    texto: 'Aprenda, compartilhe experiências e desenvolva novas habilidades.',
    cor: 'from-pink-500 to-orange-400',
  },
  {
    numero: '04',
    titulo: 'Conquiste',
    texto: 'Desbloqueie emblemas e acompanhe suas conquistas e certificados.',
    cor: 'from-orange-400 to-amber-500',
  },
]

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">

      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoMeninas}
              alt="Meninas Digitais"
              className="w-12 h-12 object-contain"
            />

            <div className="leading-tight">
              <p className="font-extrabold text-sm text-purple-950 tracking-wide">
                MENINAS DIGITAIS
              </p>
              <p className="text-[11px] text-purple-500 font-medium tracking-wider">
                UTFPR - CP
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-5">
            <a
              href="#sobre"
              className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-purple-700 transition"
            >
              Sobre o projeto
            </a>

            <a
              href="#como-funciona"
              className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-purple-700 transition"
            >
              Como funciona
            </a>

            <Link
              to="/login"
              className="text-sm font-bold text-purple-700 px-4 py-2.5 rounded-full hover:bg-purple-50 transition"
            >
              Entrar
            </Link>

            <Link
              to="/cadastro"
              className="text-sm font-bold text-white px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 shadow-md shadow-purple-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Cadastre-se
            </Link>
          </nav>
        </div>
      </header>

      <main>

        <section className="relative bg-gradient-to-br from-[#f7edff] via-[#fff0f7] to-[#fff3e8] overflow-hidden">

          <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-0 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/3 w-32 h-32 border border-purple-300/30 rounded-full" />

          <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-28 grid md:grid-cols-2 gap-14 items-center">

            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 bg-white/80 border border-purple-100 rounded-full px-4 py-2 shadow-sm mb-7">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="text-xs font-bold tracking-wide text-purple-800">
                  PROJETO DE EXTENSÃO · UTFPR-CP
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight text-[#28113d] mb-7">
                O futuro também é
                <span className="block bg-gradient-to-r from-purple-700 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">
                  coisa de menina!
                </span>
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed max-w-xl mb-9">
                Um espaço para descobrir possibilidades, desenvolver habilidades
                e mostrar que a tecnologia também é lugar de menina.
                Vamos transformar ideias em conquistas?
              </p>

              <div className="flex flex-wrap gap-4">

                <Link
                  to="/cadastro"
                  className="inline-flex items-center gap-3 font-bold text-white px-8 py-4 rounded-full bg-gradient-to-r from-purple-700 to-fuchsia-600 shadow-xl shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-1 transition-all"
                >
                  Quero fazer parte
                  <span className="text-xl">→</span>
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center font-bold text-purple-800 px-8 py-4 rounded-full border-2 border-purple-200 bg-white/70 hover:bg-white hover:border-purple-400 transition"
                >
                  Já tenho conta
                </Link>

              </div>

              <div className="flex items-center gap-4 mt-12">
                <img
                  src={logoMeninas}
                  alt=""
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <p className="font-extrabold text-sm text-purple-950">
                    Meninas Digitais
                  </p>
                  <p className="text-xs text-gray-500">
                    Conhecimento que conecta. Tecnologia que transforma.
                  </p>
                </div>
              </div>

            </div>

            <div className="relative max-w-lg mx-auto w-full">

              <div className="absolute inset-4 bg-gradient-to-br from-purple-600 via-fuchsia-500 to-orange-400 rounded-[45%_55%_40%_60%/45%_40%_60%_55%] rotate-6 scale-105" />

              <div className="relative p-3 bg-white/70 backdrop-blur-sm rounded-[42%_58%_43%_57%/45%_42%_58%_55%] shadow-2xl">
                <img
                  src={heroImg}
                  alt="Menina explorando o universo da tecnologia"
                  className="w-full aspect-square object-cover rounded-[42%_58%_43%_57%/45%_42%_58%_55%]"
                />
              </div>

              <div className="absolute -top-5 -right-5 sm:-right-8 bg-white rounded-2xl shadow-xl p-4 rotate-6">
                <span className="text-3xl">💜</span>
              </div>

              <div className="absolute -bottom-5 -left-5 sm:-left-10 bg-white rounded-2xl shadow-xl px-5 py-4 -rotate-3">
                <p className="text-xs text-gray-500 font-semibold">
                  Seu potencial é infinito!
                </p>
                <p className="text-sm font-extrabold text-purple-800">
                  ✨ Crie. Aprenda. Transforme.
                </p>
              </div>

              <div className="absolute top-1/2 -right-8 text-4xl">
                ✦
              </div>

            </div>
          </div>
        </section>

        <section id="sobre" className="relative py-20 px-6">

          <div className="max-w-7xl mx-auto">

            <div className="text-center max-w-2xl mx-auto mb-14">

              <span className="text-xs font-extrabold tracking-[0.25em] text-fuchsia-600 uppercase">
                Nossa comunidade
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#28113d] mt-3 mb-4">
                Um espaço para crescer juntas
              </h2>

              <p className="text-gray-500 leading-relaxed">
                Cada pessoa tem um papel importante nessa jornada.
                Conheça os espaços da nossa plataforma.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

              {perfis.map((perfil) => (
                <div
                  key={perfil.titulo}
                  className={`${perfil.fundo} relative rounded-[28px] p-8 border border-white hover:-translate-y-2 hover:shadow-xl transition-all duration-300 overflow-hidden`}
                >

                  <div className={`absolute -right-10 -top-10 w-32 h-32 ${perfil.detalhe} opacity-10 rounded-full`} />

                  <div className="relative w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-7">
                    <img
                      src={perfil.icone}
                      alt=""
                      className="w-14 h-14 object-contain"
                    />
                  </div>

                  <p className={`text-xs font-extrabold uppercase tracking-wider ${perfil.cor} mb-2`}>
                    {perfil.subtitulo}
                  </p>

                  <h3 className="text-2xl font-black text-[#28113d] mb-3">
                    {perfil.titulo}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-sm">
                    {perfil.texto}
                  </p>

                  <div className={`w-12 h-1 ${perfil.detalhe} rounded-full mt-7`} />

                </div>
              ))}

            </div>
          </div>
        </section>

        <section id="como-funciona" className="relative bg-[#faf7ff] py-20 px-6 overflow-hidden">

          <div className="absolute -left-20 bottom-0 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto">

            <div className="text-center mb-14">
              <span className="text-xs font-extrabold tracking-[0.25em] text-purple-600 uppercase">
                Sua jornada
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#28113d] mt-3 mb-4">
                Sua trilha começa aqui!
              </h2>

              <p className="text-gray-500">
                Quatro passos para transformar curiosidade em conquistas.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {passos.map((passo) => (
                <div
                  key={passo.numero}
                  className="bg-white rounded-3xl p-7 shadow-sm border border-purple-50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${passo.cor} text-white font-black text-xl flex items-center justify-center mb-6 shadow-lg`}>
                    {passo.numero}
                  </div>

                  <h3 className="font-black text-xl text-[#28113d] mb-3">
                    {passo.titulo}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed">
                    {passo.texto}
                  </p>

                </div>
              ))}

            </div>
          </div>
        </section>

        <section className="relative py-20 px-6">

          <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[35px] bg-gradient-to-br from-[#5410a0] via-[#9214bd] to-[#e54a91] px-8 py-16 sm:px-16 text-center text-white">

            <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full border border-white/10" />
            <div className="absolute top-10 right-16 text-4xl opacity-40">✦</div>
            <div className="absolute bottom-10 left-16 text-3xl opacity-40">✧</div>

            <div className="relative z-10">

              <img
                src={logoMeninas}
                alt="Meninas Digitais"
                className="w-20 h-20 object-contain mx-auto mb-6"
              />

              <span className="text-xs font-bold tracking-[0.3em] text-pink-200 uppercase">
                O próximo passo é seu!
              </span>

              <h2 className="text-3xl sm:text-5xl font-black mt-4 mb-5">
                Seu futuro começa com uma oportunidade.
              </h2>

              <p className="text-purple-100 max-w-2xl mx-auto mb-9 leading-relaxed">
                Descubra novos caminhos, conheça pessoas incríveis e
                explore tudo o que o universo da tecnologia tem para oferecer.
              </p>

              <Link
                to="/cadastro"
                className="inline-flex items-center gap-3 bg-white text-purple-800 font-extrabold px-9 py-4 rounded-full shadow-xl hover:bg-pink-50 hover:-translate-y-1 transition-all"
              >
                Começar minha jornada
                <span className="text-xl">→</span>
              </Link>

            </div>
          </div>
        </section>

      </main>

      <footer className="bg-[#241038] text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

            <div className="flex items-center gap-3">
              <img
                src={logoMeninas}
                alt="Meninas Digitais"
                className="w-12 h-12 object-contain"
              />

              <div>
                <p className="font-extrabold tracking-wide">
                  MENINAS DIGITAIS
                </p>
                <p className="text-xs text-purple-300">
                  UTFPR - Cornélio Procópio
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-sm text-purple-200">
                Conhecimento que conecta. Tecnologia que transforma.
              </p>
              <p className="text-xs text-purple-400 mt-2">
                Trilha Digital · Grupo 7
              </p>
            </div>

          </div>

          <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-purple-300">
            Meninas Digitais • UTFPR-CP
          </div>

        </div>
      </footer>

    </div>
  )
}

export default LandingPage

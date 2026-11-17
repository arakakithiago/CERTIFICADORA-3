import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PILARES = [
  {
    titulo: 'Oficinas e minicursos',
    texto: 'Programação, inteligência artificial, design e muito mais, com atividades práticas na UTFPR-CP.',
  },
  {
    titulo: 'Mentoria',
    texto: 'Cada participante é acompanhada por uma mentora, que registra encontros e acompanha seu progresso.',
  },
  {
    titulo: 'Conquistas e certificados',
    texto: 'Presenças rendem pontos e emblemas, e cada atividade concluída gera um certificado em PDF.',
  },
]

// Página pública "Conheça o projeto".
function Sobre() {
  const { usuario } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-4 sm:px-8 py-5 max-w-5xl mx-auto">
        <Link to="/" className="font-bold text-purple-800">
          Meninas Digitais
        </Link>
        <Link to="/" className="text-sm font-semibold text-purple-700 hover:underline">
          {usuario ? '← Voltar ao início' : '← Página inicial'}
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 pb-16">
        <section className="rounded-2xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-orange-400 p-8 sm:p-12 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">Conheça o Meninas Digitais</h1>
          <p className="mt-4 max-w-2xl text-white/90 leading-relaxed">
            O Meninas Digitais UTFPR-CP é um projeto de extensão da Universidade Tecnológica
            Federal do Paraná, campus Cornélio Procópio, que incentiva estudantes do ensino
            fundamental e médio a seguirem carreiras em ciência, tecnologia, engenharia e
            matemática (STEM). 💜
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PILARES.map((p) => (
            <div key={p.titulo} className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-2">{p.titulo}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{p.texto}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900">O Trilha Digital</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            Esta plataforma centraliza o cadastro das atividades e acompanha a jornada individual
            de cada participante: inscrições, presenças, encontros de mentoria, emblemas e
            certificados. Para a coordenação, ela reúne indicadores do impacto do projeto.
          </p>
          {!usuario && (
            <Link
              to="/cadastro"
              className="mt-6 inline-block rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-800"
            >
              Quero participar →
            </Link>
          )}
        </section>
      </main>
    </div>
  )
}

export default Sobre

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RotaProtegida from './components/RotaProtegida'
import SomenteVisitante from './components/SomenteVisitante'
import PaginaInicial from './pages/PaginaInicial'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Sobre from './pages/Sobre'
import Certificados from './pages/Certificados'
import MinhaTrilha from './pages/MinhaTrilha'
import Atividades from './pages/Atividades'
import AtividadeDetalhe from './pages/AtividadeDetalhe'
import Mentorias from './pages/Mentorias'
import Conquistas from './pages/Conquistas'

// Páginas exclusivas da menina (aluna).
const PAGINAS_ALUNA = [
  { caminho: '/minha-trilha', elemento: <MinhaTrilha /> },
  { caminho: '/atividades', elemento: <Atividades /> },
  { caminho: '/atividades/:id', elemento: <AtividadeDetalhe /> },
  { caminho: '/mentorias', elemento: <Mentorias /> },
  { caminho: '/conquistas', elemento: <Conquistas /> },
  { caminho: '/certificados', elemento: <Certificados /> },
]

function PaginaNaoEncontrada() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 p-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Página não encontrada</h1>
      <Link to="/" className="font-semibold text-purple-700 hover:underline">
        Voltar ao início
      </Link>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* "/" mostra a landing page ou o painel do perfil logado. */}
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/login" element={<SomenteVisitante><Login /></SomenteVisitante>} />
          <Route path="/cadastro" element={<SomenteVisitante><Cadastro /></SomenteVisitante>} />
          <Route path="/sobre" element={<Sobre />} />

          {PAGINAS_ALUNA.map(({ caminho, elemento }) => (
            <Route
              key={caminho}
              path={caminho}
              element={<RotaProtegida tiposPermitidos={['menina']}>{elemento}</RotaProtegida>}
            />
          ))}

          <Route path="*" element={<PaginaNaoEncontrada />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

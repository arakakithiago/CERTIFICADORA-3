import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PaginaInicial from './pages/PaginaInicial'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Certificados from './pages/Certificados'
import MinhaTrilha from './pages/MinhaTrilha'
import Atividades from './pages/Atividades'
import Mentorias from './pages/Mentorias'
import Conquistas from './pages/Conquistas'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/minha-trilha" element={<MinhaTrilha />} />
          <Route path="/atividades" element={<Atividades />} />
          <Route path="/mentorias" element={<Mentorias />} />
          <Route path="/conquistas" element={<Conquistas />} />
          <Route path="/certificados" element={<Certificados />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
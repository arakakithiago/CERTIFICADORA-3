import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

// Estrutura comum das páginas da menina: menu lateral + cabeçalho + conteúdo.
function LayoutAluna({ children }) {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar aberta={menuAberto} onFechar={() => setMenuAberto(false)} />
      <main className="flex-1 min-w-0 bg-gray-50 p-4 sm:p-8">
        <Header onAbrirMenu={() => setMenuAberto(true)} />
        {children}
      </main>
    </div>
  )
}

export default LayoutAluna

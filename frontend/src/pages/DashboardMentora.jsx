import LayoutPainel from '../components/painel/LayoutPainel'
import Mentorandas from '../components/painel/Mentorandas'
import PainelPresenca from '../components/painel/PainelPresenca'
import GerenciarOficinas from '../components/painel/GerenciarOficinas'
import { useAuth } from '../context/AuthContext'

function DashboardMentora() {
  const { usuario } = useAuth()

  const abas = [
    { chave: 'mentorandas', rotulo: 'Mentorandas', conteudo: <Mentorandas mentoraId={usuario.id} /> },
    { chave: 'presenca', rotulo: 'Presença', conteudo: <PainelPresenca destacarInstrutoraId={usuario.id} /> },
    { chave: 'atividades', rotulo: 'Minhas atividades', conteudo: <GerenciarOficinas instrutoraId={usuario.id} /> },
  ]

  return <LayoutPainel subtitulo="Painel da Mentora" abas={abas} />
}

export default DashboardMentora

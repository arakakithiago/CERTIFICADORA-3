import LayoutPainel from '../components/painel/LayoutPainel'
import Indicadores from '../components/painel/Indicadores'
import GerenciarOficinas from '../components/painel/GerenciarOficinas'
import PainelPresenca from '../components/painel/PainelPresenca'
import GerenciarMentoras from '../components/painel/GerenciarMentoras'
import ListaAlunas from '../components/painel/ListaAlunas'

const ABAS = [
  { chave: 'indicadores', rotulo: 'Indicadores', conteudo: <Indicadores /> },
  { chave: 'atividades', rotulo: 'Atividades', conteudo: <GerenciarOficinas /> },
  { chave: 'presenca', rotulo: 'Presença', conteudo: <PainelPresenca /> },
  { chave: 'mentoras', rotulo: 'Mentoras', conteudo: <GerenciarMentoras /> },
  { chave: 'alunas', rotulo: 'Alunas', conteudo: <ListaAlunas /> },
]

function DashboardCoordenacao() {
  return <LayoutPainel subtitulo="Painel da Coordenação" abas={ABAS} />
}

export default DashboardCoordenacao

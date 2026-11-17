import imgTecnologia from '../assets/icons/notebook.jpg'
import imgIa from '../assets/icons/IA.jpg'
import imgDesign from '../assets/icons/ideia.jpg'

// Aparência de cada categoria de oficina (mesmos valores do backend).
export const CATEGORIAS = {
  tecnologia: { rotulo: 'TECNOLOGIA', cor: 'bg-pink-100 text-pink-600', imagem: imgTecnologia },
  ia: { rotulo: 'IA & DADOS', cor: 'bg-purple-100 text-purple-600', imagem: imgIa },
  design: { rotulo: 'CRIATIVIDADE', cor: 'bg-orange-100 text-orange-600', imagem: imgDesign },
  outros: { rotulo: 'OUTROS', cor: 'bg-gray-100 text-gray-600', imagem: imgTecnologia },
}

export function categoria(chave) {
  return CATEGORIAS[chave] || CATEGORIAS.outros
}

// "12 de out"
export function formatarDataCurta(data) {
  return new Date(data)
    .toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
    .replace('.', '')
}

// "12 de outubro de 2026"
export function formatarDataLonga(data) {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// "14h" ou "14h30"
export function formatarHora(data) {
  const d = new Date(data)
  const minutos = d.getMinutes()
  return `${d.getHours()}h${minutos ? String(minutos).padStart(2, '0') : ''}`
}

export function jaAconteceu(data) {
  return new Date(data) < new Date()
}

// A presença só pode ser registrada a partir do dia da atividade.
export function podeRegistrarPresenca(data) {
  const fimDeHoje = new Date()
  fimDeHoje.setHours(23, 59, 59, 999)
  return new Date(data) <= fimDeHoje
}

const doisDigitos = (n) => String(n).padStart(2, '0')

// ISO -> valor de <input type="datetime-local"> no fuso do navegador.
export function paraInputDataHora(data) {
  const d = new Date(data)
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}T${doisDigitos(
    d.getHours()
  )}:${doisDigitos(d.getMinutes())}`
}

// Valor de <input type="datetime-local"> -> ISO com fuso (para a API).
export function deInputDataHora(valor) {
  return new Date(valor).toISOString()
}

// Hoje no formato de <input type="date">.
export function hojeParaInput() {
  const d = new Date()
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`
}

// Datas "YYYY-MM-DD" (sem hora) viram meia-noite local, não UTC.
export function formatarDiaLongo(dia) {
  const texto = String(dia).slice(0, 10)
  const [ano, mes, d] = texto.split('-').map(Number)
  return formatarDataLonga(new Date(ano, mes - 1, d))
}

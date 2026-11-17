// Caixa branca padrão dos painéis.
function Cartao({ titulo, acoes, children, className = '' }) {
  return (
    <section className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      {(titulo || acoes) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          {titulo && <h2 className="text-lg font-bold text-gray-900">{titulo}</h2>}
          {acoes}
        </div>
      )}
      {children}
    </section>
  )
}

// Estilos de formulário reutilizados nos painéis.
export const estiloInput =
  'w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500'
export const estiloRotulo = 'block text-sm font-semibold text-gray-700 mb-1'
export const estiloBotao =
  'bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed'
export const estiloBotaoSecundario =
  'bg-gray-100 text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-200 transition'

export function Mensagem({ tipo = 'erro', children }) {
  if (!children) return null
  const cor = tipo === 'sucesso' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
  return (
    <p role={tipo === 'erro' ? 'alert' : 'status'} className={`text-sm rounded-lg px-4 py-2 mb-4 ${cor}`}>
      {children}
    </p>
  )
}

export default Cartao

// Mostra "carregando", erro ou lista vazia; caso contrário, renderiza children.
function EstadoCarregamento({ carregando, erro, vazio, mensagemVazio, children }) {
  if (carregando) {
    return <p className="text-sm text-gray-400 py-6 text-center">Carregando...</p>
  }
  if (erro) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {erro}
      </p>
    )
  }
  if (vazio) {
    return (
      <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
        {mensagemVazio}
      </p>
    )
  }
  return children
}

export default EstadoCarregamento

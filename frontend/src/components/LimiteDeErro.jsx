import { Component } from 'react'

// Se algum componente quebrar durante o render, mostra uma mensagem em vez de
// deixar a tela inteira em branco. (Precisa ser um componente de classe.)
class LimiteDeErro extends Component {
  constructor(props) {
    super(props)
    this.state = { erro: null }
  }

  static getDerivedStateFromError(erro) {
    return { erro }
  }

  componentDidCatch(erro, info) {
    console.error('Erro na interface:', erro, info.componentStack)
  }

  render() {
    if (!this.state.erro) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">Algo deu errado nesta tela 😕</h1>
          <p className="mt-2 text-sm text-gray-500">
            Tente recarregar. Se continuar, confira se o backend está rodando e atualizado
            (<code>npm start</code> na pasta backend).
          </p>
          <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 break-words">
            {String(this.state.erro.message || this.state.erro)}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-800"
            >
              Recarregar
            </button>
            <a
              href="/"
              className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              Ir para o início
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default LimiteDeErro

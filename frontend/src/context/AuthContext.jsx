import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { validarSessao } from '../services/api'

const AuthContext = createContext()

// Lê o usuário salvo já no primeiro render, para que a proteção de rotas não
// redirecione para o login ao recarregar a página.
function lerUsuarioSalvo() {
  try {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  } catch {
    return null
  }
}

function salvarUsuario(usuario) {
  try {
    if (usuario) localStorage.setItem('usuario', JSON.stringify(usuario))
    else localStorage.removeItem('usuario')
  } catch {
    // Sem localStorage (ex.: modo privado): a sessão dura até fechar a aba.
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuarioSalvo)
  // Motivo do último logout automático (mostrado na tela de login).
  const [avisoSessao, setAvisoSessao] = useState('')

  // Mantém o localStorage sempre igual ao estado.
  useEffect(() => {
    salvarUsuario(usuario)
  }, [usuario])

  const login = useCallback((dadosUsuario) => {
    setUsuario(dadosUsuario)
    setAvisoSessao('')
  }, [])

  // `motivo` só é aceito como texto: assim `onClick={logout}` não guarda o
  // evento do clique como mensagem.
  const logout = useCallback((motivo) => {
    setUsuario(null)
    setAvisoSessao(typeof motivo === 'string' ? motivo : '')
  }, [])

  // Confere com o servidor se a conta ainda existe e está ativa: ao abrir o
  // site, após o login e sempre que a aba volta a ficar em foco.
  const id = usuario?.id
  useEffect(() => {
    if (!id) return

    let ativo = true
    function conferir() {
      validarSessao(id)
        .then((atual) => {
          if (!ativo) return
          // Atualiza nome/e-mail/tipo se mudaram no servidor.
          setUsuario((anterior) => {
            if (!anterior || anterior.id !== atual.id) return anterior
            const mudou = ['nome', 'email', 'tipo'].some((c) => anterior[c] !== atual[c])
            return mudou ? atual : anterior
          })
        })
        .catch((erro) => {
          // 403/404: conta desativada ou apagada. Sem status (servidor fora
          // do ar, por exemplo) a sessão é mantida.
          if (ativo && (erro.status === 403 || erro.status === 404)) {
            logout(erro.message)
          }
        })
    }

    function aoVoltarParaAba() {
      if (document.visibilityState === 'visible') conferir()
    }

    conferir()
    window.addEventListener('focus', conferir)
    document.addEventListener('visibilitychange', aoVoltarParaAba)
    return () => {
      ativo = false
      window.removeEventListener('focus', conferir)
      document.removeEventListener('visibilitychange', aoVoltarParaAba)
    }
  }, [id, logout])

  return (
    <AuthContext.Provider value={{ usuario, login, logout, avisoSessao }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}

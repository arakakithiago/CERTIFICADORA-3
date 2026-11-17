import { useCallback, useEffect, useRef, useState } from 'react'

// Executa `buscar()` ao montar (e quando os valores de `deps` mudam) e expõe
// o estado. `recarregar()` busca de novo sem mostrar o "Carregando..." outra vez.
export function useCarregar(buscar, deps = []) {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  // Guarda sempre a versão mais recente de `buscar` sem disparar novas buscas.
  const buscarRef = useRef(buscar)
  useEffect(() => {
    buscarRef.current = buscar
  })

  // Nova busca só quando algum valor de `deps` muda.
  const chave = JSON.stringify(deps)

  useEffect(() => {
    let ativo = true
    buscarRef
      .current()
      .then((resultado) => {
        if (!ativo) return
        setDados(resultado)
        setErro('')
      })
      .catch((err) => ativo && setErro(err.message))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [chave])

  const recarregar = useCallback(async () => {
    try {
      setDados(await buscarRef.current())
      setErro('')
    } catch (err) {
      setErro(err.message)
    }
  }, [])

  return { dados, erro, carregando, recarregar }
}

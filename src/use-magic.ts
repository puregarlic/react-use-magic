import { useContext } from 'react'

import { MagicContext } from './provider'

export function useMagic() {
  const contextValues = useContext(MagicContext)

  return contextValues
}

import React, {
  useMemo,
  useCallback,
  createContext,
  PropsWithChildren,
  useEffect,
  useReducer,
  useState
} from 'react'
import { Magic } from 'magic-sdk'

import { magicReducer } from './reducer'
import {
  MagicContextValues,
  MagicProviderProps,
  AuthenticationStatus
} from './types'

const defaultContextValues = {
  login: async () => {},
  logout: async () => {},
  status: 'pending' as AuthenticationStatus,
  didToken: null,
  metadata: { issuer: null, email: null, publicAddress: null },
  error: null,
  magic: undefined
}

export const MagicContext = createContext<MagicContextValues>(
  defaultContextValues
)

export function MagicProvider(props: PropsWithChildren<MagicProviderProps>) {
  const magic = useMemo(() => new Magic(props.apiKey), [props.apiKey])
  const [contextValues, setContextValues] = useState<MagicContextValues>(
    defaultContextValues
  )
  const [state, dispatch] = useReducer(magicReducer, {
    didToken: null,
    metadata: null,
    error: null,
    status: 'pending'
  })

  useEffect(() => {
    dispatch({ type: 'start' })
    async function checkAuthenticationStatus() {
      try {
        const isLoggedIn = await magic.user.isLoggedIn()
        if (isLoggedIn) {
          let [meta, token] = await Promise.all([
            magic.user.getMetadata(),
            magic.user.getIdToken()
          ])
          if (!token) token = await magic.user.generateIdToken()
          dispatch({ type: 'set-session', token, meta })
        } else {
          dispatch({ type: 'remove-session' })
        }
      } catch (error) {
        dispatch({ type: 'error', error })
      }
    }

    checkAuthenticationStatus()
  }, [magic])

  const login = useCallback(
    async (options: { email: string; showUI?: boolean }) => {
      dispatch({ type: 'start' })
      try {
        const token = await magic.auth.loginWithMagicLink(options)
        const meta = await magic.user.getMetadata()
        dispatch({ type: 'set-session', token, meta })
      } catch (error) {
        dispatch({ type: 'error', error })
      }
    },
    [magic]
  )

  const logout = useCallback(async () => {
    dispatch({ type: 'start' })
    try {
      await magic.user.logout()
      dispatch({ type: 'remove-session' })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }, [magic])

  // Context consumer rerender fix
  // https://reactjs.org/docs/context.html#caveats
  useEffect(() => {
    setContextValues(contextValues => ({
      ...contextValues,
      ...state,
      login,
      logout,
      magic
    }))
  }, [state, login, logout, magic])

  return (
    <MagicContext.Provider value={contextValues}>
      {props.children}
    </MagicContext.Provider>
  )
}

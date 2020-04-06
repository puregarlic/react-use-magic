import { State, Action } from './types'

export function magicReducer(state: State, action: Action): State {
  console.log(action)
  switch (action.type) {
    case 'start':
      return {
        didToken: null,
        metadata: null,
        error: null,
        status: 'pending'
      }
    case 'set-session':
      return {
        didToken: action.token,
        metadata: action.meta,
        error: null,
        status: 'authenticated'
      }
    case 'remove-session':
      return {
        didToken: null,
        metadata: null,
        error: null,
        status: 'unauthenticated'
      }
    case 'error':
      return {
        didToken: null,
        metadata: null,
        error: action.error,
        status: 'errored'
      }
    default:
      return state
  }
}

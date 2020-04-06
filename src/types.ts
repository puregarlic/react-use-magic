import { Magic, ErrorCode } from 'magic-sdk'

// Decentralized ID token
type DIDToken = string

export interface MagicProviderProps {
  apiKey: string
}

export interface UserMetadata {
  issuer: string | null
  email: string | null
  publicAddress: string | null
}

export type AuthenticationStatus =
  | 'unauthenticated'
  | 'authenticated'
  | 'pending'
  | 'errored'

export interface MagicContextValues {
  login: (options: { email: string; showUI?: boolean }) => Promise<void>
  logout: () => Promise<void>
  status: AuthenticationStatus
  didToken: DIDToken | null
  metadata: UserMetadata | null
  error: ErrorCode | null
  magic?: Magic
}

export interface State {
  didToken: DIDToken | null
  metadata: UserMetadata | null
  error: ErrorCode | null
  status: AuthenticationStatus
}

export type Action =
  | { type: 'start' }
  | { type: 'set-session'; token: DIDToken | null; meta: UserMetadata | null }
  | { type: 'remove-session' }
  | { type: 'error'; error: ErrorCode }

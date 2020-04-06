import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { MagicProvider, useMagic } from '../.'

function DemoComponent() {
  const [email, setEmail] = React.useState('')
  const { status, login, logout, error } = useMagic()

  if (status === 'pending') {
    return <p>Waiting for authentication</p>
  }

  if (status === 'errored') {
    return (
      <div>
        <p>Uh oh, an error occurred</p>
        <p>{JSON.stringify(error)}</p>
      </div>
    )
  }

  if (status === 'authenticated') {
    return (
      <div>
        <p>Surprise!</p>
        <button onClick={logout}>Log Out</button>
      </div>
    )
  }

  return (
    <div>
      <p>If you sign in, I'll show you a surprise.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          login({ email })
        }}
      >
        <input
          required
          type="text"
          placeholder="example@example.com"
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <button>Log In</button>
      </form>
    </div>
  )
}

function App() {
  return (
    <MagicProvider apiKey={process.env.MAGIC_PUBLIC_KEY || ''}>
      <DemoComponent />
    </MagicProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

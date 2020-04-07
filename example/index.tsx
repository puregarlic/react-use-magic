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
      <>
        <p>Uh oh, an error occurred</p>
        <p>{JSON.stringify(error)}</p>
      </>
    )
  }

  if (status === 'authenticated') {
    return (
      <>
        <p>Surprise!</p>
        <section>
          <button onClick={logout}>Log Out</button>
        </section>
      </>
    )
  }

  return (
    <>
      <p>If you log in, I'll show you a surprise.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          login({ email })
        }}
      >
        <label htmlFor="email">Email</label>
        <section>
          <input
            required
            type="text"
            name="email"
            placeholder="example@example.com"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <button>Log In</button>
        </section>
      </form>
    </>
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

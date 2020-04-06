# react-use-magic

A React hook that makes it easier than ever to implement passwordless login. It allows you to quickly and simply implement the [Magic](https://magic.link/) SDK.

This hook should work on the server side as well, but it hasn't been tested yet.

## Usage

First, wrap your top-level component in the `MagicProvider`

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { MagicProvider } from 'react-use-magic'

import App from './App'

ReactDOM.render(
  <MagicProvider apiKey={process.env.MAGIC_PUBLIC_KEY}>
    <App />
  </MagicProvider>,
  document.getElementById('root')
)
```

Then, you can use the `useMagic` hook anywhere you want further down the tree.

```js
import React, { useState } from 'react'
import { useMagic } from 'react-use-magic'

export function MyComponent() {
  const [email, setEmail] = useState('')
  const { status, metadata, didToken, error, login, logout } = useMagic()

  function onSubmit(e) {
    e.preventDefault()
    login({ email })
  }

  if (status === 'pending') {
    return <p>Waiting for authentication...</p>
  }

  if (status === 'errored') {
    return <p>An error occurred while trying to authenticate you.</p>
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
      <p>Sign in for a surprise:</p>
      <form onSubmit={onSubmit}>
        <input
          required
          type="email"
          value={email}
          placeholder="example@example.com"
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <button>Log In</button>
      </form>
    </div>
  )
}
```

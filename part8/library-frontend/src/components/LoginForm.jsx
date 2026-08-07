import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN, ME, ALL_BOOKS } from '../queries'

const LoginForm = ({ show, setError, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const variables = {
    authorToSearch: null,
    genreToSearch: null
  }
  const [ login ] = useMutation(LOGIN, {
    refetchQueries: [{ query: ME }, { query: ALL_BOOKS, variables }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('phonebook-user-token', token)
      setError(null)
      setPage('authors')
    },
    onError: (error) => {
      console.error('Login failed:', error)
      setError('login failed')
    }
  })

  if (!show) {
    return null
  }
  const submit = async (event) => {
    event.preventDefault()
    try {
      await login({ variables: { username, password } })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="username">username</label>
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            id="password"
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm

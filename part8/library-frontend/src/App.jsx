import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { useApolloClient, useQuery } from '@apollo/client/react'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('phonebook-user-token'))
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    if (!errorMessage) {
      return undefined
    }

    const timeoutId = setTimeout(() => {
      setErrorMessage(null)
    }, 5000)

    return () => clearTimeout(timeoutId)
  }, [errorMessage])

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }


  return (
    <div>
      {errorMessage && <div role="alert">{errorMessage}</div>}
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && (
          <button onClick={() => setPage('add')}>add book</button>
        )}
        {!token && (
          <button onClick={() => setPage('login')}>login</button>
        )}
          {token && (
            <button onClick={() => setPage('recommend')}>recommend</button>
          )}
        {token && (
          <button onClick={onLogout}>logout</button>
        )}
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} apolloClient={client} />

      <NewBook show={page === 'add'} />

      <LoginForm show={page === 'login'} setToken={setToken} setError={setErrorMessage} setPage={setPage} />
      <Recommend show={page === 'recommend'} />
    </div>
  )
}

export default App

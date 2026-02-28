import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import AnecdoteList from './components/AnecdoteList'
import NotifContext from './NotifContext'
import { useReducer } from 'react'


import { useAnecdotes, useCreateAnecdote, useUpdateAnecdote } from './queries'

const notifReducer = (state, action) => {
  const content = action.payload.content
  switch (action.type) {
    case 'VOTE': {
      return `anecdote '${content}' voted`
    }
    case 'RESET': {
      return content
    }
    case 'NEW_ANEC': {
      return `anecdote '${content}' created`
    }
    case 'SERVER_ERR': {
      return content
    }
    default: {
      console.log('default case reached')
      return 'default'
    }
  }
}

const App = () => {
  const result = useAnecdotes()
  const newAnecdoteMutation = useCreateAnecdote()
  const updateAnecdoteMutation = useUpdateAnecdote()

  const [notif, notifDispatch] = useReducer(notifReducer, '')
  console.log(JSON.parse(JSON.stringify(result)))
 
  if (result.isLoading) {
    return <div>loading data...</div>
  }
  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <NotifContext.Provider value={{ notif, notifDispatch }}>
      <div>
        <h3>Anecdote app</h3>

        {notif && <Notification />}
        <AnecdoteForm newAnecdoteMutation={newAnecdoteMutation}/>
        <AnecdoteList anecdotes={anecdotes} updateAnecdoteMutation={updateAnecdoteMutation} />
      </div>
    </NotifContext.Provider>
  )
}

export default App

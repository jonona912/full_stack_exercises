import { useContext } from 'react'
import NotifContext from '../NotifContext'

const AnecdoteForm = ({ newAnecdoteMutation }) => {
  const { notifDispatch } = useContext(NotifContext)

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    const anecObj = { content, votes: 0 }
    event.target.anecdote.value = ''
    console.log('new anecdote', content)
    newAnecdoteMutation.mutate(anecObj, {
      onSuccess: () => {
        notifDispatch({type: 'NEW_ANEC', payload: anecObj})
      },
      onError: (err) => {
        console.log('error creating anecdote', err)
        notifDispatch({type: 'SERVER_ERR', payload: {content: 'too short anecdote, must have length 5 or more'}})
      }
    })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

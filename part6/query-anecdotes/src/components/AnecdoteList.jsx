import { useContext } from 'react'
import NotifContext from '../NotifContext'

const AnecdoteList = ({ anecdotes, updateAnecdoteMutation }) => {
  const { notifDispatch } = useContext(NotifContext)

  const onVote = (anecdote) => {
    console.log('vote', anecdote.id)
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    notifDispatch({type: 'VOTE', payload: anecdote})
    setTimeout(() => 
      notifDispatch({type: 'RESET', payload: ''}), 5000
    )
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => onVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList

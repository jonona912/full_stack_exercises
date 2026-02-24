import { useDispatch, useSelector } from "react-redux"
import { voteApi } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if (state.filter !== '') {
      const filterLower = state.filter.toLowerCase()
      const filtered = state.anecdotes.filter(anecdote => 
        anecdote.content.toLowerCase().includes(filterLower)
      )
      return filtered
    }
    return state.anecdotes
  })

  // console.log('anecdotes', anecdotes)
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
  const dispatch = useDispatch()

  const vote = id => {
    dispatch(voteApi(id))
    dispatch(showNotification(`you voted '${anecdotes.find(a => a.id === id)?.content}'`, 5))
  }

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
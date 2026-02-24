import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'


import { useDispatch } from "react-redux"
// import { setAnecdotes } from './reducers/anecdoteReducer'
import { useEffect } from 'react'
// import anecdotesApi from './services/anecdotesApi'
import { initAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // anecdotesApi.getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))
    dispatch(initAnecdotes())
  }, [dispatch])

  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App


// fetch
// update state
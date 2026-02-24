import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteReducer = createSlice({
  name: 'anecdotes',
  initialState: anecdotesAtStart.map(asObject),
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      anecdoteToChange.votes += 1
    },
    createAnecdote(state, action) {
      const newAnecdote = {
        content: action.payload,
        id: getId(),
        votes: 0
      }
      state.push(newAnecdote)
      
    }
  }
})

export const { voteAnecdote, createAnecdote } = anecdoteReducer.actions
export default anecdoteReducer.reducer

// const initialState = anecdotesAtStart.map(asObject)

// export const createAnecdote = content => {
//   return {
//     type: 'ADD_ANECDOTE',
//     content
//   }
// }

// export const voteAnecdote = id => {
//   return {
//     type: 'VOTE',
//     id
//   }
// }

// const reducer = (state = initialState, action) => {
//   // console.log('state now: ', state)
//   // console.log('action', action)

//   switch (action.type) {
//     case 'VOTE': {
//       const id = action.id
//       const anecdoteToChange = state.find(a => a.id === id)
//       const changedAnecdote = {
//         ...anecdoteToChange,
//         votes: anecdoteToChange.votes + 1
//       }
//       return state.map(anecdote =>
//         anecdote.id !== id ? anecdote : changedAnecdote
//       )
//     }
//     case 'ADD_ANECDOTE': {
//       const newAnecdote = {
//         content: action.content,
//         id: getId(),
//         votes: 0
//       }
//       return [...state, newAnecdote]
//     }
//     default: {
//       return state  
//     }
//   }
// }

// export default reducer

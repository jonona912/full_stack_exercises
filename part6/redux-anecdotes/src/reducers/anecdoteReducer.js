import { createSlice } from '@reduxjs/toolkit'
import anecdotesApi from '../services/anecdotesApi'

const anecdoteReducer = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload.id
      return state.map(anecdote => id !== anecdote.id ? anecdote : action.payload)
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const { setAnecdotes, createAnecdote, voteAnecdote } = anecdoteReducer.actions

export const initAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesApi.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdotesApi.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const voteApi = (id) => {
  return async (dispatch, getState) => {
    const anecdotes = getState().anecdotes
    const anecdoteToVote = anecdotes.find(a => a.id === id)
    
    // Update via API
    const updatedAnecdote = await anecdotesApi.update({
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1
    })
    dispatch(voteAnecdote(updatedAnecdote))
  }
}

// export const { voteAnecdote } = anecdoteReducer.actions
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

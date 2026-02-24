import { createSlice } from '@reduxjs/toolkit'

const filterAnecReducer = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter(state, action) {
      return action.payload
    }
  }
})

export const { setFilter } = filterAnecReducer.actions
export default filterAnecReducer.reducer


// export const filterAnecdotes = (filter) => {
//   console.log('content to Filter', filter)
//   return {
//     type: 'SET_FILTER',
//     content: filter
//   }
// }

// const filterAnecReducer = (state = '', action) => {
//   console.log('filterAnecReducer reached: ', action)
//   // return state
//   switch (action.type) {
//     case 'SET_FILTER':
//       return action.content // filter phrase
//     default:
//       return state
//   }
// }

// export default filterAnecReducer

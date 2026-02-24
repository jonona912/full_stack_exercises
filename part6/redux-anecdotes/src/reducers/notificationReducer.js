import { createSlice } from '@reduxjs/toolkit'

const notificationReducer = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    }
  }
})

const { setNotification } = notificationReducer.actions

export const showNotification = (message, time) => {
  return async (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(setNotification(''))
    }, time * 1000)
  }
}

export default notificationReducer.reducer

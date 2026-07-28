export const getUser = () => {
  const storedUser = window.localStorage.getItem('user')
  return storedUser ? JSON.parse(storedUser) : null
}

export const saveUser = (user) => {
  window.localStorage.setItem('user', JSON.stringify(user))
}

export const removeUser = () => {
  window.localStorage.removeItem('user')
}

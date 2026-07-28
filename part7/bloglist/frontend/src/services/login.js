import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const register = async (userObject) => {
  const response = await axios.post('/api/users', userObject)
  return response.data
}

export default { login, register }

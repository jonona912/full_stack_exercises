import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  try {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    }
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
  } catch (error) {
    console.error('Error creating blog:', error.response?.statusText || error.message)
    return null
  }
}

export default { getAll, create }

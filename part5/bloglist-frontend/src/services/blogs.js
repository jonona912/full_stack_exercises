import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  console.log('Fetched blogs:', response.data)
  return response.data
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

const update = async (id, increaseLike) => {
  try {
    const user = JSON.parse(window.localStorage.getItem('user'))
    console.log('User from localStorage:', user)
    console.log('Token being sent:', user?.token)

    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    }
    console.log('Request headers:', config.headers)
    increaseLike.likes += 1
    const response = await axios.put(`${baseUrl}/${id}`, increaseLike, config)
    return response.data
  } catch (error) {
    console.error('Error updating blog:', error.response?.statusText || error.message)
    return null
  }
}

const remove = async (id) => {
  console.log('inside remove function with id:', id)
  try {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    }
    await axios.delete(`${baseUrl}/${id}`, config)
  } catch (error) {
    console.error('Error deleting blog:', error.response?.statusText || error.message)
  }
}

export default { getAll, create, update, remove }
import axios from 'axios'
import { getUser } from './persistentUser'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  try {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    }
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
  } catch (error) {
    console.error(
      'Error creating blog:',
      error.response?.statusText || error.message,
    )
    return null
  }
}

const update = async (id, blogObject) => {
  try {
    const user = JSON.parse(window.localStorage.getItem('user'))

    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    }
    blogObject.likes += 1
    const response = await axios.put(`${baseUrl}/${id}`, blogObject, config)
    return response.data
  } catch (error) {
    console.error(
      'Error updating blog:',
      error.response?.statusText || error.message,
    )
    return null
  }
}

const remove = async (id) => {
  try {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    }
    await axios.delete(`${baseUrl}/${id}`, config)
  } catch (error) {
    console.error(
      'Error deleting blog:',
      error.response?.statusText || error.message,
    )
  }
}

const addComment = async (id, comment) => {
  try {
    const user = getUser()
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    }
    const response = await axios.post(
      `${baseUrl}/${id}/comments`,
      { comment },
      config
    )
    console.log('Comment added:', response.data)
    return response.data
  } catch (error) {
    console.error(
      'Error adding comment:',
      error.response?.statusText || error.message,
    )
    return null
  }
}

export default { getAll, create, update, remove, addComment }

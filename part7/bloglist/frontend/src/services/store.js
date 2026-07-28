import { create } from 'zustand'
import blogService from './blogs'
import { getUser, saveUser, removeUser } from './persistentUser'
import loginService from './login'
import { getAllUsers } from './users'

export const useUserStore = create((set, get) => ({
  username: '',
  setUsername: (username) => set({ username }),
  password: '',
  setPassword: (password) => set({ password }),
  user: getUser(),
  setUser: (user) => {
    saveUser(user)
    set({ user })
  },
  userLogin: async () => {
    try {
      const { username, password } = get()
      const user = await loginService.login({ username, password })
      saveUser(user)
      set({ user, username: '', password: '' })
      return true
    } catch (error) {
      console.error('Login failed:', error)
      alert('Wrong username or password')
      return false
    }
  },
  userLogout: () => {
    removeUser()
    set({ user: null })
  },
  createUser: async (userObject) => {
    try {
      const newUser = await loginService.register(userObject)
      return newUser
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user: ' + error.response.data.error)
      return null
    }
  }
}),
)

export const useNotificationStore = create((set) => ({
  notification: null,
  setNotification: (notification) => set({ notification }),
}))

export const useBlogsStore = create((set) => ({
  blogs: [],
  setBlogs: (blogs) => set({ blogs }),
  fetchBlogs: async () => {
    try {
      const blogs = await blogService.getAll()
      set({ blogs })
    } catch (error) {
      console.error('Error fetching blogs:', error)
      set({ blogs: [] })
    }
  },
  deleteBlog: async (blogObject) => {
    if (window.confirm(`Remove blog "${blogObject.title}" by ${blogObject.author}?`)) {
      try {
        await blogService.remove(blogObject.id)
        set(state => ({ blogs: state.blogs.filter(blog => blog.id !== blogObject.id) }))
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  },
  handleBlogUpdate: async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject.id, blogObject)
      set(state => ({
        blogs: state.blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
      }))
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  },
  handleNewBlog: async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      if (!returnedBlog) {
        useNotificationStore.getState().setNotification({
          message: 'Error creating blog',
          type: 'error',
        })
        return
      }

      set(state => ({ blogs: state.blogs.concat(returnedBlog) }))
      useNotificationStore.getState().setNotification({
        message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
        type: 'success',
      })

      setTimeout(() => {
        useNotificationStore.getState().setNotification(null)
      }, 5000)
    } catch (error) {
      console.error('Error creating blog:', error)
      useNotificationStore.getState().setNotification({
        message: 'Error creating blog',
        type: 'error',
      })
    }
  },
}))

export const useUsersInfoStore = create((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  fetchUsers: async () => {
    try {
      const users = await getAllUsers()
      set({ users })
    } catch (error) {
      console.error('Error fetching users:', error)
      set({ users: [] })
    }
  },
}))

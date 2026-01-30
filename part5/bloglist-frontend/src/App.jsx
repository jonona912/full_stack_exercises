import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login'
import UserLgnInfo from './components/UserLgnInfo'
import CreateBlog from './components/CreateBlog'
import ShowNotification from './components/ShowNotification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLogin = async (credentials) => {
    try {
      console.log('Logging in with', credentials)
      const user = await loginService.login(credentials)
      // Store the user/token, update state, etc.
      console.log('Login successful:', user)
      window.localStorage.setItem('user', JSON.stringify(user))
      // Clear the form
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      // Handle the error - show a message to the user
      console.error('Login failed:', error)
      alert('Wrong username or password')
    }
  }

  const handleLogout = () => {
    console.log('Logging out user', window.localStorage.getItem('user'))
    window.localStorage.removeItem('user')
    setUser(null)
  }

  const handleNewBlog = async (blogObject) => {
    console.log('New blog to be added:', blogObject)
    const returnedBlog = await blogService.create(blogObject)
    if (!returnedBlog) {
      setNotification({ message: 'Error creating blog', color: 'red' })
    } else {
      setBlogs(blogs.concat(returnedBlog))
      setNotification({ message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`, color: 'green' })
    }
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <div>
      {user === null ? (
        <Login 
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <>
          <h2>blogs</h2>
          <ShowNotification notification={notification} />
          <UserLgnInfo user={user} onLogout={handleLogout} />
          <CreateBlog handleNewBlog={handleNewBlog} />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </>
      )}
    </div>
  )
}

export default App

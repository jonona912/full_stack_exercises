import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login'
import UserLgnInfo from './components/UserLgnInfo'
import CreateBlog from './components/CreateBlog'
import ShowNotification from './components/ShowNotification'
import Togglable from './components/Toggleable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : null)
  const [notification, setNotification] = useState(null)

  const togglableRef = useRef()
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
    const returnedBlog = await blogService.create(blogObject)
    if (!returnedBlog) {
      setNotification({ message: 'Error creating blog', color: 'red' })
    } else {
      setBlogs(blogs.concat(returnedBlog))
      blogs.map(b => console.log('Existing blog:', b))
      setNotification({ message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`, color: 'green' })
      togglableRef.current.hide() // Hide the form after successful creation
    }
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const deleteBlog = async (blogObject) => {
    console.log('Attempting to delete blog:', blogObject)
    if (window.confirm(`Remove blog "${blogObject.title}" by ${blogObject.author}?`)) {
      console.log('User confirmed deletion of blog:', blogObject)
      await blogService.remove(blogObject.id)
      setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
    }
  }

  const handleBlogLike = async (blogObject) => {
    const updatedBlog = await blogService.update(blogObject.id, blogObject)
    setBlogs(blogs.map(blog => blog.id !== blogObject.id ? blog : updatedBlog))
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
          <Togglable buttonLabel="new blog" ref={togglableRef}>
            <CreateBlog handleNewBlog={handleNewBlog} />
          </Togglable>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} onLike={handleBlogLike} onDelete={deleteBlog} />
            )}
        </>
      )}
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </>
      )}
    </div>
  )
}

export default App
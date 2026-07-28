import { useEffect } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import CreateBlog from './components/CreateBlog'
import ShowNotification from './components/ShowNotification'
import BlogsList from './components/BlogsList'
import UsersInfo from './components/UsersInfo'
import NavBar from './components/NavBar'
import { useUserStore, useBlogsStore } from './services/store'
import { useUsersInfoStore } from './services/store'
import UserBlogs from './components/UserBlogs'
import { useMatch } from 'react-router-dom'
import Register from './components/Register'

const App = () => {
  const { user } = useUserStore()
  const { users, fetchUsers } = useUsersInfoStore()
  const { blogs, fetchBlogs } = useBlogsStore()
  const match = useMatch('/users/:userId')

  useEffect(() => {
    fetchBlogs()
    fetchUsers()
  }, [fetchBlogs, fetchUsers])

  const userMatch = match ? users.find(u => u.id === match.params.userId) : null
  const userBlogs = userMatch ? blogs.filter(blog => blog.user && blog.user.id === userMatch.id) : []



  const loginView = () => (
    <Login />
  )

  const createBlogView = () => (
    <>
      <ShowNotification />
      <NavBar />
      <CreateBlog />
    </>
  )

  const blogsListView = () => (
    <>
      <ShowNotification />
      <NavBar />
      <BlogsList />
    </>
  )

  const pageNotFoundView = () => (
    <div>
      <h2>404 - Page not found</h2>
    </div>
  )

  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/blogsList" replace /> : loginView()}
        />
        <Route
          path="/createblog"
          element={user ? createBlogView() : <Navigate to="/login" replace />}
        />
        <Route
          path="/blogslist"
          element={user ? blogsListView() : <Navigate to="/login" replace />}
        />
        <Route
          path="/users"
          element={user ? <UsersInfo /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/users/:userId"
          element={user ? <UserBlogs user={userMatch} blogs={userBlogs} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={pageNotFoundView()} />
      </Routes>
    </div>
  )
}

export default App

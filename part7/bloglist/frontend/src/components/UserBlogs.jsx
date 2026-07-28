import NavBar from './NavBar'

const UserBlogs = ({ user, blogs }) => {

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div>
      <NavBar />
      <h2>{user.name}</h2>
      <h3>Blogs</h3>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserBlogs

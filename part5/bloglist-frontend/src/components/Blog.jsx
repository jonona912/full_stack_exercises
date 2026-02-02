import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete }) => {
  const [visible, setVisible] = useState(false)
  const user = JSON.parse(window.localStorage.getItem('user'))

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const deleteStyle = {
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer'
  }

  return (
    <div style={blogStyle}>
      {blog.title} by {blog.author}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && (
        <div>
          <div>url: {blog.url}</div>
          <div>likes: {blog.likes} <button onClick={() => onLike(blog)}>like</button></div>
          <div>user: {blog.user?.username}</div>
          {user && blog.user && user.username === blog.user.username && (
            <button style={deleteStyle} onClick={() => onDelete(blog)}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog

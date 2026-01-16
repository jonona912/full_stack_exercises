const Lodash = require('lodash') // manipulating arrays, objects, and strings.

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  // how thread works e.g.
  // Math.max(...[5, 10, 3])  // Same as Math.max(5, 10, 3) → Returns 10
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  return blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  // count how many blogs an author has
  // accum = 0, then increment each time 
  const grouped = Lodash.groupBy(blogs, 'author')
  const result = Object.entries(grouped).map(([author, blogs]) => ({
    author,
    blogs: blogs.length
  }))
  const maxBlogs = Math.max(...result.map(author => author.blogs))
  const authorWithMostBlogs = result.find(author => author.blogs === maxBlogs)
  // console.log('=============>grouped: ', authorWithMostBlogs)
  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  const grouped = Lodash.groupBy(blogs, 'author')
  const result = Object.entries(grouped).map(([author, blogs]) => ({
    author,
    likes: totalLikes(blogs)
  }))
  console.log('Result ================>', result)
  const maxLikes = Math.max(...result.map(author => author.likes))
  const authorWithMostLikes = result.find(author => author.likes === maxLikes)
  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test } from 'vitest'

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User',
    }
  }

  // beforeEach(() => {
  //   render(<Blog blog={blog} />)
  // })

  test('renders blog title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} />)
    screen.getByText('Test Blog Title by Test Author')
    const urlElement = screen.queryByText('url: http://testblog.com')
    const likesElement = screen.queryByText('likes: 5')
    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })

  test('shows url and likes when the view button is clicked', async () => {
    render(<Blog blog={blog} />)
    const viewButton = screen.getByText('view')
    const user = userEvent.setup()
    await user.click(viewButton)
    // await viewButton.click() // Does not simulate real world user interaction

    screen.getByText('url: http://testblog.com')
    screen.getByText('likes: 5')
  })

  test('calls the onLike handler twice when like button is clicked twice', async () => {
    const mockHandler = vi.fn()
    render(<Blog blog={blog} onLike={mockHandler} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })

  
})

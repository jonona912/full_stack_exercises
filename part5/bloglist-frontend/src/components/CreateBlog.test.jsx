import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'
import { expect, test } from 'vitest'

describe('<CreateBlog />', () => {
  test('calls handleNewBlog with correct details when a new blog is created', async () => {
    const mockHandler = vi.fn()
    render(<CreateBlog handleNewBlog={mockHandler} />)

    const user = userEvent.setup()
    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'New Blog Title')
    await user.type(authorInput, 'New Author')
    await user.type(urlInput, 'http://newblog.com')
    await user.click(createButton)

    expect(mockHandler).toHaveBeenCalledTimes(1)
    expect(mockHandler).toHaveBeenCalledWith({
      title: 'New Blog Title',
      author: 'New Author',
      url: 'http://newblog.com'
    })
  })
})
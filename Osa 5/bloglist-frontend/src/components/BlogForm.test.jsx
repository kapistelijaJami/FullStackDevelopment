import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm>', () => {
  test('BlogForm blog creation calls handler with correct data', async () => {
    const blogData = {
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl'
    }

    const mockHandler = vi.fn()
    render(<BlogForm createBlog={mockHandler} />)

    const user = userEvent.setup()
    const title = screen.getByPlaceholderText('title')
    await user.type(title, blogData.title)
    const author = screen.getByPlaceholderText('author')
    await user.type(author, blogData.author)
    const url = screen.getByPlaceholderText('url')
    await user.type(url, blogData.url)

    const submit = screen.getByText('save')
    await user.click(submit)

    expect(mockHandler.mock.calls).toHaveLength(1)
    const foundData = mockHandler.mock.calls[0][0]
    expect(foundData.title).toBe(blogData.title)
    expect(foundData.author).toBe(blogData.author)
    expect(foundData.url).toBe(blogData.url)
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog>', () => {
  const testBlog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'Test URL',
    likes: 5,
    user: {
      name: 'testinimi',
      username: 'username'
    }
  }

  test('Blog has title and author', () => {
    render(<Blog blog={testBlog} />)
    const el = screen.getByText(testBlog.title + ' ' + testBlog.author)
    expect(el).toBeDefined()
  })

  test('Blog does not have url or likes at the start', () => {
    render(<Blog blog={testBlog} />)
    const url = screen.queryByText(testBlog.url, {exact: false})
    expect(url).toBeNull()
    const likes = screen.queryByText('likes ' + testBlog.likes, {exact: false})
    expect(likes).toBeNull()
  })

  test('Blog has url, likes and creator name after blog is opened', async () => {
    const loggedUser = {
      name: 'testinimi',
      username: 'username'
    }
    render(<Blog user={loggedUser} blog={testBlog} />)

    const user = userEvent.setup()
    const btn = screen.getByText('view')
    await user.click(btn)

    const url = screen.getByText(testBlog.url, {exact: false})
    expect(url).not.toBeNull()
    const likes = screen.getByText('likes ' + testBlog.likes, {exact: false})
    expect(likes).not.toBeNull()
    const name = screen.getByText(testBlog.user.name, {exact: false})
    expect(name).not.toBeNull()
  })

  test('Blog like button click handler is called per click', async () => {
    const loggedUser = {
      name: 'testinimi',
      username: 'username'
    }
    const mockHandler = vi.fn()
    render(<Blog user={loggedUser} blog={testBlog} handleLike={mockHandler} />)

    const user = userEvent.setup()
    const btn = screen.getByText('view')
    await user.click(btn)

    const like = screen.getByText('like')
    await user.click(like)
    await user.click(like)
    
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
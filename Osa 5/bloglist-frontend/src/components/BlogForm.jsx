import { useState, useEffect, useRef } from 'react'
import Blog from '../components/Blog'
import Toggleable from '../components/Toggleable'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'


const BlogForm = ({user, logout, showNotification}) => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const blogFormRef = useRef(null)


  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
    }
  }, [user])

  const updateBlog = blog => {
    const newBlogs = blogs.map(b => b.id === blog.id ? blog : b)
    setBlogs(newBlogs)
  }

  const removeBlog = blog => {
    const newBlogs = blogs.filter(b => b.id !== blog.id)
    setBlogs(newBlogs)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      blogFormRef.current.toggleVisibility()

      showNotification('a new blog ' + returnedBlog.title + ' added', true)
    } catch (e) {
      showNotification('adding new blog failed', false)
    }
  }

  blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      {user.name} logged in <button onClick={logout}>logout</button>
      <br /><br />

      <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
          title: <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} /><br />
          author: <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} /><br />
          url: <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} /><br />

          <button type="submit">save</button>
        </form>
      </Toggleable>

      {blogs.map(blog =>
        <Blog key={blog.id} user={user} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} showNotification={showNotification} />
      )}
    </div>
  )
}

BlogForm.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired
}

export default BlogForm
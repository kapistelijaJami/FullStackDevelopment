import { useState, useEffect, useRef } from 'react'
import Blog from './Blog'
import Toggleable from './Toggleable'
import BlogForm from './BlogForm'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'


const BlogList = ({user, logout, showNotification}) => {
  const [blogs, setBlogs] = useState([])
  const blogFormRef = useRef(null)


  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
    }
  }, [user])

  const updateBlog = (blog) => {
    const newBlogs = blogs.map(b => b.id === blog.id ? blog : b)
    setBlogs(newBlogs)
  }

  const removeBlog = async (blog) => {
    if (window.confirm('Remove blog ' + blog.title + ' by ' + blog.author)) {
      try {
        await blogService.deleteBlog(blog, blog.likes + 1)

        const newBlogs = blogs.filter(b => b.id !== blog.id)
        setBlogs(newBlogs)

        showNotification('Blog removed successfully', true)
      } catch (error) {
        showNotification(error.response.data.error, false)
      }
    }
  }

  const handleLike = async (blog) => {
    const returnedBlog = await blogService.setLikes(blog, blog.likes + 1)
    updateBlog(returnedBlog)
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
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
        <BlogForm createBlog={createBlog} />
      </Toggleable>

      {blogs.map(blog =>
        <Blog key={blog.id} user={user} blog={blog} handleLike={handleLike} removeBlog={removeBlog} showNotification={showNotification} />
      )}
    </div>
  )
}

BlogList.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired
}

export default BlogList
import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ user, blog, updateBlog, removeBlog, showNotification }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    const returnedBlog = await blogService.setLikes(blog, blog.likes + 1)
    updateBlog(returnedBlog)
  }

  const handleRemove = async () => {
    if (window.confirm('Remove blog ' + blog.title + ' by ' + blog.author)) {
      try {
        await blogService.deleteBlog(blog, blog.likes + 1)
        removeBlog(blog)
        showNotification('Blog removed successfully', true)
      } catch (error) {
        showNotification(error.response.data.error, false)
      }
    }
  }

  if (visible) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button><br />
        {blog.url}<br />
        likes {blog.likes} <button onClick={handleLike}>like</button><br />
        {blog.user.name}<br />

        {blog.user.username === user.username && <button onClick={handleRemove}>remove</button>}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
    </div>
  )
}

export default Blog
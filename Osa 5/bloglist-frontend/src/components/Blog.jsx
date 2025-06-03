import { useState } from 'react'

const Blog = ({ user, blog, handleLike, removeBlog }) => {
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

  if (visible) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button><br />
        {blog.url}<br />
        likes {blog.likes} <button onClick={() => { handleLike(blog) }}>like</button><br />
        {blog.user.name}<br />

        {blog.user.username === user.username && <button onClick={() => { removeBlog(blog) }}>remove</button>}
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
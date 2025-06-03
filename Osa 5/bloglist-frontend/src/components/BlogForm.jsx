import { useState } from 'react'

const BlogForm = ({createBlog}) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    await createBlog(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={ addBlog }>
        title: <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} placeholder="title" /><br />
        author: <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} placeholder="author" /><br />
        url: <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} placeholder="url" /><br />

        <button type="submit">save</button>
      </form>
    </>
  )
}

export default BlogForm
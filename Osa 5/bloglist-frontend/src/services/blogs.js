import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const setLikes = async (blog, newLikes) => {
  const config = {
    headers: { Authorization: token },
  }

  const newObject = { ...blog, likes: newLikes }

  const response = await axios.put(baseUrl + '/' + blog.id, newObject, config)
  return response.data
}

const deleteBlog = async blog => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(baseUrl + '/' + blog.id, config)
  return response.data
}

export default { getAll, create, setToken, setLikes, deleteBlog }
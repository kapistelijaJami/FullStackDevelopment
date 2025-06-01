import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'

const App = () => {
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationSuccess, setNotificationSuccess] = useState(true)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    setUser(null)
  }

  const showNotification = (message, success) => {
    setNotificationMessage(message)
    setNotificationSuccess(success)
    window.setTimeout(() => setNotificationMessage(null), 4000)
  }

  return (
    <div>
      <Notification message={notificationMessage} success={notificationSuccess} />
      {!user && <LoginForm setUser={setUser} showNotification={showNotification} />}
      {user && <BlogForm user={user} logout={logout} showNotification={showNotification} />}
    </div>
  )
}

export default App
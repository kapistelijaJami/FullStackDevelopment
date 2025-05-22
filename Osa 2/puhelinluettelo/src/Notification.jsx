const notificationSuccess = {
  color: 'green',
  border: "solid green 2px",
  width: 500,
  borderRadius: "8px",
  background: "lightgray",
  fontSize: 30,
  marginBottom: 10
}

const notificationError = {
  color: 'red',
  border: "solid red 2px",
  width: 500,
  borderRadius: "8px",
  background: "lightgray",
  fontSize: 30,
  marginBottom: 10
}

const Notification = ({ message, success }) => {
  if (message === null) {
    return null;
  }

  return (
    <div style={success ? notificationSuccess : notificationError}>
      {message}
    </div>
  )
}

export default Notification;
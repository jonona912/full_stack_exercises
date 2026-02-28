import { useContext } from 'react'
import NotifContext from '../NotifContext'

const Notification = () => {
  const { notif } = useContext(NotifContext)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (notif !== '') {
    return (
      <div style={style}>
        <p>{notif}</p>
      </div>
    )
  }
}

export default Notification

import { useNotificationStore } from '../services/store'
import { Alert } from '@mui/material'

const ShowNotification = () => {
  const { notification } = useNotificationStore()

  if (notification === null) {
    return null
  }

  return <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={notification.type}>
    {notification.message}
  </Alert>
}

export default ShowNotification

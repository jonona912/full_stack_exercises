import { useUserStore } from '../services/store'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Stack, Typography } from '@mui/material'
import { useField } from '../services/formFields'
const Register = () => {
  const { createUser } = useUserStore()
  const navigate = useNavigate()

  const { reset: nameReset, ...nameField } = useField('text')
  const { reset: resetUsername, ...usernameField } = useField('text')
  const { reset: resetPassword, ...passwordField } = useField('password')
  const { reset: resetConfirmPassword, ...confirmPasswordField } = useField('password')

  const handleRegister = async (event) => {
    event.preventDefault()
    if (passwordField.value !== confirmPasswordField.value) {
      alert('Passwords do not match')
      return
    }
    const newUser = await createUser({ name: nameField.value, username: usernameField.value, password: passwordField.value })
    if (newUser) {
      navigate('/login')
      nameReset()
      resetUsername()
      resetPassword()
      resetConfirmPassword()
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box component="form" onSubmit={handleRegister} sx={{ width: 320 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
            Register
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="name"
            id="name"
            {...nameField}
            name="name"
            fullWidth
          />
          <TextField
            label="username"
            id="username"
            {...usernameField}
            name="username"
            fullWidth
          />
          <TextField
            label="password"
            id="password"
            {...passwordField}
            name="password"
            fullWidth
          />
          <TextField
            label="confirm password"
            id="confirmPassword"
            {...confirmPasswordField}
            name="confirmPassword"
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <Button
              id="register-button"
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Register
            </Button>
            <Button
              variant="outlined"
              color="info"
              fullWidth
              onClick={() => navigate('/login')}
            >
              Log in
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default Register
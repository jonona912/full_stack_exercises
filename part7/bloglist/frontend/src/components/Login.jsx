import { useUserStore } from '../services/store'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Stack, Typography } from '@mui/material'

const Login = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    userLogin
  } = useUserStore()
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    const success = await userLogin()
    if (success) {
      navigate('/blogslist')
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
      <Box component="form" onSubmit={handleLogin} sx={{ width: 320 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
            Login
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="username"
            id="username"
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
            fullWidth
          />
          <TextField
            label="password"
            id="password"
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <Button
              id="login-button"
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="info"
              fullWidth
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default Login

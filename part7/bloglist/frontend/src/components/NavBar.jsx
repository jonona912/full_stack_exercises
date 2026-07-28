import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { useUserStore } from '../services/store'

const NavBar = () => {
  const { userLogout } = useUserStore()
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Blogs
        </Typography>
        <Button color="inherit" component={Link} to="/blogsList">
          Blogs list
        </Button>
        <Button color="inherit" component={Link} to="/createBlog">
          Create blog
        </Button>
        <Button color="inherit" component={Link} to="/users">
          Users
        </Button>
        <Button
          onClick={userLogout}
          sx={{
            bgcolor: 'error.light',
            color: 'common.white',
            '&:hover': {
              bgcolor: 'error.dark',
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar

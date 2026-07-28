import { useUsersInfoStore } from '../services/store'
import NavBar from './NavBar'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material'

const UsersInfo = () => {
  const { users } = useUsersInfoStore()

  return (
    <div>
      <NavBar />
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 2, mb: 2 }}>
          Users
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Below is a list of users and the number of blogs they have created.
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UsersInfo

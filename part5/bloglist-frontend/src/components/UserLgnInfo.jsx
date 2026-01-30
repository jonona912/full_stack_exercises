import LogoutBtn from './LogoutBtn'

const UserLgnInfo = ({ user, onLogout }) => { 
  return (
    <p>{user.name} logged in <LogoutBtn onLogout={onLogout} /></p>
  )
}

export default UserLgnInfo
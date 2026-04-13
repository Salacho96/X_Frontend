import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/">Timeline</Link>
      <Link to="/search">Search</Link>
      <Link to={`/profile/${user?.username}`}>My Profile</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  )
}
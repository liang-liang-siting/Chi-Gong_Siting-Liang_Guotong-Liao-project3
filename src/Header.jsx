import { useEffect, useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { UserContext } from './Context'
import { useNavigate } from 'react-router-dom'
import './index.css'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { loginUsername, setLoginUsername } = useContext(UserContext)

  const isLoginPage = location.pathname === '/login'
  const isSignupPage = location.pathname === '/signup'

  const handleLogout = () => {
    fetch('/api/users/logout', { method: 'POST', credentials: 'same-origin' })
      .then((response) => {
        if (response.ok) {
          console.log('Logged out successfully')
          setLoginUsername('')
          navigate('/')
        } else {
          console.error('Failed to log out')
        }
      })
      .catch((error) => {
        console.error('An error occurred while logging out', error)
      })
  }

  // when the component mounts, check if the user is authenticated
  useEffect(() => {
    const authenticate = async () => {
      if (loginUsername) return
      try {
        const response = await fetch('/api/users/authenticate')
        if (response.ok) {
          const data = await response.json()
          setLoginUsername(data.username)
          console.log('Authenticated as', data.username)
        } else {
          if (location.pathname === '/') {
            return
          } else if (!['/login', '/signup'].includes(location.pathname)) {
            navigate('/login')
          }
          console.log('Not authenticated')
        }
      } catch (error) {
        console.error('An error occurred while authenticating')
      }
    }
    authenticate()
  }, [loginUsername, setLoginUsername, navigate, location.pathname])

  return (
    <div className='header'>
      <NavLink to='/' className='link'>
        Home
      </NavLink>
      {loginUsername ? (
        <div className='user-menu'>
          <div className='dropdown'>
            <span className='username'>{loginUsername}</span>
            <div className='dropdown-content'>
              <a onClick={() => navigate('/password')}>Passwords</a>
              <a onClick={handleLogout}>Logout</a>
            </div>
          </div>
        </div>
      ) : (
        <div className='auth-buttons'>
          {!isLoginPage && (
            <NavLink to='/login' className='link'>
              Log In
            </NavLink>
          )}
          {!isSignupPage && (
            <NavLink to='/signup' className='link'>
              Sign Up
            </NavLink>
          )}
        </div>
      )}
    </div>
  )
}

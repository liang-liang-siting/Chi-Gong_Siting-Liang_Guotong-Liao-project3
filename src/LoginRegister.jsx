import { useState, useContext } from 'react'
import { UserContext } from './Context'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types';
import './index.css'

function LoginRegister({ isRegistering }) {
  const navigate = useNavigate()
  const { loginUserName, setLoginUserName } = useContext(UserContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (loginUserName) {
      console.log('User is already logged in.')
      return
    }
    if (username.trim() === '') {
      setError('Please enter your username.')
      return
    }
    if (password.trim() === '') {
      setError('Please enter your password.')
      return
    }

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (response.ok) {
        // Handle successful login
        console.log('Login successful')
        setLoginUserName(data.username)
        navigate('/password')
      } else {
        // Handle login failure
        setError(data.message || 'Login failed.')
      }
    } catch (error) {
      setError('An error occurred while logging in.')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (username.trim() === '') {
      setError('Please enter a username.')
      return
    }
    if (password.trim() === '') {
      setError('Please enter a password.')
      return
    }
    if (confirmPassword.trim() === '') {
      setError('Please confirm your password.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        // Handle successful registration
        console.log('Registration successful')
        setSuccess(true)
        navigate('/login')
        // setIsAuthenticated(true)
      } else {
        // Handle registration failure
        const data = await response.json()
        setError(data.message || 'Registration failed.')
      }
    } catch (error) {
      setError('An error occurred while registering.')
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible)
  }

  return (
    <div className='login-register-container'>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      {success && <div className='success'>Registration successful!</div>}
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className='password-input'>
          <input
            type={passwordVisible ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='button' onClick={togglePasswordVisibility}>
            {passwordVisible ? 'Hide' : 'Show'}
          </button>
        </div>
        {isRegistering && (
          <div className='password-input'>
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type='button' onClick={toggleConfirmPasswordVisibility}>
              {confirmPasswordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        )}
        {error && <div className='error'>{error}</div>}
        <button type='submit'>{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <p>
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
        <span
          className='toggle-link'
          onClick={() =>
            (window.location.href = isRegistering ? '/login' : '/signup')
          }
        >
          {isRegistering ? 'Login' : 'Sign Up'}
        </span>
      </p>
    </div>
  )
}

LoginRegister.propTypes = {
  isRegistering: PropTypes.bool,
}

export default LoginRegister

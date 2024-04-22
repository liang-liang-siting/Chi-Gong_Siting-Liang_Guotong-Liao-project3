import { useState, useEffect, useContext, useCallback } from 'react'
import './passwordManager.css'
import PasswordStorageFile from './PasswordStorageFile'
import { UserContext } from './Context'
import { useNavigate } from 'react-router-dom'

function PasswordManager() {
  const navigate = useNavigate()
  const { loginUsername } = useContext(UserContext)

  const [url, setUrl] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [alphabet, setAlphabet] = useState(false)
  const [numerics, setNumerics] = useState(false)
  const [symbols, setSymbols] = useState(false)
  const [length, setLength] = useState(8)
  const [passwords, setPasswords] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [useSecurePassword, setUseSecurePassword] = useState(false)

  // Bonus Point: Generate a secure password
  const generateSecurePassword = (length) => {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-='
    const charsetLength = charset.length
    let generatedPassword = ''

    const randomValues = new Uint32Array(length)
    window.crypto.getRandomValues(randomValues)

    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % charsetLength
      generatedPassword += charset[randomIndex]
    }

    return generatedPassword
  }

  const isValidUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch (error) {
      return false
    }
  }

  const handleToggleSecurePassword = () => {
    setUseSecurePassword(!useSecurePassword)
    if (!useSecurePassword) {
      const securePassword = generateSecurePassword(length)
      setPassword(securePassword)
    }
  }

  const handleGeneratePassword = async () => {
    if (!useSecurePassword && !alphabet && !numerics && !symbols) {
      alert('Please select at least one option for password generation')
      return
    }

    if (!useSecurePassword && (length < 4 || length > 50)) {
      alert('Password length must be between 4 and 50 characters')
      return
    }

    if (useSecurePassword) {
      const securePassword = generateSecurePassword(length)
      setPassword(securePassword)
    } else {
      let generatedPassword = ''
      const options = []
      if (alphabet) options.push('abcdefghijklmnopqrstuvwxyz')
      if (numerics) options.push('0123456789')
      if (symbols) options.push('!@#$%^&*()_+~`|}{[]:;?><,./-=')

      for (let i = 0; i < length; i++) {
        const randomOption = options[Math.floor(Math.random() * options.length)]
        generatedPassword +=
          randomOption[Math.floor(Math.random() * randomOption.length)]
      }

      setPassword(generatedPassword)
    }
  }

  const handleAddPasswordFile = async () => {
    console.log(url, password, loginUsername)
    if (!url.trim()) {
      console.log(url.trim())
      alert('Please enter a URL')
      return
    }
    if (!isValidUrl(url)) {
      alert('Please enter a valid URL, such as https://example.com')
      return
    }
    if (!loginUsername || !loginUsername.trim()) {
      alert('Invalid username')
      return
    }
    if (!password.trim()) {
      alert('Please enter a password')
      return
    }
    if (passwords.some((item) => item.url === url)) {
      alert('URL already exists')
      return
    }
    try {
      const response = await fetch('/api/passwords/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          password: password,
          username: loginUsername,
        }),
      })

      if (response.ok) {
        await fetchPasswords()
        console.log('Password added successfully')
      } else {
        console.error('Failed to add password:', response.statusText)
      }
    } catch (error) {
      console.error('Error adding password:', error)
    }
  }

  const fetchPasswords = useCallback(async () => {
    if (!loginUsername) return
    try {
      const response = await fetch(`/api/passwords/${loginUsername}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Passwords:', data)
        setPasswords(data)
      } else {
        if (response.status === 401) {
          navigate('/login')
          return
        }
        console.error('Failed to fetch passwords:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching passwords:', error)
    }
  }, [loginUsername, navigate])

  // Fetch passwords on initial render
  useEffect(() => {
    fetchPasswords()
  }, [fetchPasswords])

  // Bonus Point: Password search
  const filteredPasswords = passwords?.filter(
    (password) =>
      password.url &&
      password.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // messages section
  const [messages, setMessages] = useState([])
  const handleRejectSharing = async (message) => {
    try {
      const response = await fetch(`/api/message/delete/${message.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        const updatedMessages = messages.filter(
          (item) => item.id !== message.id
        )
        setMessages(updatedMessages)
      } else {
        console.error('Failed to reject sharing:', response.statusText)
      }
    } catch (error) {
      console.error('Error rejecting sharing:', error)
    }
  }

  const handleAcceptSharing = async (message) => {
    try {
      const response = await fetch('/api/message/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      })

      if (response.ok) {
        const updatedMessages = messages.filter(
          (item) => item.id !== message.id
        )
        setMessages(updatedMessages)
        await fetchPasswords()
      } else {
        console.error('Failed to accept sharing:', response.statusText)
      }
    } catch (error) {
      console.error('Error accepting sharing:', error)
    }
  }

  useEffect(() => {
    const messageInterval = setInterval(() => {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`/api/message/${loginUsername}`)
          if (response.ok) {
            const data = await response.json()
            // console.log('Messages:', data);
            setMessages(data)
          } else {
            console.error('Failed to fetch messages:', response.statusText)
          }
        } catch (error) {
          console.error('Error fetching messages:', error)
        }
      }
      fetchMessages()
    }, 3000)
    return () => clearInterval(messageInterval)
  }, [loginUsername])

  return (
    <div className='password-container'>
      <h2 className='password-title'>Password Manager</h2>
      <p>Welcome to the password manager page, {loginUsername}!</p>
      <div className='password-input-row'>
        <input
          type='text'
          placeholder='URL'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className='password-input'
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='password-input'
        />
        <button
          className='show-hide-button'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className='password-input-row'>
        <div>
          <label
            htmlFor='securePasswordToggle'
            className='secure-password-toggle-label'
          >
            Use Secure Password:
          </label>
          <input
            type='checkbox'
            id='securePasswordToggle'
            checked={useSecurePassword}
            onChange={handleToggleSecurePassword}
            className='secure-password-toggle'
          />
        </div>
      </div>
      {!useSecurePassword && (
        <div className='password-input-row'>
          <div className='checkbox-group'>
            <label className='checkbox-label'>
              <input
                type='checkbox'
                checked={alphabet}
                onChange={() => setAlphabet(!alphabet)}
              />
              Alphabet
            </label>
            <label className='checkbox-label'>
              <input
                type='checkbox'
                checked={numerics}
                onChange={() => setNumerics(!numerics)}
              />
              Numerics
            </label>
            <label className='checkbox-label'>
              <input
                type='checkbox'
                checked={symbols}
                onChange={() => setSymbols(!symbols)}
              />
              Symbols
            </label>
          </div>
          <input
            type='number'
            placeholder='Length'
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className='password-input'
          />
          <button onClick={handleGeneratePassword} className='submit-button'>
            Generate Password
          </button>
        </div>
      )}
      <div className='password-input-row'>
        <button onClick={handleAddPasswordFile} className='submit-button'>
          Add Password File
        </button>
      </div>
      <div className='password-storage-section'>
        <h3>Password Files:</h3>
        <input
          type='text'
          placeholder='Search by URL'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='search-bar'
        />
        {filteredPasswords.map((password, index) => (
          <PasswordStorageFile
            key={index}
            url={password.url}
            username={password.username}
            password={password.password}
            lastUpdatedTime={password.lastUpdateTime}
            fetchPasswords={fetchPasswords}
          />
        ))}
      </div>
      {/* Messages section */}
      {messages.length > 0 && (
        <div className='messages-section'>
          <ul className='message-list'>
            {messages.map((message, index) => (
              <li key={index} className='message-card'>
                <div className='message-header'>
                  <h4>Sharing Request</h4>
                  <p>
                    A user wants to share a password with you.
                  </p>
                </div>
                <div className='message-content'>
                  <p>
                    <strong>Username:</strong> {message.senderUsername}
                  </p>
                  <p>
                    <strong>URL:</strong> {message.url}
                  </p>
                </div>
                <div className='message-actions'>
                  <button onClick={() => handleRejectSharing(message)}>
                    Reject
                  </button>
                  <button onClick={() => handleAcceptSharing(message)}>
                    Accept
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PasswordManager

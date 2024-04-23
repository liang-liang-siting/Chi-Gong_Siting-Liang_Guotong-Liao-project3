import PropTypes from 'prop-types'
import { useState, useContext } from 'react'
import { UserContext } from './Context'
import CopyIcon from './assets/copy.svg?react'
import ShareIcon from './assets/share.svg?react'
import DeleteIcon from './assets/delete.svg?react'
import UpdateIcon from './assets/update.svg?react'
import './passwordStorageFile.css'

function PasswordStorageFile({
  url,
  username,
  password,
  lastUpdatedTime,
  fetchPasswords,
}) {
  const { loginUsername } = useContext(UserContext)
  const [newPassword, setNewPassword] = useState(password)
  const [isEditing, setIsEditing] = useState(false)
  const [shareUsername, setShareUsername] = useState('')
  const [showShareInput, setShowShareInput] = useState(false)
  const [infoMessage, setInfoMessage] = useState('') // State to store info message

  const handleUpdate = async () => {
    if (!newPassword.trim()) {
      alert('Password cannot be empty!')
      return
    }
    if (username !== loginUsername) {
      alert('You are not authorized to update this password!')
      return
    }
    try {
      const response = await fetch('/api/passwords/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          password: newPassword,
          username: loginUsername,
        }),
      })

      if (response.ok) {
        await fetchPasswords()
        console.log('Password updated successfully')
        setIsEditing(false)
        setInfoMessage('Password updated successfully')
        setTimeout(() => {
          setInfoMessage('')
        }, 2000)
      } else {
        console.error('Failed to update password:', response.statusText)
        alert('Failed to update password. Please try again later.')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      alert('An error occurred while updating the password.')
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/passwords/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          username: loginUsername,
        }),
      })
      if (response.ok) {
        await fetchPasswords()
        console.log('Password deleted successfully')
      } else {
        console.error('Failed to delete password:', response.statusText)
      }
    } catch (error) {
      console.error('Error deleting password:', error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
  }

  const toggleShareInput = () => {
    setShowShareInput(!showShareInput)
  }

  // Function to handle share input
  const handleShareInputChange = (e) => {
    setShareUsername(e.target.value)
  }

  // Function to handle share button click
  const handleShareClick = async () => {
    setInfoMessage(shareUsername) // Reset info message
    setShowShareInput(false) // Hide share input

    if (!shareUsername) {
      setInfoMessage('Please enter a username!')
      return
    }

    if (shareUsername === loginUsername) {
      setInfoMessage('Cannot share password with yourself!')
      return
    }

    try {
      const response = await fetch(`/api/users/${shareUsername}`)

      if (!response.ok) {
        console.error('Failed to fetch user:', response.statusText)
        setInfoMessage(`Failed to share password with ${shareUsername}!`)
        return
      }

      const user = await response.json()

      if (!user) {
        setInfoMessage(`User ${shareUsername} not found!`)
        return
      }

      const messageResponse = await fetch('api/message/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderUsername: loginUsername,
          receiverUsername: shareUsername,
          url: url,
          sharingTime: new Date(),
        }),
      })

      if (messageResponse.ok) {
        console.log('Password shared successfully:', shareUsername)
        setInfoMessage(`Password shared with ${shareUsername}!`)
        setTimeout(() => {
          setInfoMessage('')
        }, 2000)
      } else {
        console.error('Failed to share password:', messageResponse.statusText)
        setInfoMessage(`Failed to share password with ${shareUsername}!`)
      }
    } catch (error) {
      console.error('Error sharing password:', error)
      setInfoMessage(`Failed to share password with ${shareUsername}!`)
    }
  }

  // Function to handle cancel share
  const handleCancelShare = () => {
    setShowShareInput(false)
    setShareUsername('')
    setInfoMessage('') // reset info message
  }

  return (
    <div className='password-storage-file'>
      {username === loginUsername && (
        <div className='top-right-icons'>
          <div className='action-icons'>
            <button onClick={toggleShareInput} title='Share Password'>
              <ShareIcon />
            </button>
            {/* Show update icon only if user is the owner of the password */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              title='Update Password'
            >
              <UpdateIcon />
            </button>
            <button onClick={handleDelete} title='Delete Password'>
              <DeleteIcon />
            </button>
          </div>
        </div>
      )}
      <div>
        <p>
          <span
            style={{
              fontWeight: 'bold',
            }}
          >
            URL:{' '}
          </span>
          {url}
        </p>
        <div className='password-field'>
          <span
            style={{
              fontWeight: 'bold',
            }}
          >
            Password:
          </span>
          <div className='password-show'>
            {isEditing ? (
              <>
                <input
                  type='text'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handleUpdate}>Update</button>
              </>
            ) : (
              <span>{password}</span>
            )}
            <div className='action-icons'>
              <button onClick={copyToClipboard}>
                <CopyIcon />
              </button>
            </div>
          </div>
        </div>
        <p
          style={{
            color: 'gray',
            fontSize: '12px',
            marginTop: '8px',
          }}
        >
          Last Updated: {new Date(lastUpdatedTime).toLocaleString()}
        </p>
        {/* Show share input if user clicks share */}
        {showShareInput && (
          <div
            style={{
              marginTop: '10px',
            }}
          >
            <input
              type='text'
              placeholder='Enter username'
              value={shareUsername}
              onChange={handleShareInputChange}
            />
            <button onClick={handleCancelShare}>Cancel</button>
            <button onClick={handleShareClick}>Share</button>
          </div>
        )}
        {/* Show info message */}
        {infoMessage && (
          <p
            style={{
              fontSize: '12px',
              color: 'gray',
            }}
          >
            {infoMessage}
          </p>
        )}
      </div>
    </div>
  )
}

PasswordStorageFile.propTypes = {
  url: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  lastUpdatedTime: PropTypes.string.isRequired,
  fetchPasswords: PropTypes.func.isRequired,
}

export default PasswordStorageFile

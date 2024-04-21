import { useState, useEffect, useContext } from 'react'
import { UserContext } from './Context'
import CopyIcon from './assets/copy.svg?react'
import ShareIcon from './assets/share.svg?react'
import DeleteIcon from './assets/delete.svg?react'
import UpdateIcon from './assets/update.svg?react'
import './passwordStorageFile.css'

function PasswordStorageFile({
  url,
  password,
  lastUpdated,
  onDelete,
  onUpdate,
}) {
  const { loginUserName } = useContext(UserContext)
  const [newPassword, setNewPassword] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false) // State to track password update success

  const [shareUsername, setShareUsername] = useState('')
  const [showShareInput, setShowShareInput] = useState(false)
  const [infoMessage, setInfoMessage] = useState('') // State to store info message

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/passwords/delete/${encodeURIComponent(url)}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (response.ok) {
        // Password deleted successfully
        console.log('Password deleted successfully:', url)
        if (onDelete) onDelete(url)
        window.location.reload() // Refresh screen after password deletion
      } else {
        console.error('Failed to delete password:', response.statusText)
      }
    } catch (error) {
      console.error('Error deleting password:', error)
    }
  }

  const handleUpdate = async () => {
    if (onUpdate && newPassword.trim() !== '') {
      try {
        const response = await fetch(
          `/api/passwords/update/${encodeURIComponent(url)}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword: newPassword }),
          }
        )

        if (response.ok) {
          const updatedPassword = await response.json()
          onUpdate(url, newPassword, updatedPassword.lastUpdated)
          setNewPassword('')
          setIsEditing(false)
          setUpdateSuccess(true) // Set update success status to true
          setTimeout(() => setUpdateSuccess(false), 1000) // Reset update success status after 1 second
        } else {
          console.error('Failed to update password:', response.statusText)
        }
      } catch (error) {
        console.error('Error updating password:', error)
      }
    }
  }

  // Function to copy password to clipboard
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

    if (shareUsername === loginUserName) {
      setInfoMessage('Cannot share password with yourself!')
      return
    }

    try {
      const response = await fetch(`/api/user/${shareUsername}`)

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
          senderUserName: loginUserName,
          // receiverUserName: shareUsername,
          serviceUrl: url,
          sharingTime: new Date(),
        }),
      })

      if (messageResponse.ok) {
        console.log('Password shared successfully:', shareUsername)
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
      <div className='top-right-icons'>
        <div className='action-icons'>
          <button onClick={toggleShareInput} title='Share Password'>
            <ShareIcon />
          </button>
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
          <div className='password-input'>
            {isEditing ? (
              <input
                type='text'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
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
          Last Updated: {lastUpdated}
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
        {/* Show message when password update is successful */}
        {updateSuccess && <p>Password updated successfully!</p>}
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

export default PasswordStorageFile

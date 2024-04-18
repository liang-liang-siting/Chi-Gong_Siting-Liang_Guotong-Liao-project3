import React, { useState, useEffect } from 'react';
import './passwordStorageFile.css';

function PasswordStorageFile({ url, password, lastUpdated, onDelete, onUpdate }) {
  const [newPassword, setNewPassword] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false); 
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/passwords/delete/${encodeURIComponent(url)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('Password deleted successfully:', url); 
  
        if (onDelete) {
          onDelete(url);
        }

        window.location.reload();
      } else {
        console.error('Failed to delete password:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };  

  const handleUpdate = async () => {
    if (onUpdate && newPassword.trim() !== '') {
      try {
        const response = await fetch(`http://localhost:8000/api/passwords/update/${encodeURIComponent(url)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        });
  
        if (response.ok) {
          const updatedPassword = await response.json();
          onUpdate(url, password, updatedPassword.lastUpdatedTime);
          setNewPassword('');
          setUpdateSuccess(true);
          setTimeout(() => {
            setUpdateSuccess(false);
          }, 1000);
        } else {
          console.error('Failed to update password:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating password:', error);
      }
    }
  };
  

  useEffect(() => {
    if (updateSuccess) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [updateSuccess]);

  // Function to copy password to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <div className="password-storage-file">
      <div>
        <p>URL: {url}</p>
        <p>Password: {password} <button onClick={copyToClipboard}>Copy</button></p>
        <p>Last Updated: {lastUpdated}</p>
        <button onClick={handleDelete}>Delete</button>
        <input
          type="text"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleUpdate}>Update</button>
        {updateSuccess && <p>Password updated successfully!</p>}
      </div>
    </div>
  );
}

export default PasswordStorageFile;

import React, { useState, useEffect, useContext } from 'react';
import './passwordStorageFile.css';
import { UserContext } from './Context';

function PasswordStorageFile({ url, password, lastUpdated, onDelete, onUpdate }) {
  const [newPassword, setNewPassword] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false); 
  const { loginUserName } = useContext(UserContext); 

  const handleDelete = async () => {
    try {
        const encodedUrl = encodeURIComponent(url);
        const response = await fetch(`/api/passwords/delete/${encodedUrl}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: loginUserName, 
            }),
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
          const encodedUrl = encodeURIComponent(url);
          const response = await fetch(`/api/passwords/update/${encodedUrl}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: newPassword,
                    username: loginUserName, 
                }),
            });

            if (response.ok) {
                const updatedPassword = await response.json();
                onUpdate(url, password, updatedPassword.lastUpdatedTime);
                setNewPassword('');
                setUpdateSuccess(true);
                setTimeout(() => {
                  window.location.reload();
              }, 500); 
            } else {
                console.error('Failed to update password:', response.statusText);
                alert('Failed to update password. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            alert('An error occurred while updating the password.');
        }
       }
      };



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

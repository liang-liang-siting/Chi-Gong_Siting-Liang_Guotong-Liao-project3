import React from 'react';

function PasswordStorageFile({ url, password, lastUpdated, onDelete, onUpdate }) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(url); // Call the onDelete function with the URL as parameter
    }
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(url); // Call the onUpdate function with the URL as parameter
    }
  };

  return (
    <div className="password-storage-file">
      <div>
        <span>URL: {url}</span>
        <span>Password: {password}</span>
        <span>Last Updated: {lastUpdated}</span>
      </div>
      <div>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
}

export default PasswordStorageFile;

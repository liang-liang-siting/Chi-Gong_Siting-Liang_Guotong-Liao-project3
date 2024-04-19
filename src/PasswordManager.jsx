import React, { useState, useEffect } from 'react';
import './passwordManager.css'; 
import PasswordStorageFile from './PasswordStorageFile';
import { useNavigate } from 'react-router-dom';
import crypto from 'crypto';

function PasswordManager({ isAuthenticated, handleLogout }) {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [alphabet, setAlphabet] = useState(false);
  const [numerics, setNumerics] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const [length, setLength] = useState(8); // Default length
  const [passwordFiles, setPasswordFiles] = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [sharedUsername, setSharedUsername] = useState('');
  const [showError, setShowError] = useState(false);
  const [sharingRequestSent, setSharingRequestSent] = useState(false);
  const [sharingRequestAccepted, setSharingRequestAccepted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [useSecurePassword, setUseSecurePassword] = useState(false); 

  const generateSecurePassword = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const charsetLength = charset.length;
    let password = "";
  
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
  
    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % charsetLength;
      password += charset[randomIndex];
    }
  
    return password;
  };
  
  const handleLogoutClick = () => {
    if (handleLogout) {
      handleLogout(); 
    }
    navigate('/login'); 
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleToggleSecurePassword = () => {
    setUseSecurePassword(!useSecurePassword);

    // If toggled to use secure password, generate one and set it directly to the password field
    if (!useSecurePassword) {
      const securePassword = generateSecurePassword(length);
      setPassword(securePassword);
    } else {
      // Reset password field if secure password is turned off
      setPassword('');
    }
  };

  const handleSubmit = async () => {
    // Validation checks
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    } else if (!isValidUrl(url)) { // Validate URL format
      alert('Please enter a valid URL');
      return;
    }
  
    // If password is not provided, generate a random one
    if (!password.trim()) {
      // Check if at least one checkbox is checked
      if (!useSecurePassword && !alphabet && !numerics && !symbols) {
        alert('Please select at least one option for password generation');
        return;
      }
  
      // Check if length is within the range of 4 to 50
      if (!useSecurePassword && (length < 4 || length > 50)) {
        alert('Password length must be between 4 and 50 characters');
        return;
      }
  
      if (useSecurePassword) {
        return; // No need to generate a password here, already filled by handleToggleSecurePassword
      }
  
      // Generate the random password based on selected options
      let generatedPassword = '';
      const options = [];
      if (alphabet) options.push('abcdefghijklmnopqrstuvwxyz');
      if (numerics) options.push('0123456789');
      if (symbols) options.push('!@#$%^&*()_+~`|}{[]:;?><,./-=');
  
      for (let i = 0; i < length; i++) {
        const randomOption = options[Math.floor(Math.random() * options.length)];
        generatedPassword += randomOption[Math.floor(Math.random() * randomOption.length)];
      }
  
      setPassword(generatedPassword);
    } else {
      // If password is provided, proceed with storing the data
      try {
        const response = await fetch('/api/passwords/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceName: url,
            password: password
          }),
        });
  
        if (response.ok) {
          console.log('Password added successfully');
          setUrl('');
          setPassword('');
          setSubmitSuccess(true);
          window.location.reload();
          setTimeout(() => {
            setSubmitSuccess(false);
          }, 1000);
        } else {
          console.error('Failed to add password:', response.statusText);
          alert('An error occurred while adding the password');
        }
      } catch (error) {
        console.error('Error adding password:', error);
        alert('An error occurred while adding the password');
      }
    }
  };
  

  // Function to delete a password file entry
  const handleDeletePasswordFile = (urlToDelete) => {
    const updatedFiles = passwordFiles.filter((file) => file.url !== urlToDelete);
    setPasswordFiles(updatedFiles);
  };

  // Function to update a password file entry
  const handleUpdatePasswordFile = (urlToUpdate) => {
    // Logic to update the password file entry...
  };

  const handleShareRequest = () => {
    // Validation checks for sharing
    if (!sharedUsername.trim() || sharedUsername === isAuthenticated) {
      setShowError(true);
      return;
    }

    // Simulate sharing request
    setSharingRequestSent(true);
  };

  const handleAcceptRequest = () => {
    // Simulate accepting the sharing request
    setSharingRequestAccepted(true);
  };

  const handleRejectRequest = () => {
    // Simulate rejecting the sharing request
    setSharedUsername('');
    setSharingRequestSent(false);
  };

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const response = await fetch('/api/passwords'); 
        if (response.ok) {
          const data = await response.json();
          setPasswords(data);
        } else {
          console.error('Failed to fetch passwords:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching passwords:', error);
      }
    };
  
    fetchPasswords();
  }, []);

  useEffect(() => {
    // Filter passwords based on search query
    const filtered = passwords.filter(password => password.serviceName.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredPasswords(filtered);
  }, [searchQuery, passwords]);

  return (
    <div className="password-container">
      <h2 className="password-title">Password Manager</h2>
      <p>Welcome to the password manager page!</p>
      <div className="password-input-row">
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="password-input"
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
        />
        <button className="show-hide-button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {/* Secure Password Toggle */}
      <div className="password-input-row">
        <div>
          <label htmlFor="securePasswordToggle" className="secure-password-toggle-label">Use Secure Password:</label>
          <input
            type="checkbox"
            id="securePasswordToggle"
            checked={useSecurePassword}
            onChange={handleToggleSecurePassword}
            className="secure-password-toggle"
          />
        </div>
      </div>
      {/* Checkbox Group */}
      {!useSecurePassword && (
        <div className="password-input-row">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={alphabet} onChange={() => setAlphabet(!alphabet)} />
              Alphabet
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={numerics} onChange={() => setNumerics(!numerics)} />
              Numerics
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={symbols} onChange={() => setSymbols(!symbols)} />
              Symbols
            </label>
          </div>
          <input
            type="number"
            placeholder="Length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="password-input"
          />
          <button onClick={handleSubmit} className="submit-button">Generate Password</button>
        </div>
      )}
      {/* Submit button */}
      <div className="password-input-row">
        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>
      {/* Password storage file section */}
      <div className="password-storage-section">
        <h3>Password Storage Files:</h3>
        <input
          type="text"
          placeholder="Search by service name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        {filteredPasswords.map((file, index) => (
          <PasswordStorageFile
            key={index}
            url={file.serviceName}
            password={file.password}
            lastUpdated={new Date(file.lastUpdateTime).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              timeZoneName: 'short'
            })}
            onDelete={handleDeletePasswordFile}
            onUpdate={handleUpdatePasswordFile}
          />
        ))}
      </div>
      {/* Sharing section */}
      <div className="password-sharing-section">
        <h3>Share Passwords:</h3>
        <input
          type="text"
          placeholder="Username to share"
          value={sharedUsername}
          onChange={(e) => setSharedUsername(e.target.value)}
        />
        <button onClick={handleShareRequest}>Share</button>
        {showError && <p>Error: Please enter a valid username</p>}
      </div>
      {sharingRequestSent && !sharingRequestAccepted && (
        <div>
          <p>{sharedUsername} wants to share their passwords with you.</p>
          <button onClick={handleAcceptRequest}>Accept</button>
          <button onClick={handleRejectRequest}>Reject</button>
        </div>
      )}
      {/* Logout button */}
      {/* <button onClick={handleLogoutClick} className="logout-button">Logout</button> */}
    </div>
  );
}

export default PasswordManager;

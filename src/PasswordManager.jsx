import React, { useState, useEffect, useContext} from 'react';
import './passwordManager.css';
import PasswordStorageFile from './PasswordStorageFile';
import { UserContext } from './Context';
import { useNavigate } from 'react-router-dom';

function PasswordManager({ isAuthenticated, handleLogout }) {
  const { loginUserName } = useContext(UserContext); 
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alphabet, setAlphabet] = useState(false);
  const [numerics, setNumerics] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const [length, setLength] = useState(8);
  const [passwords, setPasswords] = useState([]);
  const [sharedUsername, setSharedUsername] = useState('');
  const [showError, setShowError] = useState(false);
  const [sharingRequestSent, setSharingRequestSent] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [useSecurePassword, setUseSecurePassword] = useState(false);

  const generateSecurePassword = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const charsetLength = charset.length;
    let generatedPassword = "";

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % charsetLength;
      generatedPassword += charset[randomIndex];
    }

    return generatedPassword;
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
    if (!useSecurePassword) {
      const securePassword = generateSecurePassword(length);
      setPassword(securePassword);
    }
  };

  const handleSubmit = async () => {

    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    } else if (!isValidUrl(url)) {
      alert('Please enter a valid URL');
      return;
    }
  
    if (!loginUserName || !loginUserName.trim()) { 
      alert('Invalid username');
      return;
    }
  
    if (!password.trim()) {
      if (!useSecurePassword && !alphabet && !numerics && !symbols) {
        alert('Please select at least one option for password generation');
        return;
      }
  
      if (!useSecurePassword && (length < 4 || length > 50)) {
        alert('Password length must be between 4 and 50 characters');
        return;
      }
  
      if (useSecurePassword) {
        const securePassword = generateSecurePassword(length);
        setPassword(securePassword);
      } else {
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
      }
    } else {
      try {
        const requestBody = JSON.stringify({
          serviceName: url,
          password: password,
          username: loginUserName, 
        });
  
        const response = await fetch('/api/passwords/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });
  
        if (response.status === 409) {
          const confirmUpdate = window.confirm('A password for this service already exists. Would you like to update it?');
          if (confirmUpdate) {
            try {
              const updateResponse = await fetch(`/api/passwords/update/${encodeURIComponent(url)}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  password: password,
                  username: loginUserName,
                }),
              });
        
              console.log('Update Response:', updateResponse);
        
              if (updateResponse.ok) {
                console.log('Password updated successfully');
                const updatedPassword = await updateResponse.json();
                const updatedPasswords = passwords.map(p => p.serviceName === url ? updatedPassword : p);
                setPasswords(updatedPasswords);
                setUrl('');
                setPassword('');
                setSubmitSuccess(true);
                setTimeout(() => {
                  setSubmitSuccess(false);
                }, 1000); 
              } else {
                console.error('Failed to update password:', updateResponse.statusText);
                alert('An error occurred while updating the password');
              }
            } catch (error) {
              console.error('Error updating password:', error);
              alert('An error occurred while updating the password');
            }
          }

        } else if (response.ok) {
          console.log('Password added successfully');
          setUrl('');
          setPassword('');
          setSubmitSuccess(true);
          const data = await response.json();
          setPasswords(prevPasswords => [...prevPasswords, data]);
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
  

  const handleDeletePasswordFile = (urlToDelete) => {
    const updatedPasswords = passwords.filter(password => password.serviceName !== urlToDelete);
    setPasswords(updatedPasswords);
  };

  const handleUpdatePasswordFile = (urlToUpdate, newPassword, updatedLastUpdatedTime) => {
    const updatedPasswords = passwords.map(password => {
      if (password.serviceName === urlToUpdate) {
        return { ...password, password: newPassword, lastUpdateTime: updatedLastUpdatedTime };
      } else {
        return password;
      }
    });
    setPasswords(updatedPasswords);
  };

  const handleShareRequest = () => {
    if (!sharedUsername.trim() || sharedUsername === isAuthenticated) {
      setShowError(true);
      return;
    }

    setSharingRequestSent(true);
  };

  const handleAcceptRequest = () => {
    setSharingRequestSent(false); // Reset sharing request status
    setSharedUsername(''); // Clear shared username
    setSharingRequestAccepted(true);
  };

  const handleRejectRequest = () => {
    setSharedUsername('');
    setSharingRequestSent(false);
  };

  useEffect(() => {
    if (passwords && Array.isArray(passwords)) {
      const filtered = passwords.filter(password => 
        password.serviceName && 
        password.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPasswords(filtered);
    }
  }, [searchQuery, passwords]);
  
  

  useEffect(() => {
    const authenticate = async () => {
      try {
        if (loginUserName) { 
          const response = await fetch(`/api/passwords?username=${loginUserName}`); 
          if (response.ok) {
            const data = await response.json();
            setPasswords(data);
          } else {
            console.error('Failed to fetch passwords:', response.statusText);
          }
        } else {
          setPasswords([]);
        }
      } catch (error) {
        console.error('An error occurred while authenticating:', error);
      }
    };

    authenticate();
  }, [loginUserName, submitSuccess]); 

  return (
    <div className="password-container">
      <h2 className="password-title">Password Manager</h2>
      <p>Welcome to the password manager page, {loginUserName}!</p> 
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
      <div className="password-input-row">
        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>
      <div className="password-storage-section">
        <h3>Password Storage Files:</h3>
        <input
          type="text"
          placeholder="Search by service name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        {filteredPasswords.map((password, index) => (
          <PasswordStorageFile
            key={index}
            url={password.serviceName}
            password={password.password}
            lastUpdated={new Date(password.lastUpdateTime).toLocaleString('en-US', {
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
      {sharingRequestSent && (
        <div>
          <p>{sharedUsername} wants to share their passwords with you.</p>
          <button onClick={handleAcceptRequest}>Accept</button>
          <button onClick={handleRejectRequest}>Reject</button>
        </div>
      )}
    </div>
  );
}

export default PasswordManager;

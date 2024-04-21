import { useState, useEffect, useContext } from 'react';
import { UserContext } from './Context';
import './passwordManager.css'; 
import PasswordStorageFile from './PasswordStorageFile';

function PasswordManager() {
  const { loginUserName } = useContext(UserContext);
  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [alphabet, setAlphabet] = useState(false);
  const [numerics, setNumerics] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const [length, setLength] = useState(8); // Default length
  const [passwordFiles, setPasswordFiles] = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);


  const handleSubmit = async () => {
    // Validation checks
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }
  
    // If password is not provided, generate a random one
    if (!password.trim()) {
      // Check if at least one checkbox is checked
      if (!alphabet && !numerics && !symbols) {
        alert('Please select at least one option for password generation');
        return;
      }
  
      // Check if length is within the range of 4 to 50
      if (length < 4 || length > 50) {
        alert('Password length must be between 4 and 50 characters');
        return;
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
      return;
    }
  
    // If password is provided, proceed with storing the data
    try {
      const response = await fetch('/api/passwords/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceName: url,
          password: password,
          userName: loginUserName,
          lastUpdateTime: new Date().toLocaleString() // You can customize the format as needed
        }),
      });
  
      if (response.ok) {
        // Password added successfully
        // You can perform any necessary actions here
        console.log('Password added successfully');
        // Clear the input fields after adding the password
        setUrl('');
        setPassword('');
        setSubmitSuccess(true);
      } else {
        console.error('Failed to add password:', response.statusText);
        alert('An error occurred while adding the password');
      }
    } catch (error) {
      console.error('Error adding password:', error);
      alert('An error occurred while adding the password');
    }
  };

  useEffect(() => {
    fetch('/api/passwords/')
      .then(response => response.json())
      .then(data => setPasswords(data)) 
      .catch(error => console.error('Error fetching passwords:', error));
  }, [submitSuccess]); // Trigger useEffect when submit success changes

  // Function to delete a password file entry
  const handleDeletePasswordFile = (urlToDelete) => {
    const updatedFiles = passwordFiles.filter((file) => file.url !== urlToDelete);
    setPasswordFiles(updatedFiles);
  };

  // Function to update a password file entry
  const handleUpdatePasswordFile = (urlToUpdate) => {
    // Logic to update the password file entry...
  };

  useEffect(() => {
    if (!loginUserName) return;
    fetch(`/api/passwords/${loginUserName}`)
      .then(response => response.json())
      .then(data => setPasswords(data)) 
      .catch(error => console.error('Error fetching passwords:', error));
  }, [loginUserName]);

  const [messages, setMessages] = useState([]);
  const handleAcceptSharing = async (serviceUrl) => {
    const response = await fetch(`/api/message/accept/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceUrl: serviceUrl,
        receiverUserName: loginUserName,
      }),
    });

    if (response.ok) {
      // TODO: Update current password list
      console.log('Sharing request accepted successfully');
    } else {
      console.error('Failed to accept sharing request:', response.statusText);
    }
  }

  const handleRejectSharing = async (serviceUrl) => {
    // Simulate rejecting the sharing request
    const response = await fetch(`/api/message/delete/${serviceUrl}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      console.log('Sharing request rejected successfully');
    } else {
      console.error('Failed to reject sharing request:', response.statusText);
    }
  };

  useEffect(() => {
    // query messages every 2 seconds
    const interval = setInterval(async () => {
      if (!loginUserName) return;
      const response = await fetch(`/api/message/${loginUserName}`)
      const data = await response.json();
      console.log(data);
      setMessages(data);
    }, 2000);
    // Clear interval on unmount
    return () => clearInterval(interval);
  }, [loginUserName]);

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
      {/* Submit button */}
      <div className="password-input-row">
        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>
       {/* Password storage file section */}
      <div className="password-storage-section">
        <h3>Password Storage Files:</h3>
        {passwords.map((file, index) => (
          <PasswordStorageFile
            key={index}
            url={file.serviceName}
            password={file.password}
            lastUpdated={file.lastUpdatedTime}
            onDelete={handleDeletePasswordFile}
            onUpdate={handleUpdatePasswordFile}
          />
        ))}
      </div>
      {/* Messages section */}
      <div className="messages-section">
        <h3>Sharing Requests:</h3>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <div>
                <strong>{message.senderUserName}</strong> wants to share the password of <strong>{message.serviceUrl}</strong> with you.
              </div>
              <button onClick={() => handleRejectSharing(message.serviceUrl)}>Reject</button>
              <button onClick={() => handleAcceptSharing(message.serviceUrl)}>Accept</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PasswordManager;

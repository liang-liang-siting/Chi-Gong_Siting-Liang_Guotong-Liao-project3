import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Password from './PasswordManager';
import LoginRegister from './LoginRegister'; 
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/password" element={<Password />} />
          <Route path="/login" element={<LoginRegister isRegistering={false} />} /> 
          <Route path="/signup" element={<LoginRegister isRegistering={true} />} />
        </Routes>
      </App>
    </Router>
  </React.StrictMode>
);

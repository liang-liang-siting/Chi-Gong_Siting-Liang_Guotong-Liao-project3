import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import Password from './PasswordManager';
import LoginRegister from './LoginRegister'; 
import Layout from './Layout';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/password" element={<Password />} />
          <Route path="/login" element={<LoginRegister isRegistering={false} />} /> 
          <Route path="/signup" element={<LoginRegister isRegistering={true} />} />
        </Routes>
      </Layout>
    </Router>
  </React.StrictMode>
);

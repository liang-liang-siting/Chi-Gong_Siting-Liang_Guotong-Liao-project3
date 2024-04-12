import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './index.css';

export default function Header({ isAuthenticated, username, onLogout }) {
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const handleLogout = () => {
    console.log('Logging out...'); // Check if the logout function is called
    onLogout();
  };

  return (
    <div className='header'>
      <NavLink to='/' className='link'>Home</NavLink>
      {isAuthenticated ? (
        <div className="user-menu">
          <span className='username'>{username}</span>
          <div className="dropdown">
            <button className="dropbtn">Options</button>
            <div className="dropdown-content">
              <a href="#">Profile</a>
              <a href="#" onClick={onLogout}>Logout</a>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-buttons">
          {!isLoginPage && <NavLink to='/login' className='link'>Log In</NavLink>}
          {!isSignupPage && <NavLink to='/signup' className='link'>Sign Up</NavLink>}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token); // Check if token exists
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    // Update the component state with the token and username from session storage
    const storedToken = sessionStorage.getItem('token');
    const storedUsername = sessionStorage.getItem('username');
    if (storedToken) {
      setToken(storedToken);
      setLoggedInUser(storedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/user', {
        username,
        password,
      });

      const { jwtToken } = response.data;
      setToken(jwtToken);
      setLoggedInUser(username);
      sessionStorage.setItem('token', jwtToken);
      sessionStorage.setItem('username', username);
      setError(null);
      // Clear input boxes
      setUsername('');
      setPassword('');
      setIsLoggedIn(true);
    } catch (error) {
      setToken(null);
      setLoggedInUser(null);
      setError(error.response.data.error);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setLoggedInUser(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    // Clear input boxes
    setUsername('');
    setPassword('');
    setIsLoggedIn(false);
  };

  const renderLoginView = () => (
    <div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => setIsLoginView(false)}>Click here to Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );

  const renderRegisterView = () => (
    <div>
      {/* Add registration form elements here */}
      <button onClick={() => setIsLoginView(true)}>Click here to Login</button>
    </div>
  );

  const renderLoggedIn = () => (
    <div>
      <p>Login successful for user:</p>
      <p>{loggedInUser}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );

  return (
    <div>
      <h2>{isLoggedIn ? 'Logout' : 'Login/Register'}</h2>
      {isLoggedIn
        ? renderLoggedIn()
        : isLoginView
        ? renderLoginView()
        : renderRegisterView()}
    </div>
  );
};

export default Login;
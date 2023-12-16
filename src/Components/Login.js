// Import necessary dependencies
import './Style/Login.css';
import React, { useState } from 'react';

function Login() {
  // State to manage form input
  const [formData, setFormData] = useState({ username: '', password: '' });
  // State to manage login status and error messages
  const [loginStatus, setLoginStatus] = useState('');

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to handle form submission
  const handleLogin = async () => {
    try {
      // Make an API request to your PHP backend for authentication
      const response = await fetch('http://localhost/scannerapp/src/Components/Connection/Login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Parse the response
      const data = await response.json();

      // Check if authentication was successful
      if (data.success) {
        setLoginStatus('Login successful');
      } else {
        setLoginStatus('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <div className='Login'>
      <h2>Login</h2>
      <div>
        <label htmlFor='username'>Username:</label>
        <input
          type='text'
          id='username'
          name='username'
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          name='password'
          value={formData.password}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      <p>{loginStatus}</p>
    </div>
  );
}

export default Login;

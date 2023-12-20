// index.js
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Admin from './Components/Admin/Admin';
import Login from './Components/Login'; // Import the Login component
import reportWebVitals from './reportWebVitals';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user information from the server
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost/scannerapp/src/Components/Connection/GetProfile.php', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
          if(data.user.roll == 'Admin'){
            setIsAdmin(true);
            setIsLoggedIn(true);
          }else{
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    // You can render a loading indicator here if needed
    return <div>Loading...</div>;
  }

  return (
    <React.StrictMode>
      {isLoggedIn ? (isAdmin ? <Admin /> : <App />) : <Login />}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

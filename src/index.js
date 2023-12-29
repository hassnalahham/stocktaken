// index.js
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Admin from './Components/Admin/Admin';
import Login from './Components/Login'; // Import the Login component
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user information from the server
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('https://scannerst.pro/Components/Connection/GetProfile.php', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
          if(data.user.roll === 'Admin'){
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
    return <div className="loading"></div>;
  }

  return (
    <React.StrictMode>
      {isLoggedIn ? (isAdmin ? <Admin /> : <App />) : <Login />}
    </React.StrictMode>
  );
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

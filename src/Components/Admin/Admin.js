import  {React, useState, useEffect} from 'react';
import '../../App.css';
import Scanned from './AdminComponents/Scanned';
import Users from './AdminComponents/Users';
import Reports from './AdminComponents/Reports';
//import Header from '../Header';
import AdminHeader from './AdminComponents/AdminHeader';
import AdminSearch from './AdminComponents/AdminSearch';

import Session from './AdminComponents/Session';

import Footer from '../Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';






function Admin() {


  const [isSession, setIsSession] = useState(false);

    
    



  useEffect(() => {
     // Fetch user information from the server
     const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost/scannerapp/src/Components/Admin/AdminComponents/Connection/GetSession.php', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setIsSession(true);
        }else{
          setIsSession(false);
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();

    const intervalId = setInterval(() => {
      fetchUserInfo();
    }, 500);

    return () => {
      clearInterval(intervalId);
    };

  }, []);

  

   

  return ( 
    <div className="App">
      <body>
      <Router>
          <AdminHeader/>
          <main className="main">
          <Routes>
            {isSession ? 
            <>
            <Route path="/" element={<Scanned/>} />
            <Route path="/Search" element={<AdminSearch/>} />
            <Route path="/Users" element={<Users/>} />
            <Route path="/Reports" element={<Reports/>} />
            <Route path="/Session" element={<Session/>} />
            </>: 
            
            <>
            <Route path="/Session" element={<Session/>} />
            </>}   
            
          </Routes>
          </main>
        </Router>
      </body>
        <Footer/>  
    </div>
  );
}

export default Admin;

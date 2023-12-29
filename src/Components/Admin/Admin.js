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
import { HashRouter as Router, Route, Routes } from 'react-router-dom';







function Admin() {


  const [isSession, setIsSession] = useState(false);

    
    



  const fetchUserInfo = async () => {
    try {
      const response = await fetch('https://scannerst.pro/Components/Admin/AdminComponents/Connection/GetSession.php', {
        method: 'GET',
        credentials: 'include',
      });
  
      const data = await response.json();
  
      if (data.success) {
        setIsSession(true);
      } else {
        setIsSession(false);
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
    } finally {
      setTimeout(fetchUserInfo, 60000); // Retry after 60 seconds
    }
  };
  
  useEffect(() => {
    fetchUserInfo();
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
            <Route path="/" element={<Session/>} />
            <Route path="/Session" element={<Session/>} />
            <Route path="/Users" element={<Users/>} />
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

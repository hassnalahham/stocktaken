import  {React, useState, useEffect} from 'react';
import './App.css';
import Scan from './Components/Scan';
import Codes from './Components/Codes';
import Profile from './Components/Profile';
//import Header from './Components/Header';
import Header2 from './Components/Header2';
import Footer from './Components/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';




function App() {

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
          <Header2/>
          <main className="main">
          <Routes>   
            <Route path="/Codes" element={<Codes/>} />
            <Route path="/" element={<Scan/>} />
            <Route path="/Profile" element={<Profile/>} />
          </Routes>
          </main>
        </Router>
      </body>
        <Footer/>  
    </div>
  );
}

export default App;

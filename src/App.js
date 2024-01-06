import  {React, useState, useEffect} from 'react';
import './App.css';
import Scan from './Components/Scan';
import Codes from './Components/Codes';
import Profile from './Components/Profile';
//import Header from './Components/Header';
import Header2 from './Components/Header2';
import Footer from './Components/Footer';
import ErrorPage from './Components/ErrorPage';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';




function App() {

  const [isSession, setIsSession] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('https://scannerst.pro/Components/Connection/GetSession.php', {
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
    const fetchData = async () => {
      await fetchUserInfo();
      setTimeout(fetchData, 60000);
    };

    fetchData(); // Initial fetch

    // Cleanup function
    return () => {
      clearTimeout(fetchData); // Clear timeout when component unmounts
    };
  }, [fetchUserInfo]); // Include fetchUserInfo in the dependency array


  return ( 
    <div className="App">
      <body>
       
        <Router>
          <Header2/>
          <main className="main">
          <Routes>
            <Route path="/Codes" element={<Codes/>} />
            {isSession ? 
            <Route path="/" element={<Scan/>} />: 
            <Route path="/" element={<ErrorPage/>} />}
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

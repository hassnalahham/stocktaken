import React from 'react';
import './App.css';
import Scan from './Components/Scan';
import Codes from './Components/Codes';
import Profile from './Components/Profile';
//import Header from './Components/Header';
import Header2 from './Components/Header2';
import Footer from './Components/Footer';
import Login from './Components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
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
            <Route path="/Login" element={<Login/>} />
          </Routes>
          </main>
        </Router>
      </body>
        <Footer/>  
    </div>
  );
}

export default App;

import React from 'react';
import '../../App.css';
import Scanned from './AdminComponents/Scanned';
import Users from './AdminComponents/Users';
import Reports from './AdminComponents/Reports';
//import Header from '../Header';
import AdminHeader from './AdminComponents/AdminHeader';
import AdminSearch from './AdminComponents/AdminSearch';

import AddUser from './AdminComponents/CreateUser';

import Footer from '../Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function Admin() {
  return ( 
    <div className="App">
      <body>
      <Router>
          <AdminHeader/>
          <main className="main">
          <Routes>   
            <Route path="/" element={<Scanned/>} />
            <Route path="/Search" element={<AdminSearch/>} />
            <Route path="/Users" element={<Users/>} />
            <Route path="/Reports" element={<Reports/>} />
            <Route path="/Add" element={<AddUser/>} />
          </Routes>
          </main>
        </Router>
      </body>
        <Footer/>  
    </div>
  );
}

export default Admin;

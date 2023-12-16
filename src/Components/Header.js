import './Style/Header.css';
import { Link , useLocation  } from 'react-router-dom';
import React from 'react';

function Header() {
  const location = useLocation();
  return (
      <header className="navbar">
          <Link to="./Codes" className={location.pathname === "/Codes" ? "activeRoute" : "navlink"} >Codes</Link>
          <Link to="./" className={location.pathname === "/" ? "activeRoute" : "navlink"} >Scan</Link>
          <Link to="./Profile" className={location.pathname === "/Profile" ? "activeRoute" : "navlink"} >Profile</Link>
      </header>
  );
}

export default Header;

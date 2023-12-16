import './Style/Header2.css';
import { Link , useLocation  } from 'react-router-dom';
import  {React, useState} from 'react';

function Header() {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const OpenMenu = () => {
    setIsOpen(true);
  };

  const CloseMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className="navbar">
          <Link to="./Codes" className={location.pathname === "/Codes" ? "activeRoute" : "navlink"} >Codes</Link>
          <Link to="./" className={location.pathname === "/" ? "activeRoute" : "navlink"} >Scan</Link>
          <Link to="./Profile" className={location.pathname === "/Profile" ? "activeRoute" : "navlink"} >Profile</Link>
      </header>
      <header className='mobilenavbar'>
         <h1>Asia Mobile ST</h1>
         <button onClick={OpenMenu}>=</button>
         {isOpen ? ( 
         <>
         <div className='overlay' onClick={CloseMenu}></div>
         <div className='mobilenavminu'>
            <h1> Menu </h1>
            <button onClick={CloseMenu}>X</button>
            <Link to="./" onClick={CloseMenu} className={location.pathname === "/" ? "activeRoute" : "navlink"} >Scan</Link>
            <Link to="./Codes" onClick={CloseMenu} className={location.pathname === "/Codes" ? "activeRoute" : "navlink"} >Codes</Link>
            <Link to="./Profile" onClick={CloseMenu} className={location.pathname === "/Profile" ? "activeRoute" : "navlink"} >Profile</Link>
            <Link to="./Login" onClick={CloseMenu} className={location.pathname === "/Login" ? "activeRoute" : "navlink"} >Login</Link>
         </div>
         </>
         
          ) : null}
      </header>
    </>
    
  );
}

export default Header;

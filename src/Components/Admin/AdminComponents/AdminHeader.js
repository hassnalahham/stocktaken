import '../../Style/Header2.css';
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

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/scannerapp/src/Components/Connection/Logout.php', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        // Assuming a successful logout returns an empty response
        // Redirect or perform any additional actions after successful logout
        window.location.href = '/'; // Change '/login' to your actual login page
      } else {
        console.error('Error logging out:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <header className="navbar">
            <h2>Asia Mobile ST</h2>
            <div>
            <Link to="./" onClick={CloseMenu} className={location.pathname === "/" ? "activeRoute" : "navlink"} >Scanned</Link>
            <Link to="./Search" onClick={CloseMenu} className={location.pathname === "/Search" ? "activeRoute" : "navlink"} >Search</Link>
            <Link to="./Users" onClick={CloseMenu} className={location.pathname === "/Users" ? "activeRoute" : "navlink"} >Users</Link>
            <Link to="./Reports" onClick={CloseMenu} className={location.pathname === "/Reports" ? "activeRoute" : "navlink"} >Reports</Link>
            
            <Link to="./Session" onClick={CloseMenu} className={location.pathname === "/Session" ? "activeRoute" : "navlink"} >Session</Link>
            
            <Link to="./Logout"  onClick={() => { CloseMenu(); handleLogout(); }}  className={location.pathname === "/Logout" ? "activeRoute" : "navlink lastlink"} >Logout</Link>
        
            </div>
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
            <Link to="./" onClick={CloseMenu} className={location.pathname === "/" ? "activeRoute" : "navlink"} >Scanned</Link>
            <Link to="./Search" onClick={CloseMenu} className={location.pathname === "/Search" ? "activeRoute" : "navlink"} >Search</Link>
            <Link to="./Users" onClick={CloseMenu} className={location.pathname === "/Users" ? "activeRoute" : "navlink"} >Users</Link>
            <Link to="./Reports" onClick={CloseMenu} className={location.pathname === "/Reports" ? "activeRoute" : "navlink"} >Reports</Link>
            
            <Link to="./Session" onClick={CloseMenu} className={location.pathname === "/Session" ? "activeRoute" : "navlink"} >Session</Link>

            <Link to="./Logout"  onClick={() => { CloseMenu(); handleLogout(); }}  className={location.pathname === "/Logout" ? "activeRoute" : "navlink lastlink"} >Logout</Link>
         </div>
         </>
         
          ) : null}
      </header>
    </>
    
  );
}

export default Header;

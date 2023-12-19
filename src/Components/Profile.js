import React, { useState, useEffect } from 'react';
import './Style/Profile.css';
import PrfoileImg from './profile.png';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);


  useEffect(() => {
    // Fetch user information from the server
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://192.168.1.134/scannerapp/src/Components/Connection/GetProfile.php', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        if (data.success) {
          setUserInfo(data.user);
        }
       
      } catch (error) {
        console.error('Error fetching user information:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  

  return (
    <div className='Profile'>
      <div className='ImgDiv'>
        <img src={PrfoileImg} alt='Profile' />
      </div>
      <div className='InfoDiv'>
        {loading ? (
          <p>Loading...</p>
        ) : userInfo ? (
          <>
            <div className='InfoChild'>
              <p>Full Name: {userInfo.firstName}</p>
            </div>
            <div className='InfoChild'>
              <p>Scanned: {userInfo.scanned}</p>
            </div>
            <div className='InfoChild'>
              <p>Unique: {userInfo.unique}</p>
            </div>
            <div className='InfoChild'>
              <p>Status: {userInfo.status}</p>
            </div>
          </>
        ) : (
          <p>Error loading user information.</p>
        )}
      </div>
      <div>
        <button className='downloadbtn'>Download Codes</button>
      </div>
    </div>
  );
}

export default Profile;

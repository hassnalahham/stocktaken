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
        const response = await fetch('https://scannerst.pro/Components/Connection/GetProfile.php', {
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

  

  const handleDownload = () => {
    // Trigger the download by making a request to the PHP script
    const downloadUrl = 'https://scannerst.pro/Components/Connection/DownloadCode.php'; // Replace with your actual backend URL

    // Create a hidden link and click it to initiate the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'ST.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='Profile'>
      <div className='ImgDiv'>
        <img src={PrfoileImg} alt='Profile' />
      </div>
      <div className='InfoDiv'>
        {loading ? (
         <div className="loading"></div>
        ) : userInfo ? (
          <>
            <div className='InfoChild'>
              <p>Full Name: {userInfo.firstName} {userInfo.lastName}</p>
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
        <button className='downloadbtn' onClick={handleDownload}>Download Codes</button>
      </div>
    </div>
  );
}

export default Profile;

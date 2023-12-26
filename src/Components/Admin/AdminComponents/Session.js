import CreateSession from './CreateSession';
import DeleteSession from './DeleteSession';
import React, { useState, useEffect } from 'react';


function Session() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [SessionInfo, setSessionInfo] = useState(null);

  // Fetch user information from the server
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('https://scannerst.pro/Components/Admin/AdminComponents/Connection/GetSession.php', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setSessionInfo(data.session);
      }else{
        setSuccess(false);
        setSessionInfo(null);
      }
     
    } catch (error) {
      console.error('Error fetching user information:', error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
  

    fetchUserInfo();

    const intervalId = setInterval(() => {
      fetchUserInfo();
    }, 500);

    return () => {
      clearInterval(intervalId);
    };

  }, []);

  
  return (
    <>
    <div className='Profile'>
      <div className='InfoDiv'>
        {loading ? (
          <p>Loading...</p>
        ) : SessionInfo ? (
          <>
            <div className='InfoChild'>
              <p>Session Name: {SessionInfo.SessionName}</p>
            </div>
            <div className='InfoChild'>
              <p>Status: {SessionInfo.SessionStatus}</p>
            </div>
            <div className='InfoChild'>
              <p>Time: {SessionInfo.SessionTime}</p>
            </div>
          </>
        ) : (
          <p>No session information available.</p>
        )}
      </div>
    </div>
    {success ? <DeleteSession/> : <CreateSession/>}
      
    </>
  );
}

export default Session;

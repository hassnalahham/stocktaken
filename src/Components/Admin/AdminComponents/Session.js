import CreateSession from './CreateSession';
import DeleteSession from './DeleteSession';
import CreateRMA from './CreateRMA';

import React, { useState, useEffect } from 'react';

function Session() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [RMAbtn, setRMAbtn] = useState(false);

  const fetchSessionInfo = async () => {
    try {
      const response = await fetch('https://scannerst.pro/Components/Admin/AdminComponents/Connection/GetSession.php', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setSessionInfo(data.session);
        // Only fetch RMA info if RMAbtn is false
        if (!RMAbtn) {
          fetchRMAInfo();
        }
      } else {
        setSuccess(false);
        setSessionInfo(null);
        setRMAbtn(false);
      }
    } catch (error) {
      console.error('Error fetching session information:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRMAInfo = async () => {
    try {
      const response = await fetch('https://scannerst.pro/Components/Admin/AdminComponents/Connection/GetRMA.php', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setRMAbtn(true);
      } else {
        setRMAbtn(false);
      }
    } catch (error) {
      console.error('Error fetching RMA information:', error);
    }
  };

  useEffect(() => {
    // Fetch session information immediately
    fetchSessionInfo();

    // Poll for session information every 500 milliseconds
    const intervalId = setInterval(() => {
      fetchSessionInfo();
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  return (
    <>
      <div className='Profile'>
        <div className='InfoDiv'>
          {loading ? (
            <div className="loading"></div>
          ) : sessionInfo ? (
            <>
              <div className='InfoChild'>
                <p>Session Name: {sessionInfo.SessionName}</p>
              </div>
              <div className='InfoChild'>
                <p>Status: {sessionInfo.SessionStatus}</p>
              </div>
              <div className='InfoChild'>
                <p>Time: {sessionInfo.SessionTime}</p>
              </div>
              {RMAbtn ? <CreateRMA /> : null}
            </>
          ) : (
            <p>No session information available.</p>
          )}
        </div>
      </div>

      {success ? <DeleteSession /> : <CreateSession />}
    </>
  );
}

export default Session;

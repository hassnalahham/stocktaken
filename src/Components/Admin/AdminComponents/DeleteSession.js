import React, { useState, useEffect } from 'react';
import './Style/Users.css';

function DeleteSession() {
  const [endAsk, setEndAsk] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const OpenAskWindow = () => {
    setEndAsk(true);
  };

  const closeAskWindow = () => {
    setEndAsk(false);
  };


  const handleEnd = () => {
    fetch('http://localhost/scannerapp/src/Components/Admin/AdminComponents/Connection/DeleteSession.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.status === 'success') {
                setSuccess(true);
                setErrorMessage(data.message);
                closeAskWindow();
            } else if (data.status === 'error') {
                setErrorMessage(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setErrorMessage('An unexpected error occurred.');
        });
  };

  return (
    <div className='UsersDiv'>
        {errorMessage && (
        <div className={success ? "success-popup" : "error-popup"}>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('') && setSuccess(false)}>Close</button>
        </div>
      )}
    
      <div>
        <button onClick={() => OpenAskWindow()} className='redbtn'>End Session</button>
      </div>

      {endAsk ? 
      <>
      <div className='overlay' onClick={closeAskWindow}></div>
          <div className='edit-user'>
            <h1>End Session</h1>
            <button className='CloseWindow' onClick={closeAskWindow}>
              X
            </button>
              <>
               <p>Are You Sure You want to End the Session ?</p>
                <div className='doublebtnDiv'>
                  <button className='redbtn' onClick={handleEnd}>
                     Yes
                  </button>
                  <button className='bluebtn' onClick={closeAskWindow}>
                     No
                  </button>
                </div>
              </>
          </div>
      </> :null}
    </div>
  );
}

export default DeleteSession;

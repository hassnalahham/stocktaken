import React, { useState, useEffect } from 'react';
import './Style/Users.css';

function CreateSession() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [CreateSession, setCreateSession] = useState(null);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);


  const openManuallyWindow = () => {
    setCreateSession();
    setIsOpen(true);
  };

  const closeManuallyWindow = () => {
    setCreateSession(null);
    setIsOpen(false);
    setIsSaveButtonDisabled(true); // Enable the "Save" button on any input change

  };


  const handleCreate = () => {
    fetch('http://localhost/scannerapp/src/Components/Admin/AdminComponents/Connection/CreateSession.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CreateSession }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.status === 'success') {
                setSuccess(true);
                setErrorMessage(data.message);
                closeManuallyWindow();
            } else if (data.status === 'error') {
                setErrorMessage(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setErrorMessage('An unexpected error occurred.');
        });
  };


  const handleInputChange = (fieldName, value) => {
    setCreateSession({ ...CreateSession, [fieldName]: value });
    setIsSaveButtonDisabled(false); // Enable the "Save" button on any input change
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
        <button onClick={() => openManuallyWindow()} className='bluebtn'>Create Session</button>
      </div>
      
      {isOpen ? (
        <>
        
          <div className='overlay' onClick={closeManuallyWindow}></div>
          <div className='edit-user'>
            <h1>Create Session</h1>
            <button className='CloseWindow' onClick={closeManuallyWindow}>
              X
            </button>
              <>
                <div>
                  <div className='coolinput'>
                    <label htmlFor='input' className='text'>
                    Session Name:
                    </label>
                    <input
                      type='text'
                      placeholder='Write here...'
                      name='input'
                      className='input'
                      onChange={(e) => handleInputChange('SessionName', e.target.value)}
                    />
                  </div>
                  <div className='coolinput'>
                    <label htmlFor='input' className='text'>
                    Session File:
                    </label>
                    <input
                      type='file'
                      placeholder='Write here...'
                      name='input'
                      className='input'
                      onChange={(e) => handleInputChange('SessionName', e.target.value)}
                    />
                  </div>
                  <button className='bluebtn' onClick={handleCreate} disabled={isSaveButtonDisabled}>
                     Create
                  </button>
                </div>
              </>
          </div>
        </>
      ) : null}
      
    </div>
  );
}

export default CreateSession;

import React, { useState, useEffect } from 'react';
import './Style/Users.css';

// ... (existing imports)

function CreateSession() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [sessionNameChanged, setSessionNameChanged] = useState(false);
  const [fileChanged, setFileChanged] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    setIsSaveButtonDisabled(!(sessionNameChanged && fileChanged));
  }, [sessionNameChanged, fileChanged]);

  const openManuallyWindow = () => {
    setIsOpen(true);
  };

  const closeManuallyWindow = () => {
    setIsOpen(false);
    setSessionNameChanged(false);
    setFileChanged(false);
    setIsSaveButtonDisabled(true);
  };

  const handleCreate = (formData) => {
    setLoading(true); // Set loading to true before making the fetch request

    fetch('https://scannerst.pro/Components/Admin/AdminComponents/Connection/CreateSession.php', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Server response:', data);
        if (data.status === 'success') {
          setSuccess(true);
          closeManuallyWindow();
        } else{
          setErrorMessage(data.message || 'An unknown error occurred x.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMessage('An unexpected error occurred.');
      })
      .finally(() => {
        setLoading(false); // Set loading to false regardless of success or error
      });
  };

  const handleCreateButtonClick = () => {
    const sessionName = document.getElementById('sessionNameInput').value;
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (sessionName && file) {
      const formData = new FormData();
      formData.append('SessionName', sessionName);
      formData.append('SessionFile', file);

      handleCreate(formData);
    } else {
      setErrorMessage('Please provide both session name and file.');
    }
  };

  const hundlecreatebtn = (e) => {
    const inputId = e.target.id;

    if (inputId === 'sessionNameInput') {
      setSessionNameChanged(true);
    } else if (inputId === 'fileInput') {
      setFileChanged(true);
    }
  };

  return (
    <div className='UsersDiv'>
      {errorMessage && (
        <div className={success ? "success-popup" : "error-popup"}>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Close</button>
        </div>
      )}
      <div>
        <button onClick={openManuallyWindow} className='bluebtn'>Create Session</button>
      </div>

      {isOpen && (
        <>
          <div className='overlay' onClick={closeManuallyWindow}></div>
          <div className='edit-user'>
            <h1>Create Session</h1>
            <button className='CloseWindow' onClick={closeManuallyWindow}>
              X
            </button>
            <form encType="multipart/form-data">
              <div>
                <div className='coolinput'>
                  <label htmlFor='sessionNameInput' className='text'>
                    Session Name:
                  </label>
                  <input
                    id='sessionNameInput'
                    type='text'
                    placeholder='Write here...'
                    className='input'
                    onChange={hundlecreatebtn}
                  />
                </div>
                <div className='coolinput'>
                  <label htmlFor='fileInput' className='text'>
                    Session File:
                  </label>
                  <input
                    id='fileInput'
                    type='file'
                    placeholder='Write here...'
                    className='input'
                    accept='.csv'
                    onChange={hundlecreatebtn}
                  />
                </div>
                <button className='bluebtn' type='button' onClick={handleCreateButtonClick} disabled={isSaveButtonDisabled || loading}>
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default CreateSession;

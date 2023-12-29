import React, { useState, useEffect } from 'react';
import './Style/Users.css';
import CloseMenuIcon from '../../Assest/Images/b_x.svg';
// ... (existing imports)

function CreateRMA() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [fileChanged, setFileChanged] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    setIsSaveButtonDisabled(!(fileChanged));
  }, [fileChanged]);

  const openManuallyWindow = () => {
    setIsOpen(true);
  };

  const closeManuallyWindow = () => {
    setIsOpen(false);
    setFileChanged(false);
    setIsSaveButtonDisabled(true);
  };

  const handleCreate = (formData) => {
    setLoading(true); // Set loading to true before making the fetch request

    fetch('https://scannerst.pro/Components/Admin/AdminComponents/Connection/CreateSessionRMA.php', {
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
        if (data.success) {
          setSuccess(true);
          closeManuallyWindow();
        } else{
          setErrorMessage(data.message || 'An unknown error occurred x.');
        }
      })
      .catch(error => {
        // Log the response for debugging purposes
        if (error && error.response && error.response.text) {
            console.log('Server response:', error.response.text);
        }
    })
      .finally(() => {
        setLoading(false); // Set loading to false regardless of success or error
      });
  };

  const handleCreateButtonClick = () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('SessionFile', file);

      handleCreate(formData);
    } else {
      setErrorMessage('Please provide RMA file.');
    }
  };

  const hundlecreatebtn = (e) => {
    const inputId = e.target.id;

   if (inputId === 'fileInput') {
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
        <button onClick={openManuallyWindow} className='bluebtn'>Add RMA file</button>
      </div>

      {isOpen && (
        <>
          <div className='overlay' onClick={closeManuallyWindow}></div>
          <div className='edit-user'>
            <h1>Create Session</h1>
            <button className='CloseWindow' onClick={closeManuallyWindow}>
            <img src={CloseMenuIcon}></img>
            </button>
            <form encType="multipart/form-data">
              <div>
                <div className='coolinput'>
                  <label htmlFor='fileInput' className='text'>
                    RMA File:
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
                    'Add'
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

export default CreateRMA;

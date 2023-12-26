import React, { useState } from 'react';
import './Style/Users.css';

function CreateUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [CreateUser, setCreateUser] = useState(null);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const openManuallyWindow = () => {
    setCreateUser();
    setIsOpen(true);
  };

  const closeManuallyWindow = () => {
    setCreateUser(null);
    setIsOpen(false);
    setIsSaveButtonDisabled(true); // Enable the "Save" button on any input change

  };

  const togglePassword = () =>{
    setShowPassword(!showPassword);
  }

  const handleCreate = () => {
    fetch('https://scannerst.pro/Components/Admin/AdminComponents/Connection/AddUser.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CreateUser }),
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
    setCreateUser({ ...CreateUser, [fieldName]: value });
    setIsSaveButtonDisabled(false); // Enable the "Save" button on any input change
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
        <button onClick={() => openManuallyWindow()} className='bluebtn'>Add User</button>
      </div>

      {isOpen ? (
        <>
        
          <div className='overlay' onClick={closeManuallyWindow}></div>
          <div className='edit-user'>
            <h1>Create User</h1>
            <button className='CloseWindow' onClick={closeManuallyWindow}>
              X
            </button>
              <>
                <div>
                  <div className='coolinput'>
                    <label htmlFor='input' className='text'>
                      First Name:
                    </label>
                    <input
                      type='text'
                      placeholder='Write here...'
                      name='input'
                      className='input'
                      onChange={(e) => handleInputChange('userFirstname', e.target.value)}
                    />
                  </div>
                  <div className='coolinput'>
                    <label htmlFor='input' className='text'>
                      Last Name:
                    </label>
                    <input
                      type='text'
                      placeholder='Write here...'
                      name='input'
                      className='input'
                      onChange={(e) => handleInputChange('userLastname', e.target.value)}
                    />
                  </div>


                  <div className='coolinput'>
                    <label htmlFor='input' className='text'>
                      Roll:
                    </label>
                    <select
                      name='input'
                      className='input'
                      onChange={(e) => handleInputChange('userRoll', e.target.value)}
                    >
                      <option value='None' hidden>None</option>
                      <option value='Scanner'>Scanner</option>
                      <option value='Admin'>Admin</option>
                    </select>
                  </div>

                  <div className='coolinput'>
                    <label htmlFor='input' className='text'>
                      UserName:
                    </label>
                    <input
                      type='text'
                      placeholder='Write here...'
                      name='input'
                      className='input'
                      onChange={(e) => handleInputChange('userUsername', e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className='coolinput'>
                    <label htmlFor='input' className='text'>
                      Password:
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Write here...'
                      name='input'
                      className='input'
                      onChange={(e) => handleInputChange('userPassword', e.target.value)}
                      autoComplete="new-password"
                    >
                    </input>
                    <button className='showpassword' onClick={togglePassword}>🔑</button>
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

export default CreateUser;

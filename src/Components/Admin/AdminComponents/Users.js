import React, { useState, useEffect } from 'react';
import './Style/Users.css';
import AddUser from './CreateUser';

function Users() {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const openManuallyWindow = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const closeManuallyWindow = () => {
    setSelectedUser(null);
    setIsOpen(false);
    setIsSaveButtonDisabled(true); // Enable the "Save" button on any input change

  };

  const togglePassword = () =>{
    setShowPassword(!showPassword);
  }

  const handleEdit = () => {
    fetch('https://scannerst.pro/Components/Admin/AdminComponents/Connection/EditUser.php', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedUser }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);

        if (data.status === 'error') {
          setErrorMessage(data.message);
        } else {
          setErrorMessage('');
        }
      })
      .catch(error => {
        console.error('Error sending barcode to server:', error);
        setErrorMessage('An error occurred while communicating with the server.');
      });

    closeManuallyWindow();
  };

  const handleInputChange = (fieldName, value) => {
    setSelectedUser({ ...selectedUser, [fieldName]: value });
    setIsSaveButtonDisabled(false); // Enable the "Save" button on any input change
  };

  const fetchLatestBarcodes = async () => {
    try {
      const response = await fetch('https://scannerst.pro/Components/Admin/AdminComponents/Connection/GetUsers.php', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.status === 'error') {
        // Set the error message with the user's first name
        setErrorMessage(data.message);
      }

      if (response.ok) {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Invalid data format:', data);
        }
      } else {
        console.error('Error fetching latest barcodes:', data);
      }
    } catch (error) {
      console.error('Error fetching latest barcodes:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLatestBarcodes();
    };

    fetchData();

    const intervalId = setInterval(fetchData, 500);

    return () => clearInterval(intervalId);
  }, []);

  if (users.length === 0) {
    return <p>Loading...</p>;
  }



  return (
    <div className='UsersDiv'>
        {errorMessage && (
        <div className="error-popup">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Close</button>
        </div>
      )}
      <h1>Users</h1>
      {users.map((user, index) => (
        <div key={index} className='UsersChild' onClick={() => openManuallyWindow(user)}>
          <p>{user.userFullname}</p>
          <p>{user.userQty}</p>
          <p>{user.userStatus}</p>
        </div>
      ))}

      {isOpen ? (
        <>
        
          <div className='overlay' onClick={closeManuallyWindow}></div>
          <div className='edit-user'>
            <h1>Edit User</h1>
            <button className='CloseWindow' onClick={closeManuallyWindow}>
              X
            </button>
            <p>
              <b>{selectedUser.userFullname}</b>{' '}
            </p>
            {selectedUser.userId && (
              <>
                <div>
                  <div className='coolinput'>
                    <label htmlFor='fname' className='text'>
                      First Name:
                    </label>
                    <input
                      type='text'
                      placeholder='Write here...'
                      name='fname'
                      className='input'
                      value={selectedUser.userFirstname}
                      onChange={(e) => handleInputChange('userFirstname', e.target.value)}
                    />
                  </div>
                  <div className='coolinput'>
                    <label htmlFor='lname' className='text'>
                      Last Name:
                    </label>
                    <input
                      type='text'
                      placeholder='Write here...'
                      name='lname'
                      className='input'
                      value={selectedUser.userLastname}
                      onChange={(e) => handleInputChange('userLastname', e.target.value)}
                    />
                  </div>

                  <div className='coolinput'>
                    <label htmlFor='status' className='text'>
                      Status:
                    </label>
                    <select
                      name='status'
                      className='input'
                      value={selectedUser.userStatus}
                      onChange={(e) => handleInputChange('userStatus', e.target.value)}
                    >
                      <option value='Active'>Active</option>
                      <option value='Deactivate'>Deactivate</option>
                    </select>
                  </div>

                  <div className='coolinput'>
                    <label htmlFor='roll' className='text'>
                      Roll:
                    </label>
                    <select
                      name='roll'
                      className='input'
                      value={selectedUser.userRoll}
                      onChange={(e) => handleInputChange('userRoll', e.target.value)}
                    >
                      <option value='Scanner'>Scanner</option>
                      <option value='Admin'>Admin</option>
                    </select>
                  </div>

                  <div className='coolinput'>
                    <label htmlFor='password' className='text'>
                      Password:
                    </label>
                    <input
                       type={showPassword ? 'text' : 'password'}
                      placeholder='Write here...'
                      name='password'
                      className='input'
                      value={selectedUser.userPassword}
                      onChange={(e) => handleInputChange('userPassword', e.target.value)}
                    >
                    </input>
                    <button className='showpassword' onClick={togglePassword}>🔑</button>
                  </div>

                  <button className='bluebtn' onClick={handleEdit} disabled={isSaveButtonDisabled}>
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      ) : null}
      <AddUser/>
    </div>
  );
}

export default Users;

import React, { useState, useEffect } from 'react';
import './Style/Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const openManuallyWindow = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };
  const closeManuallyWindow = () => {
    setSelectedUser(null);
    setIsOpen(false);
  };


  const handleEdit = (option) => {
      fetch('http://localhost/scannerapp/src/Components/Admin/AdminComponents/Connection/EditUser.php', {
      method: 'POST',
      credentials: 'include', // Include credentials
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedUser, action: option }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);

        // Check if there is an error in the server response
        if (data.status === 'error') {
          // Set the error message with the user's first name
          setErrorMessage(data.message);
        } else {
          // Clear any previous error messages
          setErrorMessage('');
        }
      })
      .catch(error => {
        console.error('Error sending barcode to server:', error);
        // Set an error message for network or server errors
        setErrorMessage('An error occurred while communicating with the server.');
      });
    // After deletion, close the window
    closeManuallyWindow();
  };



  const fetchLatestBarcodes = async () => {
    try {
      const response = await fetch('http://localhost/scannerapp/src/Components/Admin/AdminComponents/Connection/GetUsers.php', {
        credentials: 'include', // Include credentials
      });
      const data = await response.json();
  
      if (response.ok) {
        // Check if the data is an array
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

    fetchData(); // Fetch initially

    // Set up polling with a specified interval (e.g., every 5 seconds)
    const intervalId = setInterval(fetchData, 500); // Adjust the interval as needed (in milliseconds)

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures the effect runs only once on mount

  // Handle loading state
  if (users.length === 0) {
    return <p>Loading...</p>;
  }

  // Limit the displayed rows to the latest 5 barcodes
  const limitedBarcodes = users.slice(0, 5);

  return (
    <div className='UsersDiv'>
        <h1>Users</h1>
      {limitedBarcodes.map((user, index) => (
        <div key={index} className='UsersChild' onClick={() => openManuallyWindow(user)}>
          <p>{user.userFullname}</p>
          <p>{user.userQty}</p>
          <p>{user.userStatus}</p>
        </div>
      ))}


<>
        {isOpen ? (
          <>
            <div className='overlay' onClick={closeManuallyWindow}></div>
            <div className='Add-Manually-Window'>
              <h1>Delete</h1>
              <button className='CloseWindow' onClick={closeManuallyWindow}>
                X
              </button>
              <p>Are you sure you want to delete <br /> <b>{selectedUser.userId}</b>  ?</p>
              {selectedUser.userId && (
                <>
                    <div>
                    <input type='text' value={selectedUser.userId}></input>
                    <input type='text' value={selectedUser.userFullname}></input>
                    <select>
                        {selectedUser.userStatus == 'Active' ? 
                        <>
                         <option value={selectedUser.userStatus} selected>Active</option>
                         <option value='Deactivate'>Deactivate</option>
                        </>:
                        <>
                        <option value='Active'>Active</option>
                        <option  value={selectedUser.userStatus} selected >Deactivate</option>
                        </>
                        }
                    </select>
                    <button className='bluebtn' onClick={() => handleEdit('DeleteOnce')}>
                      Save
                    </button>
                    </div>
                </>
              )}
            </div>
          </>
        ) : null}
      </>
    </div>
  );
}

export default Users;

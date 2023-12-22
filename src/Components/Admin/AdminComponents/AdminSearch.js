import React, { useState, useEffect } from 'react';
import '../../Style/Barcode.css';
import './Style/Card.css';

const AdminSearch = ({ onInsertionComplete }) => {
  const [barcode, setBarcode] = useState('');
  const [isCooldown, setIsCooldown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [searched, setSearched] = useState(null);

  const handleScanComplete = () => {
    console.log('Scanned Barcode:', barcode);

    // Send barcode data to the server
    sendBarcodeToServer();

    // Set cooldown
    setIsCooldown(true);
    setTimeout(() => {
      setBarcode('');
      setIsCooldown(false);

      // Call the onInsertionComplete callback when barcode insertion is complete
      if (onInsertionComplete) {
        onInsertionComplete();
      }
    }, 500);
  };

  const sendBarcodeToServer = () => {
    // Send barcode data to the server using fetch or any other method
    fetch('http://localhost/scannerapp/src/Components/Admin/AdminComponents/Connection/SearchBarcode.php', {
      method: 'POST',
      credentials: 'include', // Include credentials
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ barcode }),
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
        
        if(data.success){
          setSearched(data.user);
          setIsSearched(true);
        }
      })
      .catch(error => {
        console.error('Error sending barcode to server:', error);
        // Set an error message for network or server errors
        setErrorMessage('An error occurred while communicating with the server.');
      });
  };

  const handleKeyPress = (event) => {
    if (!isCooldown) {
      if (/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]$/.test(event.key)) {
        setBarcode((prevBarcode) => prevBarcode + event.key);
      } else if (event.key === 'Enter') {
        handleScanComplete();
      }
    }
  };


  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [barcode, isCooldown, handleScanComplete]);

  return (
    <div>
      {errorMessage && (
        <div className="error-popup">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Close</button>
        </div>
      )}

      <div className='barcode39'>{barcode}</div>
      <>
       {isSearched ? 
       <div className='searchedDiv'>
        <table>
          <tbody>
            <tr>
              <td>Barcode  </td>
              <td>{searched.barcode}</td>
            </tr>
            <tr>
              <td>Quantity  </td>
              <td>{searched.qty}</td>
            </tr>
            <tr>
              <td>User  </td>
              <td>{searched.UserFullname}</td>
            </tr>
            <tr>
              <td>Status  </td>
              <td>Reached</td>
            </tr>
          </tbody>
        </table>
       </div> 
      : <p>Search to fetch result ...</p>}
      </>
    </div>
  );
};

export default AdminSearch;

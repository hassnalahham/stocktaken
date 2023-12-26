import React, { useState } from 'react';
import './Style/AddManualy.css';

function AddManualy() {
  const [isOpen, setIsOpen] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const openManuallyWindow = () => {
    setIsOpen(true);
  };

  const closeManuallyWindow = () => {
    setIsOpen(false);
  };



  const handleScanComplete = () => {
    console.log('Scanned Barcode:', barcode.barcode , barcode.qty);
  
    // Send barcode data to the server
    sendBarcodeToServer();
  
  };
  
  const sendBarcodeToServer = () => {
    // Send barcode data to the server using fetch or any other method
    fetch('https://scannerst.pro/Components/Connection/InsertBarcodeManually.php', {
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
        closeManuallyWindow();
        // Check if there is an error in the server response
        if (data.status === 'error') {
          // Set the error message with the user's first name
          setErrorMessage(data.message);
        }
      })
      .catch(error => {
        console.error('Error sending barcode to server:', error);
      });
  };
  



  return (
    <>
      

      {isOpen ? (
        <>
        {errorMessage && (
          <div className="error-popup">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage('')}>Close</button>
          </div>
        )}
        <div className='overlay' onClick={closeManuallyWindow}></div>
        <div className='Add-Manually-Window'>
            <h1>Add Manually</h1>
            <button className='CloseWindow' onClick={closeManuallyWindow} >X</button>
          <form>
              <input
                type='text'
                name="barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder='ASIN'
              />
              <input
                type='number'
                name="qty"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder='QTY'
              />
            <button className='bluebtn' onClick={handleScanComplete}>
              Add
            </button>
          </form>
        </div>
        </>
      ) : <button className='bluebtn' onClick={openManuallyWindow}>
             Add Manually
         </button>}
    </>
  );
}

export default AddManualy;

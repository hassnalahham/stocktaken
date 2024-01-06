import React, { useState, useEffect } from 'react';
import './Style/Barcode.css';
import './Style/AddManualy.css';
import CloseMenuIcon from './Assest/Images/b_x.svg';

const BarcodeScanner = ({ onInsertionComplete }) => {
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isCooldown, setIsCooldown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRMA, setIsOpenRMA] = useState(false);
  const [RMA, setRMA] = useState('');

  const openManuallyWindow = () => {
    setIsOpen(true);
    setQuantity('');
  };

  const closeManuallyWindow = () => {
    setIsOpen(false);
    setQuantity(1);
    setBarcode('');
  };

  const openRMAwidow = () => {
    setIsOpenRMA(true);
  };

  const closeRMAwindow = () => {
    setIsOpenRMA(false);
    setBarcode('');
    setRMA('');
  };

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

  const handleRMAComplete = () => {
    console.log('Added RMA:', barcode, RMA);

    // Send barcode data to the server
    sendRMAToServer();

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
    fetch('https://scannerst.pro/Components/Connection/InsertBarcode.php', {
      method: 'POST',
      credentials: 'include', // Include credentials
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ barcode, quantity }),
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
  };

  const sendRMAToServer = () => {
    // Send barcode data to the server using fetch or any other method
    fetch('https://scannerst.pro/Components/Connection/InserRMA.php', {
      method: 'POST',
      credentials: 'include', // Include credentials
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ barcode, RMA }),
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
  };

  const handleKeyPress = (event) => {
    if (isOpen) {
      // If the manual input window is open, do not handle key presses
      return;
    }

    if (isOpenRMA) {
      // If the manual input window is open, do not handle key presses
      return;
    }
    if (!isCooldown) {
      if (/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]$/.test(event.key)) {
        setBarcode((prevBarcode) => prevBarcode + event.key);
      } else if (event.key === 'Enter') {
        handleScanComplete();
      }
    }
  };

  const handleAddManually = () => {
    handleScanComplete();
    closeManuallyWindow();
  };

  const handleAddRMA = () => {
    handleRMAComplete();
    closeRMAwindow();
  };

  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [barcode, isCooldown, isOpen, handleScanComplete]);

  return (
    <div className='scanpagediv'>
      {errorMessage && (
        <div className="error-popup">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Close</button>
        </div>
      )}

      <div className='barcodesesction'>
        <div className='barcode39'>{barcode}</div>
      </div>
      


      <>
        {isOpen ? (
          <>
            <div className='overlay' onClick={closeManuallyWindow}></div>
            <div className='Add-Manually-Window'>
              <h1>Add Manually</h1>
              <button className='CloseWindow' onClick={closeManuallyWindow}><img src={CloseMenuIcon} alt='close'></img></button>
                <input
                  type='text'
                  name="barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder='Barcode'
                />
                <input
                  type='number'
                  name="qty"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder='QTY'
                />
                <button id="addButton" className='bluebtn' onClick={handleAddManually}>
                  Add
                </button>
            </div>
          </>
        ) : <button className='bluebtn' onClick={openManuallyWindow}>
          Add Manually
        </button>}<br />
      </>

      <>
        {isOpenRMA ? (
          <>
            <div className='overlay' onClick={closeRMAwindow}></div>
            <div className='Add-Manually-Window'>
              <h1>Add RMA Item</h1>
              <button className='CloseWindow' onClick={closeRMAwindow}><img src={CloseMenuIcon} alt='close'></img></button>
                <input
                  type='text'
                  name="barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder='Barcode'
                />
                <input
                  type='text'
                  name="rma"
                  value={RMA}
                  onChange={(e) => setRMA(e.target.value)}
                  placeholder='RMA'
                />
                <button id="addButton" className='bluebtn' onClick={handleAddRMA}>
                  Add
                </button>
            </div>
          </>
        ) : <button className='bluebtn' onClick={openRMAwidow}>
          Add RMA
        </button>}
      </>
    </div>
  );
};

export default BarcodeScanner;

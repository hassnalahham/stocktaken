import React, { useState, useEffect } from 'react';
import './Style/Barcode.css';

const BarcodeScanner = ({ onInsertionComplete }) => {
  const [barcode, setBarcode] = useState('');
  const [isCooldown, setIsCooldown] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!isCooldown) {
        if (/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]$/.test(event.key)) {
          setBarcode((prevBarcode) => prevBarcode + event.key);
        } else if (event.key === 'Enter') {
          handleScanComplete();
        }
      }
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

    const sendBarcodeToServer = () => {
      // Send barcode data to the server using fetch or any other method
      fetch('http://localhost/scannerapp/src/Components/Connection/InsertBarcode.php', {
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
        })
        .catch(error => {
          console.error('Error sending barcode to server:', error);
        });
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [barcode, isCooldown, onInsertionComplete]);

  return (
    <div>
      <div className='barcode39'>{barcode}</div>
      <p>Scanned Barcode: {barcode}</p>
    </div>
  );
};

export default BarcodeScanner;

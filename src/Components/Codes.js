import React, { useState, useEffect } from 'react';
import './Style/Codes.css';
import CloseMenuIcon from './Assest/Images/b_x.svg';

function Codes() {
  const [latestBarcodes, setLatestBarcodes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [selectedQty, setSelectedQty] = useState(null);

  const openManuallyWindow = (barcode) => {
    setSelectedBarcode(barcode.barcode);
    setSelectedQty(barcode.qty);
    setIsOpen(true);
  };

  const closeManuallyWindow = () => {
    setSelectedBarcode(null);
    setSelectedQty(null);
    setIsOpen(false);
  };

  const handleDelete = (option) => {
    console.log(`Deleting ${option} for barcode ${selectedBarcode}`);
      fetch('https://scannerst.pro/Components/Connection/DeleteBarcode.php', {
      method: 'POST',
      credentials: 'include', // Include credentials
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedBarcode, action: option }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);
      })
      .catch(error => {
        console.error('Error sending barcode to server:', error);
        // Set an error message for network or server errors
      });
    // After deletion, close the window
    closeManuallyWindow();
  };

  const fetchLatestBarcodes = () => {
    // Fetch the latest barcodes from the server
    fetch('https://scannerst.pro/Components/Connection/GetGroupedBarcode.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLatestBarcodes(data);
      })
      .catch((error) => {
        console.error('Error fetching latest barcodes:', error);
      });
  };

  useEffect(() => {
    fetchLatestBarcodes();

    const intervalId = setInterval(() => {
      fetchLatestBarcodes();
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <h1>Your Barcodes</h1>
      <p>Press on the barcode to erase</p>
      {/* ... (other JSX code) */}
      <div className='CodesDiv'>
        <div className='CodesChild'>
          <table>
            {/* ... (your existing table structure) */}
            <tbody>
              {Array.isArray(latestBarcodes) &&
                latestBarcodes.map((barcode, index) => (
                  <tr key={index} onClick={() => openManuallyWindow(barcode)}>
                    <td>{barcode.barcode}</td>
                    <td style={{ textAlign: 'right' }}>{barcode.qty}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <>
        {isOpen ? (
          <>
            <div className='overlay' onClick={closeManuallyWindow}></div>
            <div className='Add-Manually-Window'>
              <h1>Delete</h1>
              <button className='CloseWindow' onClick={closeManuallyWindow}>
              <img src={CloseMenuIcon} alt='close'></img>
              </button>
              <p>Are you sure you want to delete <br /> <b>{selectedBarcode}</b>  ?</p>
              {selectedBarcode && (
                <>
                  {selectedQty > 0 ? (
                    <div>
                    <button className='deletebtn' onClick={() => handleDelete('DeleteOnce')}>
                      Delete 1 Qty
                    </button>
                    <button className='deletebtn' onClick={() => handleDelete('DeleteBarcode')}>
                      Delete Barcode
                    </button>
                    </div>
                  ) : (
                    <div>
                    <button className='deletebtn' onClick={() => handleDelete('DeleteBarcode')}>
                      Delete Barcode
                    </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : null}
      </>
    </div>
  );
}

export default Codes;

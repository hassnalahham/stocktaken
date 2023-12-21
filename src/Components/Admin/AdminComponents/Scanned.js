import React, { useState, useEffect } from 'react';
import '../../Style/Codes.css';

function Codes() {
  const [latestBarcodes, setLatestBarcodes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [selectedQty, setSelectedQty] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleDownload = () => {
    // Trigger the download by making a request to the PHP script
    const downloadUrl = 'http://localhost/scannerapp/src/Components/Admin/AdminComponents/Connection//DownloadCode.php'; // Replace with your actual backend URL

    // Create a hidden link and click it to initiate the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'ST.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleDelete = (option) => {
    console.log(`Deleting ${option} for barcode ${selectedBarcode}`);
      fetch('http://localhost/scannerapp/src/Components/Connection/DeleteBarcode.php', {
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

  const fetchLatestBarcodes = () => {
    // Fetch the latest barcodes from the server
    fetch('http://localhost/scannerapp/src/Components/Admin/AdminComponents/Connection/GetScannedBarcodes.php', {
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
      <h1>Scanned Barcodes</h1>
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
                X
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
      <div>
        <button className='downloadbtn' onClick={handleDownload}>Download Codes</button>
      </div>
    </div>
  );
}

export default Codes;

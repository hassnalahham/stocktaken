import React, { useState, useEffect } from 'react';
import '../../Style/Codes.css';

function Reports() {
  const [latestBarcodes, setLatestBarcodes] = useState([]);
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [isOpen, setIsOpen] = useState(false);


  const openManuallyWindow = (barcode) => {
    setSelectedBarcode(barcode);
    setIsOpen(true);
  };

  const closeManuallyWindow = () => {
    setSelectedBarcode(null);
    setIsOpen(false);
  };

  const handleDownload = () => {
    // Trigger the download by making a request to the PHP script
    const downloadUrl = 'http://localhost/scannerapp/src/Components/Admin/AdminComponents/Connection//DownloadReports.php'; // Replace with your actual backend URL

    // Create a hidden link and click it to initiate the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'ST.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const fetchLatestBarcodes = () => {
    // Fetch the latest barcodes from the server
    fetch('http://localhost/scannerapp/src/Components/Admin/AdminComponents/Connection/GetReports.php', {
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
      <>
        {isOpen ? (
          <>
            <div className='overlay' onClick={closeManuallyWindow}></div>
            <div className='Add-Manually-Window'>
              <h1>Barcode</h1>
              <button className='CloseWindow' onClick={closeManuallyWindow}>X</button>
                <p>This Barcode <b>{selectedBarcode.barcode}</b> Associated with <b>{selectedBarcode.userId}</b></p>
                <button className='bluebtn' onClick={closeManuallyWindow}>Ok</button>
            </div>
          </>
        ) : null }
      </>
      <h1>Reports</h1>
      {/* ... (other JSX code) */}
      <div className='CodesDiv'>
        <div className='CodesChild'>
          <table>
            {/* ... (your existing table structure) */}
            <tbody>
              {Array.isArray(latestBarcodes) &&
                latestBarcodes.map((barcode, index) => (
                  <tr key={index} onClick={() => openManuallyWindow(barcode)} className={barcode.qty == barcode.oqty ? 'greendiv' : barcode.qty > barcode.oqty ? 'reddiv' : ''}>
                    <td>{barcode.barcode}</td>
                    <td style={{ textAlign: 'right' }}>{barcode.dqty === 0 ? <p>Reached</p>: <p>{barcode.qty} / {barcode.oqty}</p>}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <button className='bluebtn' onClick={handleDownload}>Download Report</button>
      </div>
    </div>
  );
}

export default Reports;

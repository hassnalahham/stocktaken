import React, { useState } from 'react';
import CloseMenuIcon from '../../Assest/Images/b_x.svg';

function DeleteSession() {
  const [endAsk, setEndAsk] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const OpenAskWindow = () => {
    setEndAsk(true);
  };

  const closeAskWindow = () => {
    setEndAsk(false);
  };

  const DownloadReports = () =>{
    handleDownloadReports();
    handleDownloadRMA();
    handleDownloadScanned();
    setDownloaded(true);
  }

  const handleDownloadScanned = () => {
    // Trigger the download by making a request to the PHP script
    const downloadUrl = 'https://scannerst.pro/Components/Admin/AdminComponents/Connection//DownloadCode.php'; // Replace with your actual backend URL

    // Create a hidden link and click it to initiate the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'ST.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadReports = () => {
    // Trigger the download by making a request to the PHP script
    const downloadUrl = 'https://scannerst.pro/Components/Admin/AdminComponents/Connection//DownloadReports.php'; // Replace with your actual backend URL

    // Create a hidden link and click it to initiate the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'ST.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleDownloadRMA = () => {
    // Trigger the download by making a request to the PHP script
    const downloadUrl = 'https://scannerst.pro/Components/Admin/AdminComponents/Connection//DownloadRMAReport.php'; // Replace with your actual backend URL

    // Create a hidden link and click it to initiate the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'ST.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleEnd = () => {
    fetch('https://scannerst.pro/Components/Admin/AdminComponents/Connection/DeleteSession.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.status === 'success') {
                setSuccess(true);
                setErrorMessage(data.message);
                closeAskWindow();
            } else if (data.status === 'error') {
                setErrorMessage(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setErrorMessage('An unexpected error occurred.');
        });
  };

  return (
    <div className='UsersDiv'>
        {errorMessage && (
        <div className={success ? "success-popup" : "error-popup"}>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('') && setSuccess(false)}>Close</button>
        </div>
      )}
    
      <div>
        <button onClick={() => OpenAskWindow()} className='redbtn'>End Session</button>
      </div>

      {endAsk ? 
      <>
      <div className='overlay' onClick={closeAskWindow}></div>
          <div className='edit-user'>
            <h1>End Session</h1>
            <button className='CloseWindow' onClick={closeAskWindow}>
            <img src={CloseMenuIcon}></img>
            </button>
              <>
               <p>Are You Sure You want to End the Session ? All Scanned Barcode Will be deleteed Make sure you downloaded all the reports before ending the session</p>
                <div className='doublebtnDiv'>
                <button className='geenbtn' onClick={DownloadReports} disabled={downloaded ? true : false}>
                     Download All Reports
                  </button>
                  <button className='redbtn' onClick={handleEnd}>
                     Yes
                  </button>
                  <button className='bluebtn' onClick={closeAskWindow}>
                     No
                  </button>
                </div>
              </>
          </div>
      </> :null}
    </div>
  );
}

export default DeleteSession;

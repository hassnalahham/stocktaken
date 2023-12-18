import React, { useState, useEffect } from 'react';
import './Style/LeatestAdd.css';

function LastAdded() {
  const [latestBarcodes, setLatestBarcodes] = useState([]);

  const fetchLatestBarcodes = () => {
    // Fetch the latest barcodes from the server
    fetch('http://localhost/scannerapp/src/Components/Connection/GetBarcode.php')
      .then(response => response.json())
      .then(data => {
        setLatestBarcodes(data); // Assuming the server response is an array of barcode strings
      })
      .catch(error => {
        console.error('Error fetching latest barcodes:', error);
      });
  };

  useEffect(() => {
    // Fetch initially
    fetchLatestBarcodes();

    // Set up polling with a specified interval (e.g., every 5 seconds)
    const intervalId = setInterval(() => {
      fetchLatestBarcodes();
    }, 500); // Adjust the interval as needed (in milliseconds)

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures the effect runs only once on mount

  // Limit the displayed rows to the latest 5 barcodes
  const limitedBarcodes = latestBarcodes.slice(0, 5);
  return (
    <div className='LatestDiv'>
      {limitedBarcodes .map((barcode, index) => (
        <div key={index} className='Latestchild'>
          <p>{barcode}</p>
        </div>
      ))}
    </div>
  );
}

export default LastAdded;

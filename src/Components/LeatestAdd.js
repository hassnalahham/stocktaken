import React, { useState, useEffect } from 'react';
import './Style/LeatestAdd.css';

function LastAdded() {
  const [latestBarcodes, setLatestBarcodes] = useState([]);

  const fetchLatestBarcodes = async () => {
    try {
      const response = await fetch('http://192.168.1.134/scannerapp/src/Components/Connection/GetBarcode.php', {
        credentials: 'include', // Include credentials
      });
      const data = await response.json();
  
      if (response.ok) {
        // Check if the data is an array
        if (Array.isArray(data)) {
          setLatestBarcodes(data);
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
  if (latestBarcodes.length === 0) {
    return <p>Loading...</p>;
  }

  // Limit the displayed rows to the latest 5 barcodes
  const limitedBarcodes = latestBarcodes.slice(0, 5);

  return (
    <div className='LatestDiv'>
      {limitedBarcodes.map((barcode, index) => (
        <div key={index} className='Latestchild'>
          <p>{barcode}</p>
        </div>
      ))}
    </div>
  );
}

export default LastAdded;

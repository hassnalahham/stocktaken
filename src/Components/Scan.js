import Barcoder from './BarcodeScanner';
import LastAdded from './LeatestAdd';
import Manually from './Manually';
import React from 'react';
function Scan() {
  return (
     <>
       <Barcoder/>
       <LastAdded/>
       <Manually/>
     </>
  );
}

export default Scan;

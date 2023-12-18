import React from 'react';
import Barcoder from './BarcoderScan';
import LastAdded from './LeatestAdd';
import Manually from './Manually';

function Scan() {
  
  

  return (
    <>
      <Barcoder />
      <LastAdded/>
      <Manually />
    </>
  );
}

export default Scan;

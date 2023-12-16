import React, { useState } from 'react';
import './Style/AddManualy.css';

function AddManualy() {
  const [isOpen, setIsOpen] = useState(false);

  const openManuallyWindow = () => {
    setIsOpen(true);
  };

  const closeManuallyWindow = () => {
    setIsOpen(false);
  };

  return (
    <>
      

      {isOpen ? (
        <>
        <div className='overlay' onClick={closeManuallyWindow}></div>
        <div className='Add-Manually-Window'>
            <h1>Add Manually</h1>
            <button className='CloseWindow' onClick={closeManuallyWindow} >X</button>
          <form>
            <input type='text' placeholder='ASIN' />
            <input type='number' placeholder='QTY' />
            <button className='bluebtn' onClick={closeManuallyWindow}>
              Add
            </button>
          </form>
        </div>
        </>
      ) : <button className='bluebtn' onClick={openManuallyWindow}>
             Add Manually
         </button>}
    </>
  );
}

export default AddManualy;

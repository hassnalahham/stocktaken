import './Style/Profile.css';
import PrfoileImg from './profile.png';
import React from 'react';

function Profile() {
  return (
     <div className='Profile'>
        <div className='ImgDiv'>
            <img src={PrfoileImg}/>
        </div>
        <div className='InfoDiv'>
           <div className='InfoChild'>
             <p>Full Name : Mohamad Ahmed</p>
           </div>
           <div className='InfoChild'>
             <p>Scanned : 1269</p>
           </div>
           <div className='InfoChild'>
             <p>Unieq : 193</p>
           </div>
           <div className='InfoChild'>
             <p>Status : Active</p>
           </div>
        </div>
        <div>
            <button className='downloadbtn'>Download Codes</button>
        </div>
     </div>
  );
}

export default Profile;

import React from 'react';
import { Link } from 'react-router-dom';


import cryptalballz from '../assets/cryptalballz.png'


import './Footer.css'



function Footer() {



  return (
    <>
      <nav className='navbar'>
          <div className='container'>
          <Link to='/'>
           <div className='logo'>CryptalBallz <img style={{height: '45px'}} src={cryptalballz} alt="cryptalballz" /> </div>
          </Link>
          <ul className='nav'>
                  <li className='copy-right'>
                    <>©2023 CryptalBallz, All Rights Reserved.</>
                  </li>
              </ul>
              
              <ul className='nav'>
                  <li>
                  <Link to='/Prediction'>
                    <>Prediction </>
                  </Link>
                  </li>

              </ul>
          </div>
      </nav>
      
    </>
  );
}


export default Footer

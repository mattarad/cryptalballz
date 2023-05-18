import React from 'react';
// import React, { useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import { createStructuredSelector } from 'reselect'


import {
  accountSelector,
  balanceSelector,
  networkSelector,
  web3Selector
} from '../../store/selectors'


import eth from '../assets/eth.png'
import cryptalballz from '../assets/cryptalballz.png'
import metaMaskImg from '../assets/metamask.png'


import './Navbar.css'



function Navbar(props) {



  return (
    <>
      <nav className='navbar'>
          <div className='container'>
          <Link to='/'>
           <div className='logo'>CryptalBallz <img style={{height: '45px'}} src={cryptalballz} alt="cryptalballz" /> </div>
          </Link>
              
              
              <ul className='nav'>
                  <li>
                  <Link to='/Prediction'>
                    <>Prediction </>
                  </Link>
                  </li>
                  {/* <li>
                      <a href='#'>About</a>
                  </li>
                  <li>
                      <a href='#'>Contact</a>
                  </li> */}
              </ul>
          </div>
      </nav>
      <header className='header'>
        {props.account !== undefined || props.account !== null ? 
        <div className='nav-account-wrapper'>
          <ul className='nav-account'>
                  <p>{props.account === undefined || props.account === null ?
                                  <li style={{marginTop:'2px'}}>
                                  {props.web3
                                    ? <button
                                      type="Success"
                                      // className="btn btn-outline btn-block "
                                      className="btn-primary"
                                      style={{ borderRadius: '7px' }}
                                      onClick={async () => {
                                        try {
                                          await window.ethereum.enable()
                                        } catch (e) {
                                          console.log(e)
                                        }
                                      }}
                                    > &nbsp;
                                      <img src={metaMaskImg} alt="metamask logo" className="icon-wallet mr-md-2" height="20px" />
                
                                      connect &nbsp;
                                    </button>
                                    : <button
                                      // className="btn btn-warning"
                                      className="btn-primary"
                                      style={{ borderRadius: '7px' }}
                                      type="button"
                                      onClick={() => {
                                        try {
                                          window.open("https://metamask.io/")
                                        } catch (e) {
                                          console.log(e)
                                        }
                                      }}
                                    > &nbsp;
                                      <img src={metaMaskImg} alt="metamask logo" className="icon-wallet mr-md-2" height="20px" />
                
                                      Get MetaMask  &nbsp;
                                    </button>
                                  }
                                </li>
                  : '...' + props.account.substring(38, 42) + ' '} {props.account ? <i className="fas fa-wallet"></i>  : '' } </p>
              <li>
                  <p>{props.balance + ' '}<img style={{height: '15px'}} src={eth} alt="eth" /></p>
              </li>
              <li>
                  <p>{props.network}</p>
              </li>
          </ul>
        </div>
        :
        <div className='nav-account-wrapper'>
          <ul className='nav-account'>
              <li>
                  <p>{'loading'}<i className="fas fa-wallet"></i></p>
              </li>
              <li>
                  <p>{0}<img src={eth} alt="eth" /></p>
              </li>
              <li>
                  <p>{'undefined'}</p>  
              </li>
          </ul>
        </div>
        }
      </header>
    </>
  );
}


const mapStateToProps =  createStructuredSelector({
  web3: web3Selector,
  account: accountSelector,
  network: networkSelector,
  balance: balanceSelector,
})

export default connect(mapStateToProps)(Navbar)

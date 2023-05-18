import React, { Component } from 'react';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { update } from '../../store/interactions';


import {
  accountSelector,
  balanceSelector,
  networkSelector,
  web3Selector
} from '../../store/selectors'


import FunSheebaCryptalballs from '../assets/sheeba-cryptalballs.svg'
// import token_logo from '../assets/eth.png'
// import eth from '../assets/eth.png'
// import matic from '../assets/matic-token.png'
// import metaMaskImg from '../assets/metamask.png';

import './Home.css'

import Navbar from '../Navbar/Navbar';

import About from './About/About'
// import Countdown from './Countdown/Countdown';



import Footer from '../Footer/Footer';



class Home extends Component {

  async UNSAFE_componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    /* Case 1, User connect for 1st time */
    if (typeof window.ethereum !== 'undefined') {
      await update(dispatch)
      /* Case 2 - User switch account */
      window.ethereum.on('accountsChanged', async () => {
        await update(dispatch)
      });
      /* Case 3 - User switch network */
      window.ethereum.on('chainChanged', async () => {
        await update(dispatch)
      });
    }
  }

  // const [click, setClick] = useState(false);
  // const handleClick = () => setClick(!click);

  render() {
    return (
      <>
        <Navbar />
        <div className='home-container'> <h1> WELCOME TO CryptalBallz! </h1></div>
        <div className='home-container'> <h5> such wow predictions </h5></div>
        <hr />
  
        <div className='home-container'> <img className='image-logo' src={FunSheebaCryptalballs} alt="FunSheebaCryptalballs" /> </div>
  
        <About />
  
        {/* <Countdown /> */}
  
        <Footer />
  
      </>
    );
  }
}


const mapStateToProps =  createStructuredSelector({
  web3: web3Selector,
  account: accountSelector,
  network: networkSelector,
  balance: balanceSelector
})

export default connect(mapStateToProps)(Home)

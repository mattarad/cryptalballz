import React, { Component } from 'react';
import { connect } from 'react-redux'

import { update } from '../../store/interactions';
import { predictionUpdate, NoWeb3PredictionUpdate } from '../../store/prediction/interactions';
import Footer from '../Footer/Footer';


import Navbar from '../Navbar/Navbar';
import ActivePredictions from './ActivePredictions/ActivePredictions';
import ClosedPredictions from './ClosedPredictions/ClosedPredictions';
import SettledPredictions from './SettledPredictions/SettledPredictions';


class Prediction extends Component {

  async UNSAFE_componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    /* Case 1, User connect for 1st time */
    if (typeof window.ethereum !== 'undefined') {
      await update(dispatch)
      await predictionUpdate(dispatch)
      /* Case 2 - User switch account */
      window.ethereum.on('accountsChanged', async () => {
        await update(dispatch)
        await predictionUpdate(dispatch)
      });
      /* Case 3 - User switch network */
      window.ethereum.on('chainChanged', async () => {
        await update(dispatch)
        await predictionUpdate(dispatch)
      });
    } else {
        await NoWeb3PredictionUpdate(dispatch)
    }
  }

  render() {
    return (
      <>
        <Navbar />
        <div>
          <h4 style={{textAlign:'center'}}>ACTIVE MARKETS</h4>
          <hr />
          <ActivePredictions />
        <br />
        </div>
        <div>
          <h4 style={{textAlign:'center'}}>CLOSED MARKETS</h4>
          <hr />
          <ClosedPredictions />
        <br />
        </div>
        <div>
          <h4 style={{textAlign:'center'}}>SETTLED MARKETS</h4>
          <hr />
          <SettledPredictions />
        <br />
        </div>
        <div>
          <Footer />
        </div>
      </>
    );
  }
}


export default connect()(Prediction)

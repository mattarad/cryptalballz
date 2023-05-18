import React, { useState } from 'react';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { activeMarketsSelector, weightedAveragesSelector } from '../../../store/prediction/selectors'
import { makePrediction, withdrawPrediction } from '../../../store/prediction/interactions'


import Countdown from '../Countdown/Countdown';

import './ActivePredictions-styles.css'



const ActivePredictions = props => {

    // const [withdrawAmount, setWithdrawAmount] = useState()
    const [yesPredictionAmount, setYesPredictionAmount] = useState()
    const [noPredictionAmount, setNoPredictionAmount] = useState()
  
    // const [togglePrediction, setTogglePrediction] = useState(false)
    // const handleClick = () => setTogglePrediction(!togglePrediction)

    const renderWeightedAVG = market => {
        if(props.weightedAverages === undefined || props.weightedAverages === null) {
            return (<div>loading... or connect wallet</div>)
        } else if(props.weightedAverages[market.id - 1].predictionAmount > 0) {
            if(props.weightedAverages[market.id - 1].prediction) {
                return (
                    <div className='user-info'>
                        <div>user info:</div>
                        <div className='row-for-columns'>
                            <div className='active-market-columns'>
                                <div>{'predicted: '} </div>
                                <div>{'deposited: ' }</div>
                                <div>{'weighted avg: '}</div>
                                <div>{'max payout: ' }</div>
                            </div>
                            <div className='active-market-columns'>
                                <div>{'yes'}</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount)/ 10**18)).toFixed(5) }</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount / market.noBalance))).toFixed(4)}</div>
                                <div>{((market.totalBalance * (props.weightedAverages[market.id - 1].predictionAmount / market.noBalance)/ 10**18)).toFixed(5) }</div>
                            </div>
                        </div>
                        <button
                            className="btn-primary"
                            style={{ borderRadius: '7px' }}
                            type="button"
                            onClick={() => {
                            try {
                                withdrawPrediction(props.dispatch, market.id);
                                } catch (e) {
                                    console.log(e)
                                }
                            }}
                            > &nbsp;
                            withdraw prediction  &nbsp;
                        </button>
                    </div>
                )
            } else {
                return (
                    <div className='user-info'>
                        <div>user info:</div>
                        <div className='row-for-columns'>
                            <div className='active-market-columns'>
                                <div>{'predicted: '} </div>
                                <div>{'deposited: ' }</div>
                                <div>{'weighted avg: '}</div>
                                <div>{'max payout: ' }</div>
                            </div>
                            <div className='active-market-columns'>
                                <div>{'no'}</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount)/ 10**18)).toFixed(5) }</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount / market.noBalance))).toFixed(4)}</div>
                                <div>{((market.totalBalance * (props.weightedAverages[market.id - 1].predictionAmount / market.noBalance)/ 10**18)).toFixed(5) }</div>
                            </div>
                        </div>
                        <button
                            className="btn-primary"
                            style={{ borderRadius: '7px' }}
                            type="button"
                            onClick={() => {
                            try {
                                withdrawPrediction(props.dispatch, market.id);
                                } catch (e) {
                                    console.log(e)
                                }
                            }}
                            > &nbsp;
                            withdraw prediction  &nbsp;
                        </button>
                    </div>
                )
            }
        } else {
            return (
                <div className='user-info'>
                <div>user info:</div>
                <div className='row-for-columns'>
                    <div className='active-market-columns'>
                        <div>{'predicted: '} </div>
                        <div>{'deposited: ' }</div>
                        <div>{'weighted avg: '}</div>
                        <div>{'max payout: ' }</div>
                    </div>
                    <div className='active-market-columns'>
                        <div>{' - '}</div>
                        <div>{' - '}</div>
                        <div>{' - '}</div>
                        <div>{' - '}</div>
                    </div>
                </div>
            </div>
            )
        }
    }


    return (
            <>
            {props.activeMarkets === undefined
                ? <div>loading...</div>
                : <div className='active-container'>{props.activeMarkets[1].map((market, key) => {
                    return (
                        <div className='active-market-card' key={key}>
                            <h6 style={{marginTop:'0px'}}>{market.predictionPhrase}</h6>
                            <hr style={{margin:'5px'}}/>

                            <div className='row-for-columns'>
                            <div className='active-market-columns'>
                                <div>{'users: '}</div>
                                <div>{'volume: '}</div>
                            </div>
                            <div className='active-market-columns'>
                                <div>{market.totalUserNumber}</div>
                                <div>{(market.totalBalance / 10**18).toFixed(3) + ' Eth'}</div>
                            </div>
                            </div>
                            <div className='row-for-columns'>
                            <div className='active-market-columns'>
                                <div>-</div>
                                <div>bal in ETH: </div>
                                <div>users:</div>
                            </div>
                            <div className='active-market-columns'>
                                <div>no</div>
                                <div>{ (market.noBalance / 10**18).toFixed(3)}</div>
                                <div>{market.noUserNumber}</div>
                                </div>
                            <div className='active-market-columns'>
                                <div>yes</div>
                                <div>{(market.yesBalance / 10**18).toFixed(3)}</div>
                                <div>{market.yesUserNumber}</div>
                            </div>
                            </div>
                            <div>predict</div>
                            <hr style={{margin:'0px'}}/>
                            <div className='row-for-columns'>
                            
                            <div className='active-market-columns'>
                                {/* <div>no</div> */}

                            </div>
                            <div className='active-market-columns'>
                                {/* <div>yes</div> */}
                            </div>
                            </div>

                            <div className='row-for-columns'>
                                <div className='active-market-columns'>
                                    <form className='active-form'
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            makePrediction(props.dispatch, market.id, false, noPredictionAmount);
                                        }}
                                        >
                                        <input style={{width:'70px'}}
                                            value={noPredictionAmount}
                                            onChange={e => setNoPredictionAmount(e.target.value)}
                                            placeholder='no amnt'
                                            required
                                        />

                                        <button  type='submit' className='btn-primary' style={{marginTop:'0px'}} >
                                            no!
                                        </button>
                                    </form>
                                </div>
                                <div className='active-market-columns'>
                                    <form className='active-form'
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            makePrediction(props.dispatch, market.id, true, yesPredictionAmount);
                                        }}
                                        >
                                        <input style={{width:'70px'}}
                                            value={yesPredictionAmount}
                                            onChange={e => setYesPredictionAmount(e.target.value)}
                                            placeholder='yes amnt'
                                            required
                                        />
                                        <button  type='submit' className='btn-primary' style={{marginTop:'0px'}} >
                                            yes!
                                        </button>
                                    </form>
                                </div>
                            </div>
                            {
                            props.weightedAverages === undefined || props.weightedAverages === null || props.weightedAverages[market.id - 1] === undefined
                            ? <div>loading/connect wallet</div>
                            : renderWeightedAVG(market)
                            }

                            <Countdown difference={(market.endBlock * 1000) }/>

                        </div>
                    )
                })}</div>
            }
            
            </>
        )
}

const mapStateToProps =  createStructuredSelector({
    activeMarkets: activeMarketsSelector,
    weightedAverages: weightedAveragesSelector,
})

export default connect(mapStateToProps)(ActivePredictions)

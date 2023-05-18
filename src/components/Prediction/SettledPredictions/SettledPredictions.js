import React from 'react';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { settledMarketsSelector, weightedAveragesSelector } from '../../../store/prediction/selectors'
import { claim } from '../../../store/prediction/interactions'


import './SettledPredictions-styles.css'



const SettledPredictions = props => {

    const renderWeightedAVG = market => {
        let marketSettlement = market.settlement === 0 ? true : false
        console.log(marketSettlement)
        console.log(props.weightedAverages[market.id - 1].prediction)
        
        if(props.weightedAverages === undefined || props.weightedAverages === null) {
            return (<div>loading... </div>)
        } else if(props.weightedAverages[market.id - 1].predictionAmount > 0) {
            if(props.weightedAverages[market.id - 1].prediction) {
                return (
                    <div className='user-info'>
                        <div>user info:</div>
                        <div className='row-for-columns'>
                            <div className='settled-market-columns'>
                                <div>{'predicted: '} </div>
                                <div>{'deposited: ' }</div>
                                <div>{'weighted avg: '}</div>
                                <div>{'max payout: ' }</div>
                            </div>
                            <div className='settled-market-columns'>
                                <div>{'yes'}</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount)/ 10**18)).toFixed(5) }</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount / market.noBalance))).toFixed(4)}</div>
                                <div>{((market.totalBalance * (props.weightedAverages[market.id - 1].predictionAmount / market.noBalance)/ 10**18)).toFixed(5) }</div>
                            </div>
                        </div>
                            {
                                props.weightedAverages[market.id - 1].prediction === marketSettlement && !props.weightedAverages[market.id - 1].paidOut
                                ? 
                                <button
                                    className="btn-primary"
                                    style={{ borderRadius: '7px' }}
                                    type="button"
                                    onClick={() => {
                                    try {
                                        claim(props.dispatch, market.id);
                                        } catch (e) {
                                            console.log(e)
                                        }
                                    }}
                                    > &nbsp;
                                    claim!  &nbsp;
                                </button>
                                : <></>
                            }
                    </div>
                )
            } else {
                return (
                    <div className='user-info'>
                        <div>user info:</div>
                        <div className='row-for-columns'>
                            <div className='settled-market-columns'>
                                <div>{'predicted: '} </div>
                                <div>{'deposited: ' }</div>
                                <div>{'weighted avg: '}</div>
                                <div>{'max payout: ' }</div>
                            </div>
                            <div className='settled-market-columns'>
                                <div>{'no'}</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount)/ 10**18)).toFixed(5) }</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount / market.noBalance))).toFixed(4)}</div>
                                <div>{((market.totalBalance * (props.weightedAverages[market.id - 1].predictionAmount / market.noBalance)/ 10**18)).toFixed(5) }</div>
                            </div>
                        </div>
                            {
                                props.weightedAverages[market.id - 1].prediction === marketSettlement && !props.weightedAverages[market.id - 1].paidOut
                                ? 
                                <button
                                    className="btn-primary"
                                    style={{ borderRadius: '7px' }}
                                    type="button"
                                    onClick={() => {
                                    try {
                                        claim(props.dispatch, market.id);
                                        } catch (e) {
                                            console.log(e)
                                        }
                                    }}
                                    > &nbsp;
                                    claim!  &nbsp;
                                </button>
                                : <></>
                            }
                    </div>
                )
            }
        } else {
            return (
                <div className='user-info'>
                <div>user info:</div>
                <div className='row-for-columns'>
                    <div className='settled-market-columns'>
                        <div>{'predicted: '} </div>
                        <div>{'deposited: ' }</div>
                        <div>{'weighted avg: '}</div>
                        <div>{'max payout: ' }</div>
                    </div>
                    <div className='settled-market-columns'>
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
            {props.settledMarkets === undefined
                ? <div>loading...</div>
                : <div className='settled-container'>{props.settledMarkets[1].map((market, key) => {
                    return (
                        <div className='settled-market-card' key={key}>
                            <h6>{market.predictionPhrase}</h6>
                            <hr style={{margin:'5px'}}/>

                            <div className='row-for-columns'>
                            <div className='settled-market-columns'>
                                <div>{'users: '}</div>
                                <div>{'volume: '}</div>
                            </div>
                            <div className='settled-market-columns'>
                                <div>{market.totalUserNumber}</div>
                                <div>{(market.totalBalance / 10**18).toFixed(3) + ' Eth'}</div>
                            </div>
                            </div>
                            <div className='row-for-columns'>
                            <div className='settled-market-columns'>
                                <div>-</div>
                                <div>bal in ETH: </div>
                                <div>users:</div>
                            </div>
                            <div className='settled-market-columns'>
                                <div>no</div>
                                <div>{ market.noBalance / 10**18}</div>
                                <div>{market.noUserNumber}</div>
                                </div>
                            <div className='settled-market-columns'>
                                <div>yes</div>
                                <div>{market.yesBalance / 10**18}</div>
                                <div>{market.yesUserNumber}</div>
                            </div>
                            </div>
                            <hr style={{margin:'0px'}}/>


                            {
                            props.weightedAverages === undefined || props.weightedAverages === null || props.weightedAverages[market.id - 1] === undefined
                            ? <div>loading/connect wallet</div>
                            : renderWeightedAVG(market)
                            }
                            <div>SETTLED: {market.settlement === '0' ? 'YES' : 'NO'} </div>


                        </div>
                    )
                })}</div>
            }
            
            </>
        )
}

const mapStateToProps =  createStructuredSelector({
    settledMarkets: settledMarketsSelector,
    weightedAverages: weightedAveragesSelector,
})

export default connect(mapStateToProps)(SettledPredictions)

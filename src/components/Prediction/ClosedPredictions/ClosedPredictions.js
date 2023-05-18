import React from 'react';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { closedMarketsSelector, weightedAveragesSelector } from '../../../store/prediction/selectors'

import './ClosedPredictions-styles.css'



const ClosedPredictions = props => {

    const renderWeightedAVG = market => {
        if(props.weightedAverages === undefined || props.weightedAverages === null) {
            return (<div>loading... or connect wallet</div>)
        } else if(props.weightedAverages[market.id - 1].predictionAmount > 0) {
            if(props.weightedAverages[market.id - 1].prediction) {
                return (
                    <div className='user-info'>
                        <div>user info:</div>
                        <div className='row-for-columns'>
                            <div className='closed-market-columns'>
                                <div>{'predicted: '} </div>
                                <div>{'deposited: ' }</div>
                                <div>{'weighted avg: '}</div>
                                <div>{'max payout: ' }</div>
                            </div>
                            <div className='closed-market-columns'>
                                <div>{'yes'}</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount)/ 10**18)).toFixed(5) }</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount / market.noBalance))).toFixed(4)}</div>
                                <div>{((market.totalBalance * (props.weightedAverages[market.id - 1].predictionAmount / market.noBalance)/ 10**18)).toFixed(5) }</div>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className='user-info'>
                        <div>user info:</div>
                        <div className='row-for-columns'>
                            <div className='closed-market-columns'>
                                <div>{'predicted: '} </div>
                                <div>{'deposited: ' }</div>
                                <div>{'weighted avg: '}</div>
                                <div>{'max payout: ' }</div>
                            </div>
                            <div className='closed-market-columns'>
                                <div>{'no'}</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount)/ 10**18)).toFixed(5) }</div>
                                <div>{(((props.weightedAverages[market.id - 1].predictionAmount / market.noBalance))).toFixed(4)}</div>
                                <div>{((market.totalBalance * (props.weightedAverages[market.id - 1].predictionAmount / market.noBalance)/ 10**18)).toFixed(5) }</div>
                            </div>
                        </div>
                    </div>
                )
            }
        } else {
            return (
                <div className='user-info'>
                <div>user info:</div>
                <div className='row-for-columns'>
                    <div className='closed-market-columns'>
                        <div>{'predicted: '} </div>
                        <div>{'deposited: ' }</div>
                        <div>{'weighted avg: '}</div>
                        <div>{'max payout: ' }</div>
                    </div>
                    <div className='closed-market-columns'>
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
            {props.closedMarkets === undefined
                ? <div>loading...</div>
                : <div className='closed-container'>{props.closedMarkets[1].map((market, key) => {
                    return (
                        <div className='closed-market-card' key={key}>
                            <h6>{market.predictionPhrase}</h6>
                            <hr style={{margin:'5px'}}/>

                            <div className='row-for-columns'>
                            <div className='-market-columns'>
                                <div>{'users: '}</div>
                                <div>{'volume: '}</div>
                            </div>
                            <div className='-market-columns'>
                                <div>{market.totalUserNumber}</div>
                                <div>{(market.totalBalance / 10**18).toFixed(3) + ' Eth'}</div>
                            </div>
                            </div>
                            <div className='row-for-columns'>
                            <div className='closed-market-columns'>
                                <div>-</div>
                                <div>bal: </div>
                                <div>users:</div>
                            </div>
                            <div className='closed-market-columns'>
                                <div>no</div>
                                <div>{ market.noBalance / 10**18}</div>
                                <div>{market.noUserNumber}</div>
                                </div>
                            <div className='closed-market-columns'>
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
                            <div>CLOSED</div>


                        </div>
                    )
                })}</div>
            }
            
            </>
        )
}

const mapStateToProps =  createStructuredSelector({
    closedMarkets: closedMarketsSelector,
    weightedAverages: weightedAveragesSelector,
})

export default connect(mapStateToProps)(ClosedPredictions)

import { createSelector } from 'reselect'
import { get } from 'lodash'


const predictionContract = state => get(state, 'predictionReducer.predictionContract.contract')
export const predictionContractSelector = createSelector(predictionContract, c => c)

const allMarketData = state => get(state, 'predictionReducer.predictionContract.markets')
export const allMarketDataSelector = createSelector(allMarketData, d => d)

const activeMarkets = state => get(state, 'predictionReducer.predictionContract.active')
export const activeMarketsSelector = createSelector(activeMarkets, n => n)

const closedMarkets = state => get(state, 'predictionReducer.predictionContract.closed')
export const closedMarketsSelector = createSelector(closedMarkets, n => n)

const settledMarkets = state => get(state, 'predictionReducer.predictionContract.settled')
export const settledMarketsSelector = createSelector(settledMarkets, n => n)

const weightedAverages = state => get(state, 'predictionReducer.predictionContract.weighted')
export const weightedAveragesSelector = createSelector(weightedAverages, n => n)



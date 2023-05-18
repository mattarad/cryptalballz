import { combineReducers } from 'redux';

import predictionReducer from './prediction/reducers'


function web3(state = {}, action) {
  switch (action.type) {
    case 'WEB3_LOADED':
      return { ...state, connection: action.connection }
    case 'WEB3_NETWORK_LOADED':
      return { ...state, network: action.network }
    case 'WEB3_ACCOUNT_LOADED':
      return { ...state, account: action.account }
    case 'WEB3_BALANCE_LOADED':
      return { ...state, balance: action.balance }
    default:
      return state
  }
}


const rootReducer = combineReducers({
  web3,
  predictionReducer
})

export default rootReducer
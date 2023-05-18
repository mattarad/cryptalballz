import { combineReducers } from 'redux';

export function predictionContract(state = {}, action) {
  switch (action.type) {
    case 'PRED_CONTRACT_LOADED':
      return { ...state, loaded: true, contract: action.contract }
    case 'PRED_MARKETS_LOADED':
      return { ...state, loaded: true, markets: action.markets }
    case 'ACTIVE_MARKETS_LOADED':
      return { ...state, loaded: true, active: action.active }
    case 'CLOSED_MARKETS_LOADED':
      return { ...state, loaded: true, closed: action.closed }
      case 'SETTLED_MARKETS_LOADED':
        return { ...state, loaded: true, settled: action.settled }
        case 'WEIGHTED_AVERAGES_LOADED':
          return { ...state, loaded: true, weighted: action.weighted }
    default:
      return state
  }
}


const predictionReducer = combineReducers({
  predictionContract,
})

export default predictionReducer
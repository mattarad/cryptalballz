export function predictionContractLoaded(contract) {
  return {
    type: 'PRED_CONTRACT_LOADED',
    contract
  }
}

export function predMarketsLoaded(markets) {
  return {
    type: 'PRED_MARKETS_LOADED',
    markets
  }
}

export function activeMarketsLoaded(active) {
  return {
    type: 'ACTIVE_MARKETS_LOADED',
    active
  }
}

export function closedMarketsLoaded(closed) {
  return {
    type: 'CLOSED_MARKETS_LOADED',
    closed
  }
}

export function settledMarketsLoaded(settled) {
  return {
    type: 'SETTLED_MARKETS_LOADED',
    settled
  }
}

export function weightedAveragesLoaded(weighted) {
  return {
    type: 'WEIGHTED_AVERAGES_LOADED',
    weighted
  }
}
import Prediction from '../../backEnd/abis/Prediction.json'
import Web3 from 'web3'

import { update, loadWeb3, loadAccount } from '../interactions'

import {
  predictionContractLoaded,
  predMarketsLoaded,
  activeMarketsLoaded,
  closedMarketsLoaded,
  settledMarketsLoaded,
  weightedAveragesLoaded,
} from './actions'

require('dotenv').config();

export const loadpredictionContract = async (dispatch, web3, netId) => {
  try {
    console.log(Prediction.networks[netId].address)
    const prediction = new web3.eth.Contract(Prediction.abi, Prediction.networks[netId].address)
    dispatch(predictionContractLoaded(prediction))
    return prediction
  } catch (e) {
    // window.alert('Wrong network!')
    console.log('Error, loading prediction market contract: ', e)
    dispatch(predictionContractLoaded(null))
    return null
  }
}

export const NoWeb3PredictionUpdate = async (dispatch) => {
  try {
    let web3, netId, predictionContract
    let provider = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
    console.log(process.env.INFURA_API_KEY)
    web3 = await new Web3(provider)
    netId = 5
    predictionContract = await loadpredictionContract(dispatch, web3, netId)
    console.log(web3)
    console.log(netId)
    console.log(predictionContract)
    await fetchAllMarkets(dispatch, predictionContract)
    await fetchActiveMarkets(dispatch, predictionContract)
    await fetchClosedMarkets(dispatch, predictionContract)
    await fetchSettledMarkets(dispatch, predictionContract)
    await fetchWeightedAverages(dispatch, predictionContract, null)
  } catch (e) {
    console.log('Error, update data: ', e)
  }
}

export const predictionUpdate = async (dispatch) => {
  console.log('web3')
  try{
    let account, web3, netId, predictionContract
    await update(dispatch)

    web3 = await loadWeb3(dispatch)
    account = await loadAccount(dispatch, web3)
    netId = await web3.eth.net.getId()

    console.log(netId)

    if(netId === 5777) {

      predictionContract = await loadpredictionContract(dispatch, web3, netId)
      
      await fetchAllMarkets(dispatch, predictionContract)
      await fetchActiveMarkets(dispatch, predictionContract)
      await fetchClosedMarkets(dispatch, predictionContract)
      await fetchSettledMarkets(dispatch, predictionContract)
      await fetchWeightedAverages(dispatch, predictionContract, account)

    } else {
      let provider = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
      web3 = await new Web3(provider)
      netId = 5

      predictionContract = await loadpredictionContract(dispatch, web3, netId)
      console.log(web3)
      console.log(netId)
      console.log(predictionContract)
      await fetchAllMarkets(dispatch, predictionContract)
      await fetchActiveMarkets(dispatch, predictionContract)
      await fetchClosedMarkets(dispatch, predictionContract)
      await fetchSettledMarkets(dispatch, predictionContract)
      await fetchWeightedAverages(dispatch, predictionContract, account)


    }
  } catch (e) {
    console.log('Error, update data: ', e)
  }
}


export const fetchAllMarkets = async (dispatch, contract) => {
  try{
    let predictions = []
    let totalPredictionCount, allPredictions, predictionContract, totalVolume


    if(contract === undefined) {
      let provider = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
      let web3 = new Web3(provider)
      let netId = 5
      let contractAddy = Prediction.networks[netId].address
      predictionContract = new web3.eth.Contract(Prediction.abi, contractAddy)
      totalPredictionCount = await predictionContract.methods.totalPredictionMarkets().call()
      totalVolume = await predictionContract.methods.totalPredictionVolume().call()
      allPredictions = await predictionContract.methods.fetchAllMarkets().call()
    } else {
      // predictionContract = new web3.eth.Contract(Prediction.abi, contractAddy)
      totalPredictionCount = await contract.methods.totalPredictionMarkets().call()
      totalVolume = await contract.methods.totalPredictionVolume().call()
      allPredictions = await contract.methods.fetchAllMarkets().call()
    }

    predictions.push(totalPredictionCount)
    predictions.push(totalVolume)
    predictions.push(allPredictions)

    dispatch(predMarketsLoaded(predictions))
  } catch (e) {
    console.log('Error, unable to load ALL market data', e)
  }
}

export const fetchActiveMarkets = async (dispatch, contract) => {
  try{
    let activeMarkets = []
    let activeMarketsCount, allActiveMarkets, predictionContract


    if(contract === undefined) {
      let provider = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
      let web3 = new Web3(provider)
      let netId = 5
      let contractAddy = Prediction.networks[netId].address
      predictionContract = new web3.eth.Contract(Prediction.abi, contractAddy)
      activeMarketsCount = await predictionContract.methods.totalActivePredictionMarkets().call()
      allActiveMarkets = await predictionContract.methods.fetchAllActiveMarkets().call()
    } else {
      activeMarketsCount = await contract.methods.totalActivePredictionMarkets().call()
      allActiveMarkets = await contract.methods.fetchAllActiveMarkets().call()
    }
    
    activeMarkets.push(activeMarketsCount)
    activeMarkets.push(allActiveMarkets)

    dispatch(activeMarketsLoaded(activeMarkets))
  } catch (e) {
    console.log('Error, unable to load ACTIVE market data', e)
  }
}

export const fetchClosedMarkets = async (dispatch, contract) => {
  try{
    let closedMarkets = []
    let closedMarketsCount, allClosedMarkets, predictionContract

    if(contract === undefined) {
      let provider = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
      let web3 = new Web3(provider)
      let netId = 5
      let contractAddy = Prediction.networks[netId].address
      predictionContract = new web3.eth.Contract(Prediction.abi, contractAddy)
      closedMarketsCount = await predictionContract.methods.totalClosedPredictionMarkets().call()
      allClosedMarkets = await predictionContract.methods.fetchAllClosedMarkets().call()
    } else {
      closedMarketsCount = await contract.methods.totalClosedPredictionMarkets().call()
      allClosedMarkets = await contract.methods.fetchAllClosedMarkets().call()
    }

    closedMarkets.push(closedMarketsCount)
    closedMarkets.push(allClosedMarkets)


    dispatch(closedMarketsLoaded(closedMarkets))
  } catch (e) {
    console.log('Error, unable to load CLOSED market data', e)
  }
}

export const fetchSettledMarkets = async (dispatch, contract) => {
  try{
    let settledMarkets = []
    let settledMarketsCount, allSettledMarkets, predictionContract

    if(contract === undefined) {
      let provider = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
      let web3 = new Web3(provider)
      let netId = 5
      let contractAddy = Prediction.networks[netId].address
      predictionContract = new web3.eth.Contract(Prediction.abi, contractAddy)
      settledMarketsCount = await predictionContract.methods.totalSettledPredictionMarkets().call()
      allSettledMarkets = await predictionContract.methods.fetchAllSettledMarkets().call()
    } else {
      settledMarketsCount = await contract.methods.totalSettledPredictionMarkets().call()
      allSettledMarkets = await contract.methods.fetchAllSettledMarkets().call()
    }

    settledMarkets.push(settledMarketsCount)
    settledMarkets.push(allSettledMarkets)


    dispatch(settledMarketsLoaded(settledMarkets))
  } catch (e) {
    console.log('Error, unable to load CLOSED market data', e)
  }
}

export const fetchWeightedAverages = async (dispatch, contract, account) => {
  try{
    let weightedAverages = []
    let predictionContract, allMarketsCount, weightedAVG
    
    if(contract === undefined) {
      let provider = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
      let web3 = new Web3(provider)
      let netId = 5
      let contractAddy = Prediction.networks[netId].address
      predictionContract = new web3.eth.Contract(Prediction.abi, contractAddy)
      allMarketsCount = await predictionContract.methods.totalPredictionMarkets().call()
      for(let i = 1; i <= allMarketsCount; i++) {
        weightedAVG = await predictionContract.methods.userPredictions(i, account).call()
        weightedAverages.push(weightedAVG)
      }
    } 
    // else if (account === null) {
    //   weightedAverages.push(
    //     {
    //       hasPredicted: false,
    //       payoutAmount: "0",
    //       prediction: false,
    //       predictionAmount: "0",
    //       predictor: "0x0000000000000000000000000000000000000000"
    //     }
    //   )
    // } 
    else {
      allMarketsCount = await contract.methods.totalPredictionMarkets().call()
      for(let i = 1; i <= allMarketsCount; i++) {
        weightedAVG = await contract.methods.userPredictions(i, account).call()
        weightedAverages.push(weightedAVG)
      }
    }

    dispatch(weightedAveragesLoaded(weightedAverages))
  } catch (e) {
    console.log('Error, unable to load weighted avg', e)
  }
}

export const makePrediction = async (dispatch, _id, true_false, amount) => {
  try {
    const web3 = await loadWeb3(dispatch)
    const account = await loadAccount(dispatch, web3)
    const netId = await web3.eth.net.getId()
    const predictionContract = await loadpredictionContract(dispatch, web3, netId)
    let _weiAmount = amount * 10**18

    await predictionContract.methods.makePrediction(_id, true_false).send({ from: account, value: _weiAmount, gasPrice: '7000000000' })
      .on('receipt', async (r) => {
        predictionUpdate(dispatch)
      })
      .on('error',(error) => {
        console.error(error)
        window.alert(`There was an error!`)
      })
  } catch (e) {
    console.log('error predicting', e)
  }
}

export const withdrawPrediction = async (dispatch, _id) => {
  try {
    console.log(_id)
    const web3 = await loadWeb3(dispatch)
    const account = await loadAccount(dispatch, web3)
    const netId = await web3.eth.net.getId()
    const predictionContract = await loadpredictionContract(dispatch, web3, netId)

    await predictionContract.methods.userWithdraw(_id).send({ from: account, gasPrice: '7000000000' })
      .on('receipt', async (r) => {
        predictionUpdate(dispatch)
      })
      .on('error',(error) => {
        console.error(error)
        window.alert(`There was an error!`)
      })
  } catch (e) {
    console.log('error predicting', e)
  }
}

export const claim = async (dispatch, _id) => {
  try {
    console.log(_id)
    const web3 = await loadWeb3(dispatch)
    const account = await loadAccount(dispatch, web3)
    const netId = await web3.eth.net.getId()
    const predictionContract = await loadpredictionContract(dispatch, web3, netId)

    await predictionContract.methods.claim(_id).send({ from: account, gasPrice: '7000000000' })
      .on('receipt', async (r) => {
        predictionUpdate(dispatch)
      })
      .on('error',(error) => {
        console.error(error)
        window.alert(`There was an error!`)
      })
  } catch (e) {
    console.log('error claiming', e)
  }
}
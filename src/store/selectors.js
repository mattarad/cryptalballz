import { createSelector } from 'reselect'
import { get } from 'lodash'

const web3 = state => get(state, 'web3.connection')
export const web3Selector = createSelector(web3, w => w)

const network = state => get(state, 'web3.network')
export const networkSelector = createSelector(network, n => n)

const account = state => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)

const balance = state => get(state, 'web3.balance', 0)
export const balanceSelector = createSelector(balance, e => e)

// @flow
import { API_URL } from '../../config.js'
import { BLOCK_RANGE } from '../../constants/dataConstants.js'
import { type Dispatch, type GetState } from '../types.js'

export const fetchNetworkData = (start: number = 0) => async (dispatch: Dispatch, getState: GetState) => {
  try {
    const state = getState()
    const latestBlockHeight = state.networkData.latestBlock.height || 0
    const url = `${API_URL}grin/stats/${latestBlockHeight},${BLOCK_RANGE}/gps,height,difficulty,timestamp`
    const networkDataResponse = await fetch(url)
    const networkData = await networkDataResponse.json()
    dispatch({ type: 'NETWORK_DATA', data: { historical: networkData } })
  } catch (e) {
    console.log('Error: ', e)
  }
}

export const getLatestBlock = () => async (dispatch: Dispatch) => {
  try {
    const latestBlockUrl = `${API_URL}grin/block`
    const latestBlockResponse = await fetch(latestBlockUrl)
    const latestBlockData = await latestBlockResponse.json()
    dispatch({ type: 'LATEST_BLOCK', data: { latestBlock: latestBlockData } })
  } catch (e) {
    console.log('error: ', e)
  }
}

export const getMinedBlocksAlgos = () => async (dispatch: Dispatch, getState: GetState) => {
  try {
    const state = getState()
    const latestBlockHeight = state.networkData.latestBlock.height || 0
    const minedBlockAlgosUrl = `${API_URL}grin/blocks/${latestBlockHeight},${BLOCK_RANGE}/height,edge_bits`
    const minedBlockAlgosResponse = await fetch(minedBlockAlgosUrl)
    const minedBlockAlgosData = await minedBlockAlgosResponse.json()
    const algos = {
      c29: [],
      c30: []
    }
    minedBlockAlgosData.forEach(block => {
      if (block.edge_bits === 29) {
        algos.c29.push(block.height)
      }
      if (block.edge_bits === 30) {
        algos.c30.push(block.height)
      }
    })
    dispatch({ type: 'MINED_BLOCKS_ALGOS', data: algos })
  } catch (e) {
    console.log('error: ', e)
  }
}

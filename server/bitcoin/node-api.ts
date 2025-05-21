import { Request, Response } from 'express';
import * as bitcoin from 'bitcoinjs-lib';
import { 
  checkNodeConnection, 
  getBitcoinClient, 
  getBlockchainHeight, 
  getFeeEstimates 
} from './node-client';
import { getCurrentNetwork, setNetwork } from './config';

/**
 * Get Bitcoin node information
 */
export async function getNodeInfo(req: Request, res: Response) {
  try {
    // Check if we're using testnet or mainnet (from query param)
    const useTestnet = req.query.network === 'testnet';
    
    // Set the network accordingly
    setNetwork(useTestnet);
    
    // Check if the node is connected
    const isConnected = await checkNodeConnection();
    
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'NODE_UNAVAILABLE',
          message: 'Bitcoin node is not available or not responding'
        }
      });
    }
    
    // Get the client
    const client = getBitcoinClient();
    
    // Get blockchain info
    const blockchainInfo = await (client as any).getBlockchainInfo();
    
    // Get fee estimates
    const feeEstimates = await getFeeEstimates();
    
    // Return node information
    return res.status(200).json({
      success: true,
      data: {
        version: blockchainInfo.version,
        blocks: blockchainInfo.blocks,
        headers: blockchainInfo.headers,
        bestblockhash: blockchainInfo.bestblockhash,
        difficulty: blockchainInfo.difficulty,
        mediantime: blockchainInfo.mediantime,
        chain: blockchainInfo.chain,
        feeEstimates
      }
    });
  } catch (error) {
    console.error('Error getting node information:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    });
  }
}

/**
 * Get Bitcoin node connection status
 */
export async function getNodeStatus(req: Request, res: Response) {
  try {
    // Check if we're using testnet or mainnet (from query param)
    const useTestnet = req.query.network === 'testnet';
    
    // Set the network accordingly
    setNetwork(useTestnet);
    
    // Check if the node is connected
    const isConnected = await checkNodeConnection();
    
    // Get the current network
    const network = getCurrentNetwork();
    const networkName = useTestnet ? 'testnet' : 'mainnet';
    
    return res.status(200).json({
      success: true,
      data: {
        connected: isConnected,
        network: networkName,
        nodeUrl: isConnected ? `${useTestnet ? 'testnet' : 'mainnet'} node at ${process.env.BITCOIN_RPC_HOST || 'localhost'}` : null
      }
    });
  } catch (error) {
    console.error('Error checking node status:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    });
  }
}
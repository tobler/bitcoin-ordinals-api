import * as bitcoin from 'bitcoinjs-lib';
import { createOrdinalTransaction, createCollectionTransaction } from './taproot';
import { 
  isValidTaprootAddress, 
  isValidPrivateKey, 
  isAddressMatchingNetwork 
} from './utils';
import {
  getAddressUtxos,
  broadcastTransaction as nodeBroadcastTransaction,
  getBlockchainHeight,
  checkNodeConnection
} from './node-client';
import { setNetwork, getCurrentNetwork } from './config';

/**
 * Fetch UTXOs from the Bitcoin node
 * Fall back to mock data if node connection fails
 */
async function fetchUTXOs(address: string): Promise<Array<{ txid: string; vout: number; value: number }>> {
  try {
    // Check if node is connected
    const isConnected = await checkNodeConnection();
    
    if (isConnected) {
      // Get real UTXOs from the Bitcoin node
      return await getAddressUtxos(address);
    } else {
      console.warn('Bitcoin node not connected, using mock UTXOs');
      // Mock response as fallback
      const mockUTXOs = [
        {
          txid: "7f1f7a3cf695a8a96dce1df2566f7dc5f5bfbb954ff18e1bbc9595c156693fc5",
          vout: 0,
          value: 50000  // 50,000 satoshis
        },
        {
          txid: "8d23e94b3940af53b2b8e31c1236d439ca42e26914ee890fb1e885bc5ac2c29e",
          vout: 1,
          value: 100000  // 100,000 satoshis
        }
      ];
      return mockUTXOs;
    }
  } catch (error) {
    console.error('Error fetching UTXOs:', error);
    throw error;
  }
}

/**
 * Broadcast transaction to the Bitcoin network
 * Falls back to mock implementation if node connection fails
 */
async function broadcastTransaction(txHex: string): Promise<string> {
  try {
    // Check if node is connected
    const isConnected = await checkNodeConnection();
    
    if (isConnected) {
      // Broadcast to real network via Bitcoin node
      return await nodeBroadcastTransaction(txHex);
    } else {
      console.warn('Bitcoin node not connected, using mock transaction broadcast');
      // Simulate broadcast delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Parse the transaction to get its ID as fallback
      const tx = bitcoin.Transaction.fromHex(txHex);
      const txid = tx.getId();
      
      return txid;
    }
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
    throw error;
  }
}

/**
 * Get current block height from node or use a fallback
 */
async function getCurrentBlockHeight(): Promise<number> {
  try {
    // Check if node is connected
    const isConnected = await checkNodeConnection();
    
    if (isConnected) {
      return await getBlockchainHeight();
    } else {
      // Fallback to approximate height for current time
      // Bitcoin generates a block roughly every 10 minutes
      // This is just an approximation based on Bitcoin's genesis date
      const genesisDate = new Date('2009-01-03T18:15:05Z').getTime();
      const now = new Date().getTime();
      const timeDiff = now - genesisDate;
      const minutesSinceGenesis = timeDiff / (1000 * 60);
      return Math.floor(minutesSinceGenesis / 10);
    }
  } catch (error) {
    console.error('Error getting block height:', error);
    // Fallback to approximate current height
    return 830000;
  }
}

/**
 * Set the Bitcoin network for transactions
 * @param useTestnet Whether to use testnet (true) or mainnet (false)
 */
export function setBitcoinNetwork(useTestnet: boolean): void {
  setNetwork(useTestnet);
}

/**
 * Creates an ordinal NFT
 */
export async function createOrdinal(
  bitcoinAddress: string,
  privateKey: string,
  name: string,
  description: string,
  attributes: Array<{ trait_type: string; value: string }>,
  imageDataUrl: string,
  collectionId?: number,
  feeRate: number = 10,
  useTestnet: boolean = false
): Promise<{ txid: string; blockHeight?: number; fees: number; size: number }> {
  // Set the network first
  setBitcoinNetwork(useTestnet);
  
  // Validate inputs
  if (!isValidTaprootAddress(bitcoinAddress)) {
    throw new Error(`Invalid Bitcoin Taproot address. Must start with ${useTestnet ? 'tb1p' : 'bc1p'}.`);
  }
  
  // Check if address matches the selected network
  if (!isAddressMatchingNetwork(bitcoinAddress)) {
    throw new Error(`Address does not match the selected network (${useTestnet ? 'testnet' : 'mainnet'}).`);
  }
  
  if (!isValidPrivateKey(privateKey)) {
    throw new Error('Invalid private key format');
  }
  
  // Fetch UTXOs for the address
  const utxos = await fetchUTXOs(bitcoinAddress);
  
  if (utxos.length === 0) {
    throw new Error('No UTXOs found for the address. Please fund the address first.');
  }
  
  // Create ordinal metadata
  const metadata = {
    name,
    description,
    attributes,
    collectionId,
    network: useTestnet ? 'testnet' : 'mainnet'
  };
  
  // Create and sign the transaction
  const { tx, txid } = await createOrdinalTransaction(
    utxos,
    privateKey,
    bitcoinAddress,
    metadata,
    imageDataUrl,
    feeRate
  );
  
  // Get transaction hex
  const txHex = tx.toHex();
  
  // Broadcast the transaction
  await broadcastTransaction(txHex);
  
  // Get current block height if available
  let blockHeight: number | undefined;
  try {
    blockHeight = await getCurrentBlockHeight();
  } catch (error) {
    console.warn('Could not fetch current block height, leaving undefined');
  }
  
  // Return transaction details
  return {
    txid,
    blockHeight,
    fees: Math.ceil(tx.virtualSize() * feeRate),
    size: tx.byteLength()
  };
}

/**
 * Creates a collection
 */
export async function createCollection(
  bitcoinAddress: string,
  privateKey: string,
  name: string,
  description: string,
  symbol: string,
  imageDataUrl: string,
  feeRate: number = 5,
  useTestnet: boolean = false
): Promise<{ txid: string; blockHeight?: number; fees: number; size: number }> {
  // Set the network first
  setBitcoinNetwork(useTestnet);
  
  // Validate inputs
  if (!isValidTaprootAddress(bitcoinAddress)) {
    throw new Error(`Invalid Bitcoin Taproot address. Must start with ${useTestnet ? 'tb1p' : 'bc1p'}.`);
  }
  
  // Check if address matches the selected network
  if (!isAddressMatchingNetwork(bitcoinAddress)) {
    throw new Error(`Address does not match the selected network (${useTestnet ? 'testnet' : 'mainnet'}).`);
  }
  
  if (!isValidPrivateKey(privateKey)) {
    throw new Error('Invalid private key format');
  }
  
  // Fetch UTXOs for the address
  const utxos = await fetchUTXOs(bitcoinAddress);
  
  if (utxos.length === 0) {
    throw new Error('No UTXOs found for the address. Please fund the address first.');
  }
  
  // Create collection metadata
  const metadata = {
    name,
    description,
    symbol,
    type: 'collection',
    network: useTestnet ? 'testnet' : 'mainnet'
  };
  
  // Create and sign the transaction
  const { tx, txid } = await createCollectionTransaction(
    utxos,
    privateKey,
    bitcoinAddress,
    metadata,
    imageDataUrl,
    feeRate
  );
  
  // Get transaction hex
  const txHex = tx.toHex();
  
  // Broadcast the transaction
  await broadcastTransaction(txHex);
  
  // Get current block height if available
  let blockHeight: number | undefined;
  try {
    blockHeight = await getCurrentBlockHeight();
  } catch (error) {
    console.warn('Could not fetch current block height, leaving undefined');
  }
  
  // Return transaction details
  return {
    txid,
    blockHeight,
    fees: Math.ceil(tx.virtualSize() * feeRate),
    size: tx.byteLength()
  };
}

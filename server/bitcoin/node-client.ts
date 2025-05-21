import Client from 'bitcoin-core';
import { BitcoinNodeConfig, getNodeConfig, getCurrentNetwork } from './config';

let bitcoinClient: Client | null = null;
let isTestnet = false;

/**
 * Initialize Bitcoin client with configuration
 * @param config Optional manual configuration
 * @param testnet Whether to use testnet
 */
export function initializeBitcoinClient(config?: BitcoinNodeConfig, testnet: boolean = false): Client {
  isTestnet = testnet;
  const nodeConfig = config || getNodeConfig(testnet);
  
  // Create client with type casting to handle library typings
  bitcoinClient = new Client({
    network: testnet ? 'testnet' : 'mainnet',
    host: nodeConfig.host,
    username: nodeConfig.username,
    password: nodeConfig.password,
    timeout: nodeConfig.timeout,
    ssl: nodeConfig.ssl,
    // Use type assertion to allow port property
    port: nodeConfig.port
  } as any);
  
  return bitcoinClient;
}

/**
 * Get the Bitcoin client instance
 * Creates a new client if one doesn't exist
 */
export function getBitcoinClient(): Client {
  if (!bitcoinClient) {
    return initializeBitcoinClient(undefined, isTestnet);
  }
  return bitcoinClient;
}

/**
 * Check if the Bitcoin node is connected and responding
 */
export async function checkNodeConnection(): Promise<boolean> {
  try {
    const client = getBitcoinClient();
    // Cast to any to work around type definitions issue
    await (client as any).getBlockchainInfo();
    return true;
  } catch (error) {
    console.error('Bitcoin node connection error:', error);
    return false;
  }
}

/**
 * Get UTXOs for an address
 * @param address Bitcoin address
 */
export async function getAddressUtxos(address: string): Promise<Array<{ txid: string; vout: number; value: number }>> {
  try {
    const client = getBitcoinClient();
    
    // For newer Bitcoin Core versions (0.17.0+) using scantxoutset
    const result = await client.command('scantxoutset', 'start', [`addr(${address})`]);
    
    if (result.success && result.unspents) {
      return result.unspents.map((utxo: any) => ({
        txid: utxo.txid,
        vout: utxo.vout,
        value: Math.round(utxo.amount * 100000000) // Convert BTC to satoshis
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching UTXOs:', error);
    throw new Error(`Failed to fetch UTXOs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Broadcast a transaction to the Bitcoin network
 * @param txHex Transaction in hexadecimal format
 */
export async function broadcastTransaction(txHex: string): Promise<string> {
  try {
    const client = getBitcoinClient();
    // Cast to any to work around type definitions issue
    const txid = await (client as any).sendRawTransaction(txHex);
    return txid;
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
    throw new Error(`Failed to broadcast transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get information about a transaction
 * @param txid Transaction ID
 */
export async function getTransaction(txid: string): Promise<any> {
  try {
    const client = getBitcoinClient();
    // Cast to any to work around type definitions issue
    const tx = await (client as any).getRawTransaction(txid, true);
    return tx;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw new Error(`Failed to fetch transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get current blockchain height
 */
export async function getBlockchainHeight(): Promise<number> {
  try {
    const client = getBitcoinClient();
    // Cast to any to work around type definitions issue
    const info = await (client as any).getBlockchainInfo();
    return info.blocks;
  } catch (error) {
    console.error('Error fetching blockchain height:', error);
    throw new Error(`Failed to fetch blockchain height: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get information about a block
 * @param blockHash Block hash
 */
export async function getBlock(blockHash: string): Promise<any> {
  try {
    const client = getBitcoinClient();
    // Cast to any to work around type definitions issue
    const block = await (client as any).getBlock(blockHash);
    return block;
  } catch (error) {
    console.error('Error fetching block:', error);
    throw new Error(`Failed to fetch block: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get fee estimates from the node
 * @returns Fee estimates in satoshis/vB
 */
export async function getFeeEstimates(): Promise<{
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}> {
  try {
    const client = getBitcoinClient();
    
    // Try to get fee estimates from the node
    // We'll get estimates for 1, 3, 6, and 24 blocks
    const estimateSmartFee = async (blocks: number) => {
      try {
        const result = await client.command('estimatesmartfee', blocks);
        return Math.ceil(result.feerate * 100000000); // Convert BTC/kB to sats/vB
      } catch (error) {
        return null;
      }
    };
    
    const [fastest, halfHour, hour, economy] = await Promise.all([
      estimateSmartFee(1),
      estimateSmartFee(3),
      estimateSmartFee(6),
      estimateSmartFee(24)
    ]);
    
    // Return fees with appropriate defaults
    return {
      fastestFee: fastest || 25,
      halfHourFee: halfHour || 15,
      hourFee: hour || 10,
      economyFee: economy || 5,
      minimumFee: 1
    };
  } catch (error) {
    console.error('Error fetching fee estimates:', error);
    // Return default values if we couldn't get estimates
    return {
      fastestFee: 25,
      halfHourFee: 15,
      hourFee: 10,
      economyFee: 5,
      minimumFee: 1
    };
  }
}
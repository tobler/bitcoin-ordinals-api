import * as bitcoin from 'bitcoinjs-lib';

export interface BitcoinNodeConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  timeout: number;
  ssl: boolean;
}

// Current active network
let currentNetwork: bitcoin.networks.Network = bitcoin.networks.bitcoin; // Default to mainnet

/**
 * Get the current Bitcoin network (mainnet or testnet)
 */
export function getCurrentNetwork(): bitcoin.networks.Network {
  return currentNetwork;
}

/**
 * Set the current Bitcoin network
 * @param isTestnet Whether to use testnet (true) or mainnet (false)
 */
export function setNetwork(isTestnet: boolean): void {
  currentNetwork = isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
}

/**
 * Default Bitcoin node configuration
 * This will be overridden by environment variables or user settings
 */
export const defaultNodeConfig: BitcoinNodeConfig = {
  host: 'localhost',
  port: 8332, // Default Bitcoin RPC port (18332 for testnet)
  username: 'bitcoin',
  password: 'password',
  timeout: 30000,
  ssl: false
};

/**
 * Default testnet node configuration
 */
export const defaultTestnetNodeConfig: BitcoinNodeConfig = {
  ...defaultNodeConfig,
  port: 18332 // Default Bitcoin testnet RPC port
};

/**
 * Get Bitcoin node configuration based on network
 */
export function getNodeConfig(isTestnet: boolean = false): BitcoinNodeConfig {
  // Read from environment variables if available
  const config = isTestnet ? { ...defaultTestnetNodeConfig } : { ...defaultNodeConfig };
  
  if (process.env.BITCOIN_RPC_HOST) {
    config.host = process.env.BITCOIN_RPC_HOST;
  }
  
  if (process.env.BITCOIN_RPC_PORT) {
    config.port = parseInt(process.env.BITCOIN_RPC_PORT, 10);
  } else if (isTestnet) {
    config.port = 18332;
  } else {
    config.port = 8332;
  }
  
  if (process.env.BITCOIN_RPC_USERNAME) {
    config.username = process.env.BITCOIN_RPC_USERNAME;
  }
  
  if (process.env.BITCOIN_RPC_PASSWORD) {
    config.password = process.env.BITCOIN_RPC_PASSWORD;
  }
  
  if (process.env.BITCOIN_RPC_SSL) {
    config.ssl = process.env.BITCOIN_RPC_SSL === 'true';
  }
  
  return config;
}
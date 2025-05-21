import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { getCurrentNetwork } from './config';

// Initialize modules
const ECPair = ECPairFactory(ecc);

/**
 * Validates a Bitcoin address on the current network
 */
export function isValidBitcoinAddress(address: string): boolean {
  try {
    bitcoin.address.toOutputScript(address, getCurrentNetwork());
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validates if an address is a Taproot address
 * Checks for bc1p (mainnet) or tb1p (testnet)
 */
export function isValidTaprootAddress(address: string): boolean {
  const network = getCurrentNetwork();
  const isMainnet = network === bitcoin.networks.bitcoin;
  
  // Check appropriate prefix based on network
  const hasValidPrefix = isMainnet ? 
    address.startsWith('bc1p') : 
    address.startsWith('tb1p');
    
  return hasValidPrefix && isValidBitcoinAddress(address);
}

/**
 * Checks if the provided address matches the current network
 * @returns true if the address matches the current network, false otherwise
 */
export function isAddressMatchingNetwork(address: string): boolean {
  const network = getCurrentNetwork();
  const isMainnet = network === bitcoin.networks.bitcoin;
  
  // Mainnet addresses start with bc1, 1, or 3
  const isMainnetAddress = address.startsWith('bc1') || 
                          address.startsWith('1') || 
                          address.startsWith('3');
                          
  // Testnet addresses start with tb1, m, or n
  const isTestnetAddress = address.startsWith('tb1') || 
                          address.startsWith('m') || 
                          address.startsWith('n');
  
  // Address should match the current network
  return (isMainnet && isMainnetAddress) || (!isMainnet && isTestnetAddress);
}

/**
 * Creates an ECPair from a WIF private key
 */
export function createKeyPairFromWIF(wif: string) {
  try {
    return ECPair.fromWIF(wif);
  } catch (error) {
    throw new Error('Invalid private key format');
  }
}

/**
 * Validates a private key format
 */
export function isValidPrivateKey(privateKey: string): boolean {
  try {
    createKeyPairFromWIF(privateKey);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Converts bytes to hexadecimal string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Converts hexadecimal string to bytes
 */
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Encodes data as base64
 */
export function encodeBase64(data: string): string {
  return Buffer.from(data).toString('base64');
}

/**
 * Decodes base64 data
 */
export function decodeBase64(base64: string): string {
  return Buffer.from(base64, 'base64').toString();
}

/**
 * Extracts the data portion from a data URL
 */
export function extractDataFromDataUrl(dataUrl: string): { data: Buffer, mimeType: string } {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid data URL format');
  }
  
  const [, mimeType, base64Data] = matches;
  return { 
    data: Buffer.from(base64Data, 'base64'),
    mimeType 
  };
}

/**
 * Formats an amount in satoshis to a human-readable format with units
 */
export function formatSatoshis(satoshis: number): string {
  if (satoshis >= 100000000) { // 1 BTC
    return (satoshis / 100000000).toFixed(8) + ' BTC';
  } else if (satoshis >= 1000) {
    return (satoshis / 1000).toFixed(2) + ' kSats';
  } else {
    return satoshis + ' Sats';
  }
}

/**
 * Estimates the size of a transaction in virtual bytes (vB)
 */
export function estimateVirtualSize(inputCount: number, outputCount: number, hasWitness: boolean): number {
  // Simple estimation, adjust as needed for more accurate calculations
  const baseSize = 10 + (inputCount * 41) + (outputCount * 32);
  const witnessSize = hasWitness ? 2 + (inputCount * 108) : 0;
  
  // Weight units formula: baseSize * 4 + witnessSize
  const weight = baseSize * 4 + witnessSize;
  
  // Virtual size = weight / 4 (rounded up)
  return Math.ceil(weight / 4);
}

/**
 * Calculate the total fee for a transaction based on its size and fee rate
 */
export function calculateFee(virtualSize: number, feeRatePerVB: number): number {
  return Math.ceil(virtualSize * feeRatePerVB);
}

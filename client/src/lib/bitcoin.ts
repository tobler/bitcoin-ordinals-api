export function isValidBitcoinAddress(address: string): boolean {
  // Simple regex check for Taproot addresses that should start with bc1p
  const taprootAddressRegex = /^bc1p[a-zA-Z0-9]{58,}$/;
  return taprootAddressRegex.test(address);
}

export function isValidPrivateKey(privateKey: string): boolean {
  // Simple regex for WIF private keys (Wallet Import Format)
  // These typically start with 5, K, or L for mainnet
  const wifPrivateKeyRegex = /^[5KL][a-km-zA-HJ-NP-Z1-9]{50,52}$/;
  return wifPrivateKeyRegex.test(privateKey);
}

export function generateRandomTxid(): string {
  const characters = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function formatTimestamp(timestamp: string | undefined): string {
  if (!timestamp) return 'Unknown';
  
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function estimateTransactionSize(
  inputCount: number,
  outputCount: number,
  withData: boolean = true
): number {
  // Very simplified estimation for Taproot transactions
  let baseSize = 10 + (inputCount * 58) + (outputCount * 43);
  
  if (withData) {
    // Add estimated size for the additional metadata and image data
    baseSize += 500; // Metadata JSON
    baseSize += 1500; // Small image
  }
  
  return baseSize;
}

export function estimateTransactionFee(
  sizeInBytes: number,
  feeRateInSatsPerVbyte: number
): number {
  return Math.ceil(sizeInBytes * feeRateInSatsPerVbyte);
}

export function satsToFormattedBtc(sats: number): string {
  const btcValue = sats / 100000000;
  return `${btcValue.toFixed(8)} BTC`;
}

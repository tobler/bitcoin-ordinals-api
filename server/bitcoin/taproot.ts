import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { createKeyPairFromWIF, bytesToHex, hexToBytes, extractDataFromDataUrl } from './utils';

// Initialize the network (mainnet for production, testnet for testing)
const network = bitcoin.networks.bitcoin;

// Initialize ECPair factory with secp256k1
const ECPair = ECPairFactory(ecc);

/**
 * Creates a Taproot output script
 */
export function createTaprootOutputScript(publicKey: Buffer): Buffer {
  // Get the x-only public key (taproot uses only x coordinate)
  const xOnlyPubkey = publicKey.slice(1, 33);
  
  // Create a taproot output script using p2tr
  const { output } = bitcoin.payments.p2tr({
    internalPubkey: xOnlyPubkey,
    network
  });
  
  return output;
}

/**
 * Creates a commitment to embed data in a transaction
 * @param contentType The MIME type of the content
 * @param content The content to embed
 */
export function createOrdinalInscriptionCommitment(contentType: string, content: Buffer): Buffer {
  // Ordinal protocol envelope
  const prefix = Buffer.from('ord');
  
  // Content-type header
  const contentTypeBuffer = Buffer.from(contentType);
  const contentTypeLengthBuffer = Buffer.allocUnsafe(1);
  contentTypeLengthBuffer.writeUInt8(contentTypeBuffer.length);
  
  // Combine all parts into a single commitment
  return Buffer.concat([
    prefix,
    contentTypeLengthBuffer,
    contentTypeBuffer,
    content
  ]);
}

/**
 * Creates a reveal transaction for an ordinal
 * This is the main transaction that embeds the metadata and image
 */
export async function createOrdinalTransaction(
  utxos: Array<{ txid: string; vout: number; value: number }>,
  privateKeyWIF: string,
  recipientAddress: string,
  metadata: any,
  imageDataUrl: string,
  feeRate: number
): Promise<{ tx: bitcoin.Transaction; txid: string }> {
  try {
    // Parse the private key
    const keyPair = createKeyPairFromWIF(privateKeyWIF);
    const publicKey = keyPair.publicKey;
    
    // Convert recipient address to output script
    const recipientOutput = bitcoin.address.toOutputScript(recipientAddress);
    
    // Get the image data from the data URL
    const { data: imageData, mimeType } = extractDataFromDataUrl(imageDataUrl);
    
    // Create metadata JSON
    const metadataJSON = JSON.stringify(metadata);
    const metadataBuffer = Buffer.from(metadataJSON);
    
    // Create a separate inscription for metadata and image
    const metadataInscription = createOrdinalInscriptionCommitment(
      'application/json',
      metadataBuffer
    );
    
    const imageInscription = createOrdinalInscriptionCommitment(
      mimeType,
      imageData
    );
    
    // Create a new transaction
    const tx = new bitcoin.Transaction();
    
    // Add inputs from UTXOs
    for (const utxo of utxos) {
      tx.addInput(Buffer.from(utxo.txid, 'hex').reverse(), utxo.vout);
    }
    
    // Add the ordinal output with the inscription
    // We'll use taproot to store our inscriptions
    const taprootOutput = createTaprootOutputScript(publicKey);
    tx.addOutput(taprootOutput, 10000); // 10,000 satoshis minimum for an ordinal
    
    // Add a taproot witness program to embed our inscriptions
    // We need to nest both inscriptions in a single output
    const inscriptionsScript = bitcoin.script.compile([
      // Mark as Taproot script with the OP_FALSE OP_IF pattern
      bitcoin.opcodes.OP_FALSE,
      bitcoin.opcodes.OP_IF,
      // Metadata inscription
      metadataInscription,
      bitcoin.opcodes.OP_ENDIF,
      // Image inscription
      bitcoin.opcodes.OP_FALSE,
      bitcoin.opcodes.OP_IF,
      imageInscription,
      bitcoin.opcodes.OP_ENDIF
    ]);
    
    // Add witness to first input (could be optimized to use Taproot properly)
    // For simplicity, we're just adding the inscriptions to the witness data
    const witness = bitcoin.payments.p2tr.encode({
      internalPubkey: publicKey.slice(1, 33),
      scriptTree: {
        output: inscriptionsScript,
        // Placeholder signature that will be updated
        signature: Buffer.alloc(64),
      },
      network
    });
    
    // Calculate the total value from the UTXOs
    const totalValue = utxos.reduce((sum, utxo) => sum + utxo.value, 0);
    
    // Estimate the transaction size for fee calculation
    const estimatedSize = tx.virtualSize();
    const fee = Math.ceil(estimatedSize * feeRate);
    
    // Add change output if needed
    const outputValue = 10000; // Value of the ordinal output
    if (totalValue > outputValue + fee) {
      const changeValue = totalValue - outputValue - fee;
      tx.addOutput(recipientOutput, changeValue);
    }
    
    // Sign the transaction
    for (let i = 0; i < utxos.length; i++) {
      const signatureHash = tx.hashForWitnessV1(
        i, // Input index
        [recipientOutput], // Previous output scripts
        [utxos[i].value], // Previous output values
        bitcoin.Transaction.SIGHASH_ALL // Sighash type
      );
      
      const signature = Buffer.from(
        ecc.signSchnorr(signatureHash, keyPair.privateKey)
      );
      
      // Set the witness data for the input
      tx.setWitness(i, [signature, inscriptionsScript]);
    }
    
    // Get the txid
    const txid = tx.getId();
    
    return { tx, txid };
  } catch (error) {
    console.error('Error creating ordinal transaction:', error);
    throw error;
  }
}

/**
 * Creates a commitment transaction for a collection
 */
export async function createCollectionTransaction(
  utxos: Array<{ txid: string; vout: number; value: number }>,
  privateKeyWIF: string,
  recipientAddress: string,
  collectionMetadata: any,
  imageDataUrl: string,
  feeRate: number
): Promise<{ tx: bitcoin.Transaction; txid: string }> {
  // For collections, we'll use the same approach as for ordinals
  // with slightly different metadata structure
  return createOrdinalTransaction(
    utxos,
    privateKeyWIF,
    recipientAddress,
    {
      ...collectionMetadata,
      type: 'collection'
    },
    imageDataUrl,
    feeRate
  );
}

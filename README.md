# Bitcoin Ordinals API

A JavaScript web API for creating Bitcoin Ordinals and Collections using Taproot transactions with on-chain storage of metadata and images.

## Features

- Create Bitcoin Ordinals with on-chain metadata and images
- Create Collections to group Ordinals together
- Support for both Mainnet and Testnet
- Customizable fee rates for transactions
- Ability to specify a receiver address for Ordinals
- Bitcoin node connection support with fallback to mock data

## Technology Stack

- **Frontend**: React with Wouter routing and Shadcn UI components
- **Backend**: Express.js API
- **Storage**: In-memory storage with robust interface
- **Bitcoin**: Bitcoin.js library for transaction creation and signing

## API Documentation

### Create an Ordinal

```
POST /api/v1/ordinals
```

Example request:
```json
{
  "bitcoinAddress": "bc1p9yfwlm0w3vlczd7xzz3au0g08wnf89u838z3fvz90zkct7t2f9tqgskn6s",
  "privateKey": "****************************************",
  "collectionId": 1,
  "name": "Crypto Punk #1234",
  "description": "A unique Bitcoin Ordinal NFT",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Eyes",
      "value": "Laser"
    }
  ],
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEU...",
  "feeRate": 10,
  "useTestnet": false,
  "receiverAddress": "bc1pzjf0d7u42lu5xhw8h9zgfzgtwk9jx4rh9t87mpzj4h7wzj5c8resrdjnna"
}
```

### Create a Collection

```
POST /api/v1/collections
```

Example request:
```json
{
  "bitcoinAddress": "bc1p9yfwlm0w3vlczd7xzz3au0g08wnf89u838z3fvz90zkct7t2f9tqgskn6s",
  "privateKey": "****************************************",
  "name": "Crypto Punks Collection",
  "description": "A collection of unique Bitcoin Ordinals",
  "symbol": "CPUNK",
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEU...",
  "feeRate": 5,
  "useTestnet": false
}
```

## Bitcoin Node Configuration

The API can connect to a running Bitcoin node. Configure the connection with these environment variables:

```
BITCOIN_NODE_HOST=127.0.0.1
BITCOIN_NODE_PORT=8332
BITCOIN_NODE_USERNAME=your_username
BITCOIN_NODE_PASSWORD=your_password
BITCOIN_NODE_TIMEOUT=30000
BITCOIN_NODE_SSL=false
```

If a Bitcoin node is not available, the system will fall back to mock data.

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/bitcoin-ordinals-api.git
cd bitcoin-ordinals-api

# Install dependencies
npm install

# Start the development server
npm run dev
```

## License

MIT
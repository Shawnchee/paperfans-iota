# MUSDT Smart Contract Integration

This document explains how to deploy the MUSDT smart contract and integrate it with the PaperFans IOTA application.

## Overview

The MUSDT (Mock USDT) smart contract is a test token that allows users to mint tokens to their wallets. This integration enables the onramping functionality in the PaperFans application.

## Contract Structure

The MUSDT contract is located in `contract/isc-rwa/smart-contracts2/sources/mocusdt-package.move` and includes:

- **MOCKUSDT**: The main token type
- **Supply**: Tracks total minted amount
- **TreasuryCap**: Controls minting permissions
- **Metadata**: Token information (name, symbol, decimals)

## Deployment Steps

### 1. Deploy the MUSDT Contract

Navigate to the contract directory and deploy the contract:

```bash
cd contract/isc-rwa/smart-contracts2
sui move build
sui client publish --gas-budget 10000000
```

### 2. Record Contract Addresses

After deployment, you'll receive several addresses. Record these in `src/lib/contract-config.ts`:

```typescript
export const CONTRACT_CONFIG = {
  MUSDT: {
    CONTRACT_ADDRESS: "0x...", // The deployed package address
    TREASURY_CAP_ADDRESS: "0x...", // Treasury cap object address
    SUPPLY_ADDRESS: "0x...", // Supply object address
    DECIMALS: 6,
    SYMBOL: "MUSDT",
    NAME: "Mock USDT",
    DESCRIPTION: "Mock USDT for testing purposes"
  }
};
```

### 3. Update Configuration

Replace the placeholder addresses in `src/lib/contract-config.ts` with the actual deployed addresses.

## Integration Features

### Wallet Connection

The onramp page now includes:
- Wallet connection status indicator
- ConnectButton component for wallet connection
- Address display for connected wallets

### MUSDT Minting

Users can:
- Connect their wallet
- Enter the amount of MUSDT to mint
- Execute the minting transaction
- View transaction status and results

### Balance Tracking

The application:
- Displays current MUSDT balance
- Updates balance after successful minting
- Shows wallet address when connected

## Usage

1. Navigate to `/onramp` in the application
2. Connect your wallet using the ConnectButton
3. Enter the amount of MUSDT you want to mint
4. Click "Mint MUSDT" to execute the transaction
5. View the transaction status and updated balance

## Error Handling

The integration includes comprehensive error handling:
- Wallet connection validation
- Contract address validation
- Transaction execution error handling
- User-friendly error messages

## Development Notes

- The current implementation includes mock functionality for demonstration
- Real contract interaction requires proper wallet client integration
- Contract addresses must be updated after deployment
- The service includes fallback behavior for missing configurations

## Testing

To test the integration:

1. Deploy the contract to devnet/testnet
2. Update the contract addresses in configuration
3. Connect a wallet to the application
4. Test minting functionality
5. Verify balance updates

## Security Considerations

- Treasury cap should be held by a secure wallet
- Contract addresses should be verified before use
- User transactions should be validated
- Error messages should not expose sensitive information

## Future Enhancements

- Real-time balance updates
- Transaction history
- Gas estimation
- Batch minting capabilities
- Integration with other IOTA tokens 
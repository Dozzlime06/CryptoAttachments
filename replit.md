# Liminal Dreams NFT Minting DApp

A decentralized application for minting Liminal Dreams NFTs using $HYPE tokens on the Hyperliquid network.

## Overview

This DApp provides a sleek, user-friendly interface for minting NFTs from the Liminal Dreams collection. Built with React, Vite, and Privy authentication, it connects directly to your deployed smart contract at `0x7d5C48A82E13168d84498548fe0a2282b9C1F16B`.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Wallet Connection**: Privy Auth (supports embedded wallets and external wallets)
- **Blockchain**: Ethers.js v5 for smart contract interaction
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Dark theme with purple accents (#7c3aed primary color)

## Key Features

✅ Privy wallet connection with support for multiple wallet types
✅ Real-time contract data fetching (supply, price, max mint amount)
✅ Dynamic minting with quantity selector (1-20 NFTs per transaction)
✅ Progress bar showing collection minting status
✅ Automatic network switching to Chain ID 999 (Hyperliquid)
✅ Transaction status notifications with success/error handling
✅ Responsive design optimized for desktop and mobile
✅ Glass morphism effects and smooth animations

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Header.tsx                 # Wallet connection header
│   │   ├── MintingInterface.tsx       # Main minting UI
│   │   ├── ProgressBar.tsx            # Collection progress visualization
│   │   └── examples/                  # Component demos
│   ├── pages/
│   │   ├── home.tsx                   # Main landing page
│   │   └── not-found.tsx              # 404 page
│   ├── lib/
│   │   ├── privy-provider.tsx         # Privy configuration wrapper
│   │   └── queryClient.ts             # TanStack Query setup
│   ├── abi/
│   │   └── contractAbi.json           # Smart contract ABI
│   └── App.tsx                        # Root component
```

## Environment Variables

The following environment variables are configured:

- `VITE_PRIVY_APP_ID`: Your Privy application ID (required for wallet connection)
- `VITE_CONTRACT_ADDRESS`: `0x7d5C48A82E13168d84498548fe0a2282b9C1F16B`
- `VITE_CHAIN_ID`: `999` (Hyperliquid network)
- `VITE_RPC_URL`: `https://rpc.hyperliquid.xyz`

## Smart Contract Integration

The DApp connects to your deployed NFT contract with the following key functions:

- `totalSupply()`: Returns current minted NFT count
- `maxSupply()`: Returns maximum NFT collection size
- `hypeCost()`: Returns mint price in $HYPE tokens
- `maxMintAmount()`: Returns max NFTs per transaction
- `mintWithHype(uint256 quantity)`: Mints NFTs (payable with $HYPE)

## User Flow

1. **Connect Wallet**: User clicks "Connect Wallet" and authenticates via Privy
2. **View Collection**: See real-time supply, pricing, and collection progress
3. **Select Quantity**: Choose how many NFTs to mint (1-20)
4. **View Cost**: Total cost in $HYPE is calculated dynamically
5. **Mint**: Click mint button, approve transaction in wallet
6. **Confirmation**: Receive success notification with minted quantity

## Development Notes

- All NFT data is stored on-chain (no backend database needed)
- Contract interaction uses ethers.js v5 for compatibility
- Privy handles wallet connection, including embedded wallets
- The app automatically switches to the correct network (Chain 999)
- Transaction errors are caught and displayed to users with helpful messages

## Recent Changes

**2025-11-09**: Initial DApp implementation
- Created Privy wallet integration
- Built minting interface with quantity controls
- Added progress bar for collection tracking
- Configured smart contract connection
- Implemented transaction handling with error states

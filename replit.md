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

The DApp connects to your deployed NFT contract at `0x7d5C48A82E13168d84498548fe0a2282b9C1F16B`:

- `totalSupply()`: Returns current minted NFT count (70 NFTs)
- `maxSupply()`: Returns maximum NFT collection size (5,555 NFTs)
- `hypeCost()`: **Reverts** - price not set on-chain
- `maxMintAmount()`: **Reverts** - max mint not set on-chain
- `mintWithHype(uint256 quantity)`: **Reverts** - not functional for direct calls

**Important**: This contract is configured for **OpenSea minting only**. Direct contract calls to `mintWithHype()` revert. Users must mint through OpenSea where the minting infrastructure is properly configured with:
- Mint Price: 0.025 $HYPE
- Max Per Wallet: 1,000 NFTs

## User Flow

1. **Connect Wallet**: User clicks "Connect Wallet" and authenticates via Privy
2. **View Collection**: See real-time supply (70/5,555), pricing (0.025 $HYPE), and collection progress
3. **Browse Gallery**: Swipe through NFT artwork preview carousel
4. **Mint on OpenSea**: Click "Mint on OpenSea" button to open the collection on OpenSea
5. **Complete Purchase**: Mint NFTs through OpenSea's interface with proper contract integration

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

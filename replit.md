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

The DApp connects to **two contracts** for full functionality:

### NFT Contract (`0x7d5C48A82E13168d84498548fe0a2282b9C1F16B`)
- `totalSupply()`: Returns current minted NFT count (71 NFTs)
- `maxSupply()`: Returns maximum NFT collection size (5,555 NFTs)
- Holds the actual NFT tokens

### SeaDrop Protocol (`0x00005EA00Ac477B1030CE78506496e8C2dE24bf5`)
- `getPublicDrop()`: Returns minting configuration (price, max amount, timing)
- `mintPublic()`: Handles minting logic (same as OpenSea uses)
- **Current Settings** (fetched real-time):
  - Mint Price: **0.025 $HYPE**
  - Max Per Wallet: **1,000 NFTs**
  - Start Time: Active
  - End Time: Active

**Direct Minting**: Users can now mint directly through the DApp using the SeaDrop protocol. This is the same infrastructure that OpenSea uses, but integrated directly into your landing page.

## User Flow

1. **Connect Wallet**: User clicks "Connect Wallet" and authenticates via Privy
2. **View Collection**: See real-time supply (71/5,555), pricing, and collection progress
3. **Browse Gallery**: Swipe through NFT artwork preview carousel (4 images)
4. **Select Quantity**: Choose how many NFTs to mint (1-1,000)
5. **Mint Directly**: Click "Mint" button in the DApp
6. **Approve Transaction**: Confirm in wallet (automatically calculated: quantity × 0.025 HYPE)
7. **Success**: Receive minted NFTs and see updated supply count

## Development Notes

- All NFT data is fetched on-chain (no backend database needed)
- Contract interaction uses ethers.js v5 for compatibility
- Privy handles wallet connection, including embedded wallets
- The app automatically switches to the correct network (Chain 999)
- SeaDrop integration provides real-time minting configuration
- Minting uses the same protocol as OpenSea (SeaDrop public mint)
- Transaction errors are caught and displayed with user-friendly messages
- Supply updates automatically after successful mints

## Recent Changes

**2025-11-09**: SeaDrop Integration & Direct Minting
- ✅ Integrated SeaDrop protocol contract for minting
- ✅ Fetch real-time mint price and max amount from SeaDrop
- ✅ Enabled direct minting through DApp (no OpenSea redirect needed)
- ✅ Successfully tested minting flow (confirmed 70→71 NFTs)
- ✅ Created Privy wallet integration
- ✅ Built minting interface with quantity controls
- ✅ Added progress bar for collection tracking
- ✅ Configured smart contract connection
- ✅ Implemented transaction handling with error states

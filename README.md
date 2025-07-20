# PaperFans 📚⚡

> Decentralized Research Funding Platform powered by IOTA Identity

PaperFans is a revolutionary Web3 platform that democratizes scientific research funding through blockchain technology. Researchers can submit their papers, receive funding from the community, and share future revenue with their supporters.

## 🏗️ Architecture

This project consists of two main repositories:

- **Frontend Application** (this repository): Next.js web application with IOTA Identity integration
- **Smart Contracts** ([isc-rwa](https://github.com/Shawnchee/isc-rwa)): IOTA Smart Contracts for MUSDT tokens and RWA functionality

## 🌟 Features

- **Decentralized Funding**: Community-driven research funding using IOTA tokens
- **IOTA Identity Integration**: Secure authentication and identity management
- **MUSDT Token Support**: Mint and manage MUSDT tokens for funding
- **Research Discovery**: Browse and search research projects by category
- **Real-time Analytics**: Track funding progress and project statistics
- **Responsive Design**: Modern, sci-fi themed UI with smooth animations

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI components
- **Blockchain**: IOTA SDK, IOTA dApp Kit
- **Database**: Supabase
- **State Management**: React Query, Zustand
- **Authentication**: IOTA Identity
- **Forms**: React Hook Form with Zod validation

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- An IOTA wallet (Firefly or compatible)
- Access to IOTA devnet/testnet
- Supabase account and project

## 🛠️ Installation

1. **Clone the frontend repository**
   ```bash
   git clone https://github.com/Shawnchee/paperfans-iota.git
   cd paperfans-iota
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_IOTA_NETWORK=devnet
   ```

4. **Set up the database**
   ```bash
   # Run the SQL schema in your Supabase project
   # File: supabase-schema.sql
   ```

5. **Deploy smart contracts (Optional for development)**
   ```bash
   # Clone and deploy the smart contracts
   git clone https://github.com/Shawnchee/isc-rwa.git
   # Follow the deployment instructions in the Smart Contract Integration section
   ```

## 🏃‍♂️ Getting Started

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Connect your IOTA wallet**
   Use the ConnectButton to link your IOTA wallet

4. **Explore the platform**
   - Browse research projects on the homepage
   - Create new projects (requires authentication)
   - Visit `/onramp` to mint MUSDT tokens
   - Check `/dashboard` for your projects

## 🔗 Smart Contract Integration

### MUSDT Token Contract

**Smart Contract Repository**: [isc-rwa](https://github.com/Shawnchee/isc-rwa)

**Contract Address**: `[PLACEHOLDER - UPDATE AFTER DEPLOYMENT]`

**Treasury Cap**: `[PLACEHOLDER - UPDATE AFTER DEPLOYMENT]`

**Supply Object**: `[PLACEHOLDER - UPDATE AFTER DEPLOYMENT]`

> ⚠️ **Important**: Update the contract addresses in `src/lib/contract-config.ts` after deploying your smart contracts.

### Deployment Instructions

1. **Clone the smart contract repository**
   ```bash
   git clone https://github.com/Shawnchee/isc-rwa.git
   cd isc-rwa
   ```

2. **Navigate to the smart contracts directory**
   ```bash
   cd smart-contracts2
   ```

3. **Build and deploy the MUSDT contract**
   ```bash
   sui move build
   sui client publish --gas-budget 10000000
   ```

4. **Update configuration in this project**
   Edit `src/lib/contract-config.ts` with your deployed contract addresses:
   ```typescript
   export const CONTRACT_CONFIG = {
     MUSDT: {
       CONTRACT_ADDRESS: "0x...", // Your deployed contract address
       TREASURY_CAP_ADDRESS: "0x...", // Your treasury cap address
       SUPPLY_ADDRESS: "0x...", // Your supply object address
     }
   };
   ```

### Smart Contract Features

The [isc-rwa repository](https://github.com/Shawnchee/isc-rwa) includes:
- **MUSDT Token**: Mock USDT implementation for testing and development
- **Real World Asset (RWA) Integration**: Smart contracts for tokenizing real-world assets
- **IOTA Smart Contract (ISC) Compatibility**: Built for the IOTA ecosystem

For detailed deployment instructions, see [MUSDT_INTEGRATION.md](./MUSDT_INTEGRATION.md).

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication page
│   ├── dashboard/         # User dashboard
│   ├── onramp/           # Token minting interface
│   └── project/          # Project details pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── ...               # Feature-specific components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and services
│   ├── contract-config.ts # Smart contract configuration
│   ├── musdt-service.ts  # MUSDT token service
│   └── types.ts          # TypeScript type definitions
└── pages/                # Additional pages
```

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

For testing the MUSDT integration:
1. Deploy contracts to devnet
2. Update contract addresses
3. Test wallet connection
4. Test token minting functionality

## 📚 Documentation

- [Integration Summary](./INTEGRATION_SUMMARY.md) - Overview of implemented features
- [MUSDT Integration](./MUSDT_INTEGRATION.md) - Detailed token integration guide
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [Setup Guide](./SETUP.md) - Development environment setup

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start
   ```
## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Check the [documentation](./docs) for common issues
- Review the contract status component for configuration problems
- Verify wallet connection and network settings
- Check browser console for error messages


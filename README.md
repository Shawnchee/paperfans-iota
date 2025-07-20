# PaperFans 📚⚡

> Decentralized Research Funding Platform powered by IOTA Identity

PaperFans is a revolutionary Web3 platform that democratizes scientific research funding through blockchain technology. Researchers can submit their papers, receive funding from the community, and share future revenue with their supporters.

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

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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

**Contract Address**: `[PLACEHOLDER - UPDATE AFTER DEPLOYMENT]`

**Treasury Cap**: `[PLACEHOLDER - UPDATE AFTER DEPLOYMENT]`

**Supply Object**: `[PLACEHOLDER - UPDATE AFTER DEPLOYMENT]`

> ⚠️ **Important**: Update the contract addresses in `src/lib/contract-config.ts` after deploying your smart contracts.

### Deployment Instructions

1. **Deploy the MUSDT contract**
   ```bash
   cd contract/isc-rwa/smart-contracts2
   sui move build
   sui client publish --gas-budget 10000000
   ```

2. **Update configuration**
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Check the [documentation](./docs) for common issues
- Review the contract status component for configuration problems
- Verify wallet connection and network settings
- Check browser console for error messages

## 🔮 Roadmap

- [ ] Enhanced analytics dashboard
- [ ] Multi-token support
- [ ] Governance features
- [ ] Mobile app
- [ ] Integration with academic institutions
- [ ] Peer review system

---

Built with ❤️ using IOTA Identity and Next.js

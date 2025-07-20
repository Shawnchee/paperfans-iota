# 🚀 Paper Factory Deployment Guide

## Overview
This guide will help you deploy the new paper factory system where each research paper becomes its own smart contract with RCLT tokens.

## 📋 Prerequisites
- IOTA CLI installed and configured
- Wallet connected to testnet
- MUSDT contract already deployed (✅ Done)

## 🎯 Step-by-Step Deployment

### Step 1: Deploy the Paper Factory Contract

```bash
# Navigate to contract directory
cd contract/isc-rwa/smart-contracts

# Build the contracts
iota move build

# Deploy the factory contract
iota client publish --gas-budget 100000000
```

### Step 2: Record Contract Addresses

After deployment, you'll receive several addresses. Record these:

```typescript
// Update these in src/lib/contract-config.ts
export const CONTRACT_CONFIG = {
  // ... existing MUSDT config ...
  
  // Paper Factory Contract
  PAPER_FACTORY: {
    packageId: "0x...", // Factory package address
    factoryAddress: "0x...", // Factory object address
  }
};
```

### Step 3: Update API Routes

Update the factory address in the API routes:

```typescript
// In src/app/api/research/deploy-paper/route.ts
const factoryAddress = "0x..."; // Your deployed factory address
```

### Step 4: Test the System

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Create a new research paper:**
   - Go to `/create-project`
   - Fill out the form
   - Submit the form
   - Check console logs for deployment details

3. **Verify deployment:**
   - Check IOTA explorer for the new paper contract
   - Note the paper address, treasury cap, and policy cap

## 🔧 How It Works

### Form Submission Flow
```
User submits form → API call → Paper Factory → Deploy new paper contract → Return paper address
```

### What Gets Deployed
Each form submission creates:
- **New Paper Contract**: Individual smart contract for the research paper
- **RCLT Tokens**: Paper-specific tokens (6 decimals)
- **Treasury Cap**: Controls RCLT token minting
- **Policy Cap**: Controls RCLT token policy

### Token Economics
- **RCLT Price**: 1 MUSDT = 1 RCLT token (configurable)
- **Funding Goal**: Set in MUSDT
- **Investor Tracking**: Individual contribution records
- **Real-time Progress**: Live funding status

## 🎯 Next Steps After Deployment

### 1. Test Paper Creation
- Submit a test paper through the form
- Verify the paper contract is deployed
- Check the paper address in IOTA explorer

### 2. Test RCLT Token Purchase
- Use the purchase RCLT API
- Buy RCLT tokens with MUSDT
- Verify token balance and funding progress

### 3. Monitor the System
- Track paper deployments
- Monitor RCLT token purchases
- Check funding progress

## 🔍 Troubleshooting

### Common Issues

**1. Contract Deployment Fails**
- Check IOTA CLI is installed and connected
- Verify gas budget is sufficient
- Check network connectivity

**2. Form Submission Errors**
- Check browser console for detailed logs
- Verify wallet is connected
- Check API route configuration

**3. RCLT Purchase Fails**
- Verify paper address is correct
- Check MUSDT balance
- Verify RCLT price calculation

### Debug Commands

```bash
# Check IOTA CLI version
iota client --version

# Check wallet balance
iota client balance

# Check deployed objects
iota client objects

# Check transaction status
iota client tx-block <transaction-id>
```

## 📊 Expected Results

After successful deployment:

1. **Form Submission**: Creates new paper contract
2. **Paper Address**: Unique address for each paper
3. **RCLT Tokens**: Paper-specific tokens
4. **Funding Progress**: Real-time updates
5. **Investor Tracking**: Individual contributions

## 🎉 Success Indicators

- ✅ Paper contracts deploy successfully
- ✅ RCLT tokens can be purchased with MUSDT
- ✅ Funding progress updates in real-time
- ✅ Individual paper addresses are generated
- ✅ Treasury and policy caps are created

## 🔄 Future Enhancements

1. **Paper Registry**: Track all deployed papers
2. **Paper Discovery**: Browse available papers
3. **Advanced Tokenomics**: Dynamic RCLT pricing
4. **Revenue Sharing**: Automatic MUSDT distribution
5. **Paper Governance**: Voting mechanisms

---

**Ready to deploy?** Follow the steps above and let me know if you encounter any issues! 
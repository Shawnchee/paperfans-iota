// MUSDT Smart Contract Configuration
// Update these addresses with the actual deployed contract addresses on IOTA

export const CONTRACT_CONFIG = {
  // MUSDT Contract addresses (replace with actual deployed addresses)
  MUSDT: {
    CONTRACT_ADDRESS: "0x0340088cd31baeb07c273153374813aa4995a7db7027cf719fb15fd0f93dbd67", // Deployed package address on testnet
    TREASURY_CAP_ADDRESS: "0x03a26b77ff708f7eee59df15c7268a153689f5fdc4a178b188f636c180f5769a", // Treasury cap address on testnet
    SUPPLY_ADDRESS: "0x4ac50eb063d74666218ae9c8b3b06a5dddb499139ba41fe0b886bf7f4d562de1", // Supply object address on testnet
    DECIMALS: 6,
    SYMBOL: "MUSDT",
    NAME: "Mock USDT",
    DESCRIPTION: "Mock USDT for testing purposes"
  },
  
  // Research Contract addresses (if needed)
  RESEARCH: {
    CONTRACT_ADDRESS: "0x...", // Replace with actual deployed research contract address
  }
};

// Network configuration
export const NETWORK_CONFIG = {
  DEVNET: {
    name: "devnet",
    url: "https://api.testnet.shimmer.network",
    chainId: "shimmer_testnet"
  },
  TESTNET: {
    name: "testnet", 
    url: "https://api.testnet.iota.cafe",
    chainId: "shimmer_testnet"
  },
  LOCAL: {
    name: "local",
    url: "http://127.0.0.1:9000",
    chainId: "local"
  }
};

// Helper function to get contract address
export function getContractAddress(contractName: keyof typeof CONTRACT_CONFIG): string {
  return CONTRACT_CONFIG[contractName].CONTRACT_ADDRESS;
}

// Helper function to get treasury cap address
export function getTreasuryCapAddress(): string {
  return CONTRACT_CONFIG.MUSDT.TREASURY_CAP_ADDRESS;
}

// Helper function to get supply address
export function getSupplyAddress(): string {
  return CONTRACT_CONFIG.MUSDT.SUPPLY_ADDRESS;
} 
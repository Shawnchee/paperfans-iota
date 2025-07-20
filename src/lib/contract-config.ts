// Contract addresses and configuration
export const CONTRACT_CONFIG = {
  // MUSDT Token Contract (Updated from latest deployment)
  MUSDT: {
    packageId: "0x70a3bbc4b242cc53f8fbd6f8d84123eb7d642adbccbf3ce2bb4e5650cd95b9dd",
    treasuryCap: "0x3492a81d2f629d7fe0ab83c7c92bd9c685b5255a83ea5db0aed4c9a443c766ac",
    policyCap: "0x5a601f4aa18cb5d004189c6732b77f5a7477476fa255fd09206510a04c979e9e"
  },
  
  // Research Contract (Updated with String types)
  RESEARCH: {
    packageId: "0xcf6cc4724e561e956969b01f980bcb049ae3566eb25fdc48431f218bd2a8a319",
    treasuryCap: "0xcf8669213e29f9d40f9dbf65c77c5d23f75a8767d17c90a3df31c094c419d675",
    policyCap: "0xa171b489137e7d5bcb9d9fce03466975bb42b90a7dedddb7b7b4a0062eef1270"
  }
};

// Network configuration
export const NETWORK_CONFIG = {
  testnet: {
    url: "https://api.testnet.iota.cafe",
    name: "IOTA Testnet"
  }
};

// Helper function to get contract address
export function getContractAddress(contractName: keyof typeof CONTRACT_CONFIG): string {
  return CONTRACT_CONFIG[contractName].packageId;
}

// Helper function to get treasury cap address
export function getTreasuryCapAddress(): string {
  return CONTRACT_CONFIG.MUSDT.treasuryCap;
}

// Helper function to get supply address
export function getSupplyAddress(): string {
  return CONTRACT_CONFIG.MUSDT.packageId;
}

// Helper function to get research treasury cap address
export function getResearchTreasuryCapAddress(): string {
  return CONTRACT_CONFIG.RESEARCH.treasuryCap;
}

// Helper function to get research policy cap address
export function getResearchPolicyCapAddress(): string {
  return CONTRACT_CONFIG.RESEARCH.policyCap;
} 
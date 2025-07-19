import { useCurrentAccount, useIotaClientQuery } from '@iota/dapp-kit';
import { CONTRACT_CONFIG, getContractAddress, getTreasuryCapAddress, getSupplyAddress } from './contract-config';

export interface MUSDTBalance {
  address: string;
  balance: number;
}

export interface MUSDTMintResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export class MUSDTService {
  private static instance: MUSDTService;

  public static getInstance(): MUSDTService {
    if (!MUSDTService.instance) {
      MUSDTService.instance = new MUSDTService();
    }
    return MUSDTService.instance;
  }

  /**
   * Get MUSDT balance for a wallet address
   */
  async getBalance(address: string): Promise<number> {
    try {
      // Check if contract addresses are configured
      const contractAddress = getContractAddress('MUSDT');
      if (contractAddress === "0x..." || contractAddress === "0x0340088cd31baeb07c273153374813aa4995a7db7027cf719fb15fd0f93dbd67") {
        // For now, return a mock balance since we need to implement proper RPC calls
        // In a real implementation, you would query the contract for the user's balance
        return 0;
      }

      return 0;
    } catch (error) {
      console.error('Error getting MUSDT balance:', error);
      return 0;
    }
  }

  /**
   * Mint MUSDT tokens to a user's wallet using the API endpoint
   */
  async mintToUser(
    userAddress: string, 
    amount: number
  ): Promise<MUSDTMintResult> {
    try {
      // Validate inputs
      if (!userAddress || amount <= 0) {
        return {
          success: false,
          error: 'Invalid address or amount'
        };
      }

      // Check if contract addresses are configured
      const contractAddress = getContractAddress('MUSDT');
      const treasuryCapAddress = getTreasuryCapAddress();
      const supplyAddress = getSupplyAddress();

      if (contractAddress === "0x..." || treasuryCapAddress === "0x..." || supplyAddress === "0x...") {
        return {
          success: false,
          error: 'MUSDT contract not deployed or addresses not configured'
        };
      }

      // Call the API endpoint to execute the real transaction
      const response = await fetch('/api/musdt/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress,
          amount
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true,
          transactionId: result.transactionId
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to mint MUSDT tokens'
        };
      }

    } catch (error) {
      console.error('Error minting MUSDT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get total supply of MUSDT tokens
   */
  async getTotalSupply(): Promise<number> {
    try {
      const contractAddress = getContractAddress('MUSDT');
      if (contractAddress === "0x...") {
        console.warn('MUSDT contract address not configured, returning 0 supply');
        return 0;
      }

      // Query the supply object to get total minted
      // This would be a read-only call to the contract
      return 0;
    } catch (error) {
      console.error('Error getting total supply:', error);
      return 0;
    }
  }

  /**
   * Get contract configuration
   */
  getContractConfig() {
    return CONTRACT_CONFIG.MUSDT;
  }
}

// React hook for MUSDT operations
export function useMUSDT() {
  const account = useCurrentAccount();
  const service = MUSDTService.getInstance();

  const getBalance = async (): Promise<number> => {
    if (!account?.address) return 0;
    return await service.getBalance(account.address);
  };

  const mintTokens = async (amount: number): Promise<MUSDTMintResult> => {
    if (!account?.address) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    // Use the service to mint tokens
    return await service.mintToUser(account.address, amount);
  };

  const getTotalSupply = async (): Promise<number> => {
    return await service.getTotalSupply();
  };

  const getContractConfig = () => {
    return service.getContractConfig();
  };

  return {
    getBalance,
    mintTokens,
    getTotalSupply,
    getContractConfig,
    isConnected: !!account?.address,
    address: account?.address
  };
} 
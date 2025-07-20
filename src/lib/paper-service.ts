import { useCurrentAccount } from '@iota/dapp-kit';
import { CONTRACT_CONFIG, getContractAddress } from './contract-config';

export interface PaperData {
  title: string;
  abstract: string;
  category: string;
  domain: string;
  tags: string[];
  technicalApproach: string;
  projectImage: string;
  authorName: string;
  authorAffiliation: string;
  authorImage: string;
  orcidId: string;
  fundingGoal: number;
  campaignDurationDays: number;
  researchTeamPercentage: number;
  revenueModels: string[];
  rcltPriceInMusdt: number;
}

export interface PaperDeploymentResult {
  success: boolean;
  transactionId?: string;
  paperId?: string;
  treasuryCapId?: string;
  policyCapId?: string;
  error?: string;
}

export interface RcltPurchaseResult {
  success: boolean;
  transactionId?: string;
  rcltTokensId?: string;
  musdtAmount?: number;
  rcltTokensReceived?: number;
  error?: string;
}

export interface PaperInfo {
  paperId: string;
  paperAddress: string;
  title: string;
  abstract: string;
  category: string;
  domain: string;
  authorName: string;
  authorAffiliation: string;
  fundingGoal: number;
  totalInvested: number;
  rcltPriceInMusdt: number;
  totalRcltMinted: number;
  musdtBalance: number;
  fundingProgress: number;
  isFunded: boolean;
  status: string;
  creationTimestamp: number;
}

export class PaperService {
  private static instance: PaperService;

  public static getInstance(): PaperService {
    if (!PaperService.instance) {
      PaperService.instance = new PaperService();
    }
    return PaperService.instance;
  }

  /**
   * Deploy a new research paper contract
   */
  async deployPaper(
    paperData: PaperData,
    userAddress: string
  ): Promise<PaperDeploymentResult> {
    console.log("🔧 PaperService.deployPaper called");
    console.log("📋 Paper data:", paperData);
    console.log("👤 User address:", userAddress);
    
    try {
      // Validate inputs
      console.log("🔍 Validating paper data...");
      const missingFields = [];
      if (!paperData.title) missingFields.push("title");
      if (!paperData.abstract) missingFields.push("abstract");
      if (!paperData.category) missingFields.push("category");
      if (!paperData.domain) missingFields.push("domain");
      if (!paperData.authorName) missingFields.push("authorName");
      if (!paperData.authorAffiliation) missingFields.push("authorAffiliation");
      if (!paperData.fundingGoal) missingFields.push("fundingGoal");
      if (!paperData.rcltPriceInMusdt) missingFields.push("rcltPriceInMusdt");
      if (!userAddress) missingFields.push("userAddress");

      if (missingFields.length > 0) {
        console.error("❌ Missing required fields:", missingFields);
        return {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`
        };
      }
      
      console.log("✅ Paper data validation passed");

      // Call the API endpoint to deploy the paper
      console.log("🌐 Calling API endpoint: /api/research/deploy-paper");
      const requestBody = {
        ...paperData,
        userAddress
      };
      console.log("📤 Request body:", requestBody);
      
      const response = await fetch('/api/research/deploy-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log("📥 Response status:", response.status);
      console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log("📥 Response body:", result);

      if (response.ok && result.success) {
        console.log("✅ Paper deployment successful");
        console.log("Transaction ID:", result.transactionId);
        console.log("Paper ID:", result.paperId);
        return {
          success: true,
          transactionId: result.transactionId,
          paperId: result.paperId,
          treasuryCapId: result.treasuryCapId,
          policyCapId: result.policyCapId
        };
      } else {
        console.error("❌ Paper deployment failed");
        console.error("Response status:", response.status);
        console.error("Response error:", result.error);
        return {
          success: false,
          error: result.error || 'Failed to deploy research paper'
        };
      }

    } catch (error) {
      console.error('💥 Error deploying paper:');
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('Full error object:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Purchase RCLT tokens with MUSDT
   */
  async purchaseRcltTokens(
    paperAddress: string,
    musdtAmount: number,
    userAddress: string
  ): Promise<RcltPurchaseResult> {
    console.log("🔧 PaperService.purchaseRcltTokens called");
    console.log("📋 Purchase data:", { paperAddress, musdtAmount, userAddress });
    
    try {
      // Validate inputs
      console.log("🔍 Validating purchase data...");
      const missingFields = [];
      if (!paperAddress) missingFields.push("paperAddress");
      if (!musdtAmount) missingFields.push("musdtAmount");
      if (!userAddress) missingFields.push("userAddress");

      if (missingFields.length > 0) {
        console.error("❌ Missing required fields:", missingFields);
        return {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`
        };
      }
      
      console.log("✅ Purchase data validation passed");

      // Call the API endpoint to purchase RCLT tokens
      console.log("🌐 Calling API endpoint: /api/research/purchase-rclt");
      const requestBody = {
        paperAddress,
        musdtAmount,
        userAddress
      };
      console.log("📤 Request body:", requestBody);
      
      const response = await fetch('/api/research/purchase-rclt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log("📥 Response status:", response.status);
      console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log("📥 Response body:", result);

      if (response.ok && result.success) {
        console.log("✅ RCLT purchase successful");
        console.log("Transaction ID:", result.transactionId);
        console.log("RCLT Tokens ID:", result.rcltTokensId);
        return {
          success: true,
          transactionId: result.transactionId,
          rcltTokensId: result.rcltTokensId,
          musdtAmount: result.musdtAmount
        };
      } else {
        console.error("❌ RCLT purchase failed");
        console.error("Response status:", response.status);
        console.error("Response error:", result.error);
        return {
          success: false,
          error: result.error || 'Failed to purchase RCLT tokens'
        };
      }

    } catch (error) {
      console.error('💥 Error purchasing RCLT tokens:');
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('Full error object:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get paper information
   */
  async getPaperInfo(paperAddress: string): Promise<PaperInfo | null> {
    try {
      // This would query the paper object on the blockchain
      // For now, returning mock data
      console.log("🔍 Getting paper info for:", paperAddress);
      return null;
    } catch (error) {
      console.error('Error getting paper info:', error);
      return null;
    }
  }

  /**
   * Calculate RCLT tokens for MUSDT amount
   */
  calculateRcltForMusdt(rcltPriceInMusdt: number, musdtAmount: number): number {
    if (rcltPriceInMusdt <= 0) return 0;
    return Math.floor(musdtAmount / rcltPriceInMusdt);
  }

  /**
   * Get contract configuration
   */
  getContractConfig() {
    return CONTRACT_CONFIG;
  }
}

// React hook for paper operations
export function usePaper() {
  const account = useCurrentAccount();
  const service = PaperService.getInstance();

  const deployPaper = async (paperData: PaperData): Promise<PaperDeploymentResult> => {
    if (!account?.address) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    return await service.deployPaper(paperData, account.address);
  };

  const purchaseRcltTokens = async (paperAddress: string, musdtAmount: number): Promise<RcltPurchaseResult> => {
    if (!account?.address) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    return await service.purchaseRcltTokens(paperAddress, musdtAmount, account.address);
  };

  const getPaperInfo = async (paperAddress: string) => {
    return await service.getPaperInfo(paperAddress);
  };

  const calculateRcltForMusdt = (rcltPriceInMusdt: number, musdtAmount: number): number => {
    return service.calculateRcltForMusdt(rcltPriceInMusdt, musdtAmount);
  };

  const getContractConfig = () => {
    return service.getContractConfig();
  };

  return {
    deployPaper,
    purchaseRcltTokens,
    getPaperInfo,
    calculateRcltForMusdt,
    getContractConfig,
    isConnected: !!account?.address,
    address: account?.address
  };
} 
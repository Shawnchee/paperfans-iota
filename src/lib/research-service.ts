import { useCurrentAccount } from '@iota/dapp-kit';
import { CONTRACT_CONFIG, getContractAddress, getResearchTreasuryCapAddress, getResearchPolicyCapAddress } from './contract-config';

export interface ResearchProposalData {
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
}

export interface ResearchProposalResult {
  success: boolean;
  transactionId?: string;
  proposalId?: string;
  error?: string;
}

export class ResearchService {
  private static instance: ResearchService;

  public static getInstance(): ResearchService {
    if (!ResearchService.instance) {
      ResearchService.instance = new ResearchService();
    }
    return ResearchService.instance;
  }

  /**
   * Create a research proposal using the smart contract
   */
  async createProposal(
    proposalData: ResearchProposalData,
    userAddress: string
  ): Promise<ResearchProposalResult> {
    console.log("🔧 ResearchService.createProposal called");
    console.log("📋 Proposal data:", proposalData);
    console.log("👤 User address:", userAddress);
    
    try {
      // Validate inputs
      console.log("🔍 Validating proposal data...");
      const missingFields = [];
      if (!proposalData.title) missingFields.push("title");
      if (!proposalData.abstract) missingFields.push("abstract");
      if (!proposalData.category) missingFields.push("category");
      if (!proposalData.domain) missingFields.push("domain");
      if (!proposalData.authorName) missingFields.push("authorName");
      if (!proposalData.authorAffiliation) missingFields.push("authorAffiliation");
      if (!proposalData.fundingGoal) missingFields.push("fundingGoal");
      if (!userAddress) missingFields.push("userAddress");

      if (missingFields.length > 0) {
        console.error("❌ Missing required fields:", missingFields);
        return {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`
        };
      }
      
      console.log("✅ Proposal data validation passed");

      // Check if contract addresses are configured
      console.log("🔍 Checking contract addresses...");
      const contractAddress = getContractAddress('RESEARCH');
      const treasuryCapAddress = getResearchTreasuryCapAddress();
      const policyCapAddress = getResearchPolicyCapAddress();

      console.log("📋 Contract addresses:");
      console.log("  - Research contract:", contractAddress);
      console.log("  - Treasury cap:", treasuryCapAddress);
      console.log("  - Policy cap:", policyCapAddress);

      if (contractAddress === "0x..." || treasuryCapAddress === "0x..." || policyCapAddress === "0x...") {
        console.error("❌ Contract addresses not configured");
        return {
          success: false,
          error: 'Research contract not deployed or addresses not configured'
        };
      }
      
      console.log("✅ Contract addresses configured");

      // Call the API endpoint to create the proposal
      console.log("🌐 Calling API endpoint: /api/research/create-proposal");
      const requestBody = {
        ...proposalData,
        userAddress
      };
      console.log("📤 Request body:", requestBody);
      
      const response = await fetch('/api/research/create-proposal', {
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
        console.log("✅ API call successful");
        console.log("Transaction ID:", result.transactionId);
        console.log("Proposal ID:", result.proposalId);
        return {
          success: true,
          transactionId: result.transactionId,
          proposalId: result.proposalId
        };
      } else {
        console.error("❌ API call failed");
        console.error("Response status:", response.status);
        console.error("Response error:", result.error);
        return {
          success: false,
          error: result.error || 'Failed to create research proposal'
        };
      }

    } catch (error) {
      console.error('💥 Error creating research proposal:');
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
   * Get research proposal information
   */
  async getProposalInfo(proposalId: string): Promise<any> {
    try {
      const contractAddress = getContractAddress('RESEARCH');
      if (contractAddress === "0x...") {
        console.warn('Research contract address not configured');
        return null;
      }

      // This would query the proposal object on the blockchain
      // For now, returning mock data
      return null;
    } catch (error) {
      console.error('Error getting proposal info:', error);
      return null;
    }
  }

  /**
   * Get contract configuration
   */
  getContractConfig() {
    return CONTRACT_CONFIG.RESEARCH;
  }
}

// React hook for research operations
export function useResearch() {
  const account = useCurrentAccount();
  const service = ResearchService.getInstance();

  const createProposal = async (proposalData: ResearchProposalData): Promise<ResearchProposalResult> => {
    console.log("🔧 useResearch.createProposal called");
    console.log("👤 Account:", account);
    console.log("📋 Proposal data:", proposalData);
    
    if (!account?.address) {
      console.error("❌ No wallet address available");
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    console.log("✅ Wallet address available:", account.address);
    return await service.createProposal(proposalData, account.address);
  };

  const getProposalInfo = async (proposalId: string) => {
    return await service.getProposalInfo(proposalId);
  };

  const getContractConfig = () => {
    return service.getContractConfig();
  };

  return {
    createProposal,
    getProposalInfo,
    getContractConfig,
    isConnected: !!account?.address,
    address: account?.address
  };
} 
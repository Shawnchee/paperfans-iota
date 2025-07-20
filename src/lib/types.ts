export interface Project {
  id: number;
  title: string;
  abstract: string;
  category: string;
  authorName: string;
  authorAffiliation: string;
  authorImage?: string;
  imageUrl?: string;
  fundingGoal: number;
  currentFunding: number;
  backerCount: number;
  daysLeft: number;
  technicalApproach?: string;
  timeline?: string | TimelineItem[];
  recentActivity?: string | ActivityItem[];
  fundingTiers?: FundingTier[];
  createdAt: string;
  updatedAt: string;
}

export interface FundingTier {
  id: number;
  projectId: number;
  name: string;
  description: string;
  amount: number;
  benefits: string[];
  backerCount: number;
  maxBackers?: number;
}

export interface ProjectWithTiers extends Project {
  fundingTiers?: FundingTier[];
}

export interface FundingRequest {
  amount: number;
  walletAddress?: string;
}

export interface FundingResponse {
  success: boolean;
  transactionId: string;
  newFundingAmount: number;
  message: string;
}

export interface TimelineItem {
  phase: string;
  duration: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

export interface ActivityItem {
  type: 'funding' | 'milestone' | 'update';
  user?: string;
  amount?: number;
  description?: string;
  time: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  walletAddress?: string;
  mustdtBalance: number;
  orcidId?: string;
  createdAt: string;
  updatedAt: string;
  authUserRef: string;
}

export interface CreateUserRequest {
  email: string;
  name?: string;
  avatarUrl?: string;
  walletAddress?: string;
  orcidId?: string;
}

export interface UpdateUserRequest {
  name?: string;
  avatarUrl?: string;
  walletAddress?: string;
  orcidId?: string;
}

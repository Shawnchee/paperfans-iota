"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Vote, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Calendar,
  DollarSign,
  Brain,
  Shield,
  Globe,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for the AI-Powered Research Assistant project
const mockProject = {
  id: 3,
  title: "AI-Powered Research Assistant",
  abstract: "An intelligent assistant that helps researchers discover, analyze, and synthesize scientific literature using advanced AI models.",
  currentFunding: 45000,
  totalFunding: 75000,
  tokenHolders: 156,
  totalTokens: 50000,
  userTokens: 1250, // User's token balance
  lastUpdate: "2024-01-15T10:30:00Z",
  status: "active" as const,
};

// Mock voting proposals
const mockProposals = [
  {
    id: 1,
    title: "Open Source vs. Proprietary Model Release",
    description: "Should the AI model be released as open source for the scientific community, or kept proprietary for commercial licensing?",
    category: "Model Distribution",
    status: "active" as const,
    startDate: "2024-01-10T00:00:00Z",
    endDate: "2024-01-20T23:59:59Z",
    totalVotes: 89,
    options: [
      {
        id: "open_source",
        label: "Open Source Release",
        description: "Release the model under MIT license for free use",
        votes: 52,
        percentage: 58.4,
        pros: ["Faster scientific adoption", "Community contributions", "Transparency"],
        cons: ["No direct revenue", "Competition from big tech", "Potential misuse"]
      },
      {
        id: "proprietary",
        label: "Proprietary Licensing",
        description: "Keep model proprietary with commercial licensing",
        votes: 37,
        percentage: 41.6,
        pros: ["Revenue generation", "Control over usage", "Competitive advantage"],
        cons: ["Slower adoption", "Limited accessibility", "Community backlash"]
      }
    ],
    userVote: null, // null = not voted, "open_source" or "proprietary"
    quorum: 100,
    minTokens: 100
  },
  {
    id: 2,
    title: "Data Privacy: Anonymized vs. Identified Research",
    description: "Should research data be fully anonymized or allow researcher identification for collaboration?",
    category: "Privacy & Ethics",
    status: "active" as const,
    startDate: "2024-01-12T00:00:00Z",
    endDate: "2024-01-22T23:59:59Z",
    totalVotes: 67,
    options: [
      {
        id: "anonymized",
        label: "Full Anonymization",
        description: "All research data completely anonymized",
        votes: 28,
        percentage: 41.8,
        pros: ["Maximum privacy protection", "Compliance with regulations", "Reduced bias"],
        cons: ["Limited collaboration", "Reduced accountability", "Harder to verify"]
      },
      {
        id: "identified",
        label: "Researcher Identification",
        description: "Allow researcher identification for collaboration",
        votes: 39,
        percentage: 58.2,
        pros: ["Better collaboration", "Increased accountability", "Easier verification"],
        cons: ["Privacy concerns", "Potential bias", "Regulatory complexity"]
      }
    ],
    userVote: "anonymized",
    quorum: 100,
    minTokens: 100
  },
  {
    id: 3,
    title: "AI Model Training: Academic vs. Commercial Data",
    description: "Should the AI model be trained on academic papers only, or include commercial research data?",
    category: "Data Sources",
    status: "upcoming" as const,
    startDate: "2024-01-25T00:00:00Z",
    endDate: "2024-02-04T23:59:59Z",
    totalVotes: 0,
    options: [
      {
        id: "academic_only",
        label: "Academic Papers Only",
        description: "Train exclusively on peer-reviewed academic papers",
        votes: 0,
        percentage: 0,
        pros: ["Higher quality data", "Peer-reviewed content", "Academic focus"],
        cons: ["Limited scope", "Slower updates", "Missing industry insights"]
      },
      {
        id: "include_commercial",
        label: "Include Commercial Data",
        description: "Include commercial research and industry papers",
        votes: 0,
        percentage: 0,
        pros: ["Broader scope", "Industry insights", "Faster updates"],
        cons: ["Quality concerns", "Potential bias", "Copyright issues"]
      }
    ],
    userVote: null,
    quorum: 100,
    minTokens: 100
  },
  {
    id: 4,
    title: "Revenue Sharing: Researchers vs. Platform",
    description: "How should revenue from commercial licensing be distributed between researchers and the platform?",
    category: "Economics",
    status: "completed" as const,
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-01-10T23:59:59Z",
    totalVotes: 134,
    options: [
      {
        id: "researchers_70",
        label: "70% Researchers, 30% Platform",
        description: "Majority share to researchers",
        votes: 89,
        percentage: 66.4,
        pros: ["Better researcher incentives", "Fair compensation", "Community support"],
        cons: ["Less platform funding", "Reduced development budget", "Sustainability concerns"]
      },
      {
        id: "researchers_50",
        label: "50% Researchers, 50% Platform",
        description: "Equal split between researchers and platform",
        votes: 45,
        percentage: 33.6,
        pros: ["Balanced funding", "Platform sustainability", "Continued development"],
        cons: ["Lower researcher incentives", "Community dissatisfaction", "Reduced participation"]
      }
    ],
    userVote: "researchers_70",
    quorum: 100,
    minTokens: 100
  }
];

// Mock project updates
const mockUpdates = [
  {
    id: 1,
    title: "Phase 1 Complete: Data Collection Pipeline",
    content: "Successfully collected and processed 50,000+ academic papers across multiple disciplines. Data quality validation shows 98% accuracy in text extraction.",
    date: "2024-01-15T10:30:00Z",
    author: "Dr. Sarah Chen",
    category: "milestone",
    impact: "high" as const
  },
  {
    id: 2,
    title: "AI Model Training Progress: 75% Complete",
    content: "The transformer model has completed 75% of training on the collected dataset. Initial benchmarks show promising results in literature analysis tasks.",
    date: "2024-01-14T16:45:00Z",
    author: "AI Team",
    category: "progress",
    impact: "medium" as const
  },
  {
    id: 3,
    title: "Community Feedback Integration",
    content: "Incorporated feedback from 200+ researchers on the beta interface. Key improvements include better search filters and citation tracking.",
    date: "2024-01-13T09:15:00Z",
    author: "UX Team",
    category: "feedback",
    impact: "medium" as const
  },
  {
    id: 4,
    title: "Funding Milestone: $45K Raised",
    content: "Reached 60% of funding goal with $45,000 raised from 156 token holders. Strong community support continues to grow.",
    date: "2024-01-12T14:20:00Z",
    author: "Finance Team",
    category: "funding",
    impact: "high" as const
  }
];

export default function DAOPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProposal, setSelectedProposal] = useState<typeof mockProposals[0] | null>(null);
  const [userVotes, setUserVotes] = useState<Record<number, string>>({
    2: "anonymized", // User has voted on proposal 2
    4: "researchers_70" // User has voted on proposal 4
  });

  const handleVote = (proposalId: number, optionId: string) => {
    if (mockProject.userTokens < selectedProposal!.minTokens) {
      toast({
        title: "Insufficient Tokens",
        description: `You need at least ${selectedProposal!.minTokens} tokens to vote on this proposal.`,
        variant: "destructive",
      });
      return;
    }

    setUserVotes(prev => ({
      ...prev,
      [proposalId]: optionId
    }));

    toast({
      title: "Vote Cast Successfully",
      description: "Your vote has been recorded. Thank you for participating in governance!",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "upcoming": return "bg-blue-500/20 text-blue-400";
      case "completed": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-500/20 text-red-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      case "low": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-cyan">DAO Governance</h1>
          <p className="text-gray-400">Participate in the governance of the AI-Powered Research Assistant project</p>
        </div>

        {/* Project Overview Card */}
        <Card className="mb-8 bg-black/70 border border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">{mockProject.title}</CardTitle>
                <CardDescription className="text-gray-400 mt-2">{mockProject.abstract}</CardDescription>
              </div>
              <Badge className={getStatusColor(mockProject.status)}>{mockProject.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-cyan">${mockProject.currentFunding.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Raised of ${mockProject.totalFunding.toLocaleString()}</div>
                <Progress value={(mockProject.currentFunding / mockProject.totalFunding) * 100} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-purple">{mockProject.tokenHolders}</div>
                <div className="text-sm text-gray-400">Token Holders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{mockProject.userTokens}</div>
                <div className="text-sm text-gray-400">Your Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{mockProject.totalTokens.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Tokens</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/40">
            <TabsTrigger value="overview" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
              <Vote className="w-4 h-4 mr-2" />
              Active Votes
            </TabsTrigger>
            <TabsTrigger value="updates" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
              <TrendingUp className="w-4 h-4 mr-2" />
              Project Updates
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
              <Clock className="w-4 h-4 mr-2" />
              Voting History
            </TabsTrigger>
          </TabsList>

          {/* Active Votes Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockProposals.filter(p => p.status === "active").map((proposal) => (
                <Card key={proposal.id} className="bg-black/70 border border-white/10 hover:border-neon-cyan/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold mb-2">{proposal.title}</CardTitle>
                        <CardDescription className="text-gray-400 mb-3">{proposal.description}</CardDescription>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {proposal.totalVotes} votes
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getTimeRemaining(proposal.endDate)}
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {proposal.options.map((option) => (
                        <div key={option.id} className="p-3 border border-white/10 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold">{option.label}</div>
                            <div className="text-sm text-gray-400">{option.percentage.toFixed(1)}%</div>
                          </div>
                          <div className="text-sm text-gray-400 mb-2">{option.description}</div>
                          <Progress value={option.percentage} className="mb-2" />
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{option.votes} votes</span>
                            {userVotes[proposal.id] === option.id && (
                              <span className="text-green-400 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Your vote
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full mt-4 sci-fi-button"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <Vote className="w-4 h-4 mr-2" />
                      Vote Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Project Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {mockUpdates.map((update) => (
                <Card key={update.id} className="bg-black/70 border border-white/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg font-bold">{update.title}</CardTitle>
                          <Badge className={getImpactColor(update.impact)}>{update.impact} impact</Badge>
                        </div>
                        <CardDescription className="text-gray-400">
                          {formatDate(update.date)} • {update.author}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">{update.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Voting History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockProposals.filter(p => p.status === "completed").map((proposal) => (
                <Card key={proposal.id} className="bg-black/70 border border-white/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold mb-2">{proposal.title}</CardTitle>
                        <CardDescription className="text-gray-400 mb-3">{proposal.description}</CardDescription>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {proposal.totalVotes} votes
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {proposal.options.map((option) => (
                        <div key={option.id} className="p-3 border border-white/10 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold">{option.label}</div>
                            <div className="text-sm text-gray-400">{option.percentage.toFixed(1)}%</div>
                          </div>
                          <div className="text-sm text-gray-400 mb-2">{option.description}</div>
                          <Progress value={option.percentage} className="mb-2" />
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{option.votes} votes</span>
                            {userVotes[proposal.id] === option.id && (
                              <span className="text-green-400 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Your vote
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Voting Modal */}
        {selectedProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-neon-cyan/50 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-neon-cyan">Cast Your Vote</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProposal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{selectedProposal.title}</h3>
                <p className="text-gray-400 mb-4">{selectedProposal.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Quorum: {selectedProposal.quorum} votes</span>
                  <span>Min tokens: {selectedProposal.minTokens}</span>
                  <span>Your tokens: {mockProject.userTokens}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {selectedProposal.options.map((option) => (
                  <div key={option.id} className="border border-white/20 rounded-lg p-4 hover:border-neon-cyan/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="vote"
                        id={option.id}
                        value={option.id}
                        className="mt-1"
                        checked={userVotes[selectedProposal.id] === option.id}
                        onChange={() => setUserVotes(prev => ({
                          ...prev,
                          [selectedProposal.id]: option.id
                        }))}
                      />
                      <div className="flex-1">
                        <label htmlFor={option.id} className="font-semibold cursor-pointer">{option.label}</label>
                        <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                        
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-green-400 mb-1">Pros:</h4>
                            <ul className="text-xs text-gray-400 space-y-1">
                              {option.pros.map((pro, index) => (
                                <li key={index}>• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-red-400 mb-1">Cons:</h4>
                            <ul className="text-xs text-gray-400 space-y-1">
                              {option.cons.map((con, index) => (
                                <li key={index}>• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProposal(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 sci-fi-button"
                  onClick={() => {
                    if (userVotes[selectedProposal.id]) {
                      handleVote(selectedProposal.id, userVotes[selectedProposal.id]);
                      setSelectedProposal(null);
                    } else {
                      toast({
                        title: "No Option Selected",
                        description: "Please select an option before voting.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Vote className="w-4 h-4 mr-2" />
                  Cast Vote
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
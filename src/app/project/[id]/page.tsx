"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FundingProgress } from "@/components/funding-progress";
import { useToast } from "@/hooks/use-toast";
import type {
  Project,
  FundingTier,
  TimelineItem,
  ActivityItem,
  FundingRequest,
  FundingResponse,
} from "@/lib/types";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

const categoryColors = {
  "AI/ML": "bg-neon-cyan/20 text-neon-cyan",
  Quantum: "bg-neon-purple/20 text-neon-purple",
  Biotech: "bg-neon-green/20 text-neon-green",
  Climate: "bg-neon-cyan/20 text-neon-cyan",
  Neuro: "bg-neon-purple/20 text-neon-purple",
  Crypto: "bg-neon-green/20 text-neon-green",
};

// Mock data for development
const mockProjects: Record<string, Project> = {
  "1": {
    id: 1,
    title: "Decentralized Content Platform",
    abstract:
      "A revolutionary platform for content creators to monetize their work using IOTA technology.",
    category: "Crypto",
    authorName: "PaperFans Team",
    authorAffiliation: "PaperFans IOTA",
    authorImage: "/next.svg",
    imageUrl: "/next.svg",
    fundingGoal: 50000,
    currentFunding: 35000,
    backerCount: 1250,
    daysLeft: 15,
    technicalApproach:
      "This project leverages IOTA's feeless and scalable distributed ledger technology to create a seamless content monetization platform. We use smart contracts to handle revenue sharing and implement a reputation system for content quality.",
    timeline: JSON.stringify([
      {
        phase: "Research & Design",
        duration: "2 months",
        description: "Market research and platform architecture design",
        status: "completed",
      },
      {
        phase: "Development",
        duration: "4 months",
        description: "Core platform development and testing",
        status: "active",
      },
      {
        phase: "Launch",
        duration: "1 month",
        description: "Platform launch and user onboarding",
        status: "pending",
      },
    ]),
    recentActivity: JSON.stringify([
      {
        type: "funding",
        user: "Alice",
        amount: 1000,
        description: "Funded the project",
        time: "2 hours ago",
      },
      {
        type: "milestone",
        description: "Completed research phase",
        time: "1 day ago",
      },
    ]),
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  "2": {
    id: 2,
    title: "Community Governance Tool",
    abstract:
      "A tool for decentralized communities to make collective decisions and manage resources.",
    category: "Crypto",
    authorName: "DAO Collective",
    authorAffiliation: "DAO Research Lab",
    authorImage: "/vercel.svg",
    imageUrl: "/vercel.svg",
    fundingGoal: 25000,
    currentFunding: 18000,
    backerCount: 890,
    daysLeft: 8,
    technicalApproach:
      "Built on blockchain technology, this governance tool enables transparent voting, proposal management, and resource allocation for decentralized communities.",
    timeline: JSON.stringify([
      {
        phase: "Conceptualization",
        duration: "1 month",
        description: "Requirements gathering and design",
        status: "completed",
      },
      {
        phase: "Prototype",
        duration: "3 months",
        description: "Building MVP and testing",
        status: "active",
      },
    ]),
    recentActivity: JSON.stringify([
      {
        type: "funding",
        user: "Bob",
        amount: 500,
        description: "Funded the project",
        time: "5 hours ago",
      },
    ]),
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const [fundingAmount, setFundingAmount] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get the project ID from params
  const [projectId, setProjectId] = useState<string | null>(null);

  // Handle async params
  useEffect(() => {
    params.then(({ id }) => setProjectId(id)).catch(console.error);
  }, [params]);

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("No project ID");
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error("Project not found");
      }
      return response.json();
    },
    enabled: !!projectId,
  });

  const { data: fundingTiers = [] } = useQuery<FundingTier[]>({
    queryKey: ["/api/projects", projectId, "funding-tiers"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/funding-tiers`);
      if (!response.ok) {
        return [];
      }
      return response.json();
    },
    enabled: !!projectId,
  });

  const fundMutation = useMutation<FundingResponse, Error, FundingRequest>({
    mutationFn: async (data) => {
      const response = await fetch(`/api/projects/${projectId}/fund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          contributorName: "Anonymous User", // In a real app, this would come from user authentication
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Funding failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Funding Successful!",
        description: `Transaction ID: ${data.transactionId}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      setFundingAmount("");
    },
    onError: (error) => {
      toast({
        title: "Funding Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper function to safely parse JSON
  const safeJsonParse = (value: any) => {
    if (!value) return [];
    if (typeof value === "object") return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error("JSON parse error:", error);
      return [];
    }
  };

  const timeline: TimelineItem[] = safeJsonParse(project?.timeline);
  const recentActivity: ActivityItem[] = safeJsonParse(project?.recentActivity);

  if (!projectId) {
    return <div>Loading...</div>;
  }

  if (projectLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8 w-32 h-32 animate-pulse" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleFunding = () => {
    const amount = parseInt(fundingAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid funding amount",
        variant: "destructive",
      });
      return;
    }

    fundMutation.mutate({
      amount,
      walletAddress: "0x1234567890abcdef", // Mock wallet address
    });
  };

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 neon-cyan hover:bg-neon-cyan/10 mb-8 sci-fi-input"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Research</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Header */}
            <div className="sci-fi-card rounded-xl p-8 mb-8 float">
              <div className="flex items-center justify-between mb-6">
                <Badge
                  className={`px-4 py-2 rounded-full text-sm font-mono ${
                    categoryColors[
                      project.category as keyof typeof categoryColors
                    ] || "bg-gray-600/20 text-gray-400"
                  }`}
                >
                  {project.category}
                </Badge>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">
                    Project ID: #{project.id}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="neon-cyan hover:bg-white/10"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
              <p className="text-lg text-gray-300 mb-6">{project.abstract}</p>

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={project.authorImage || ""}
                    alt={project.authorName}
                  />
                  <AvatarFallback>
                    {project.authorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{project.authorName}</h3>
                  <p className="text-sm text-gray-400">
                    {project.authorAffiliation}
                  </p>
                </div>
              </div>
            </div>

            {/* Project Image */}
            {project.imageUrl && (
              <div className="mb-8">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Technical Approach */}
            {project.technicalApproach && (
              <div className="sci-fi-card rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 neon-cyan">
                  Technical Approach
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {project.technicalApproach}
                </p>
              </div>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <div className="sci-fi-card rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 neon-cyan">
                  Research Timeline
                </h2>
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          item.status === "completed"
                            ? "bg-neon-green"
                            : item.status === "active"
                            ? "bg-neon-cyan"
                            : "bg-gray-500"
                        }`}
                      />
                      <div>
                        <h4 className="font-semibold">
                          {item.phase} ({item.duration})
                        </h4>
                        <p className="text-sm text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Funding Progress */}
            <div className="sci-fi-card rounded-xl p-6 mb-6 float">
              <h3 className="text-xl font-bold mb-4 neon-cyan">
                Funding Progress
              </h3>

              <div className="text-center mb-6">
                <div className="text-3xl font-mono font-bold text-white mb-2">
                  ${project.currentFunding.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  of ${project.fundingGoal.toLocaleString()} goal
                </div>
              </div>

              <FundingProgress
                currentFunding={project.currentFunding}
                fundingGoal={project.fundingGoal}
                daysLeft={project.daysLeft}
                className="mb-6"
              />

              <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                <div>
                  <div className="text-lg font-mono font-bold neon-purple">
                    {project.backerCount}
                  </div>
                  <div className="text-xs text-gray-400">Backers</div>
                </div>
              </div>

              {/* Funding Input */}
              <div className="space-y-3 mb-4">
                <Input
                  type="number"
                  placeholder="Enter amount ($)"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  className="sci-fi-input text-white placeholder-gray-400"
                />
                <Button
                  onClick={handleFunding}
                  disabled={fundMutation.isPending}
                  className="w-full sci-fi-button text-white font-semibold"
                >
                  <span className="relative z-10">
                    {fundMutation.isPending
                      ? "Processing..."
                      : "Fund This Project"}
                  </span>
                </Button>
              </div>
            </div>

            {/* Funding Tiers */}
            {fundingTiers.length > 0 && (
              <div className="glass-effect rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 neon-purple">
                  Funding Tiers
                </h3>
                <div className="space-y-4">
                  {fundingTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="border border-white/10 rounded-lg p-4"
                    >
                      <h4 className="font-semibold mb-2">{tier.name}</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        {tier.description}
                      </p>
                      <div className="text-lg font-mono font-bold neon-cyan mb-2">
                        ${tier.amount}
                      </div>
                      <div className="text-xs text-gray-400">
                        {tier.backerCount} backers
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 neon-green">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-neon-green rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">
                          {activity.type === "funding" && (
                            <span>
                              <span className="font-semibold">
                                {activity.user}
                              </span>{" "}
                              funded ${activity.amount}
                            </span>
                          )}
                          {activity.type === "milestone" && (
                            <span>{activity.description}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

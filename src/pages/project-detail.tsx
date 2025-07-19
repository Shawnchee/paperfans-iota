import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ArrowLeft, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FundingProgress } from "@/components/funding-progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type {
  Project,
  FundingTier,
  TimelineItem,
  ActivityItem,
  FundingRequest,
  FundingResponse,
} from "@/lib/types";

const categoryColors = {
  "AI/ML": "bg-neon-cyan/20 text-neon-cyan",
  Quantum: "bg-neon-purple/20 text-neon-purple",
  Biotech: "bg-neon-green/20 text-neon-green",
  Climate: "bg-neon-cyan/20 text-neon-cyan",
  Neuro: "bg-neon-purple/20 text-neon-purple",
  Crypto: "bg-neon-green/20 text-neon-green",
};

export default function ProjectDetail() {
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id ? parseInt(params.id) : null;
  const [fundingAmount, setFundingAmount] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const { data: fundingTiers = [] } = useQuery<FundingTier[]>({
    queryKey: ["/api/projects", projectId, "funding-tiers"],
    enabled: !!projectId,
  });

  const fundMutation = useMutation<FundingResponse, Error, FundingRequest>({
    mutationFn: async (data) => {
      const res = await apiRequest(
        "POST",
        `/api/projects/${projectId}/fund`,
        data
      );
      return res.json();
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

  if (!projectId) {
    return <div>Invalid project ID</div>;
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

  const timeline: TimelineItem[] = safeJsonParse(project.timeline);
  const recentActivity: ActivityItem[] = safeJsonParse(project.recentActivity);

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
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 neon-cyan hover:bg-white/10 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Research</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Header */}
            <div className="glass-effect rounded-xl p-8 mb-8">
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
              <div className="glass-effect rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 neon-cyan">
                  Technical Approach
                </h2>
                <p className="text-gray-300">{project.technicalApproach}</p>
              </div>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <div className="glass-effect rounded-xl p-8">
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
            <div className="glass-effect rounded-xl p-6 mb-6 hologram-border">
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
                  className="glass-effect border-white/20 focus:border-neon-cyan"
                />
                <Button
                  onClick={handleFunding}
                  disabled={fundMutation.isPending}
                  className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300"
                >
                  {fundMutation.isPending
                    ? "Processing..."
                    : "Fund This Research"}
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full glass-effect hover:bg-white/10"
              >
                <Heart className="h-4 w-4 mr-2" />
                Add to Watchlist
              </Button>
            </div>

            {/* Funding Tiers */}
            {fundingTiers.length > 0 && (
              <div className="glass-effect rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold mb-4 neon-cyan">
                  Funding Tiers
                </h3>

                <div className="space-y-3">
                  {fundingTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="p-3 border border-neon-cyan/30 rounded-lg hover:border-neon-cyan/50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">${tier.amount}</span>
                        <span className="text-xs neon-cyan">{tier.name}</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {tier.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 neon-cyan">
                  Recent Activity
                </h3>

                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "funding"
                            ? "bg-neon-green"
                            : activity.type === "milestone"
                            ? "bg-neon-purple"
                            : "bg-neon-cyan"
                        }`}
                      />
                      <div className="text-sm">
                        <span className="text-gray-300">
                          {activity.user || activity.description}
                        </span>
                        {activity.amount && (
                          <span className="text-gray-400">
                            {" "}
                            funded ${activity.amount}
                          </span>
                        )}
                        <div className="text-xs text-gray-500">
                          {activity.time}
                        </div>
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

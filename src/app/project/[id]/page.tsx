"use client";

import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Copy, Download, Share2, X, CheckCircle, Clock, TrendingUp, Users, Award, Calendar, Target, Zap, AlertTriangle, Vote } from "lucide-react";

// Mock data for demonstration
const mockProject = {
  title: "AI-Driven Protein Folding Research",
  abstract:
    "This project aims to leverage advanced AI models to predict protein structures, accelerating drug discovery and biotechnology innovation.",
  domain: "Biotech",
  tags: ["AI", "Biotech", "Drug Discovery"],
  researcher: {
    name: "Dr. Ada Lovelace",
    wallet: "0x1234...abcd",
    orcid: "0000-0002-1825-0097",
    avatar: "/professsor ada.jpeg",
  },
  proposal: {
    docUrl: "https://example.com/proposal.pdf",
    budget: 120000,
    currency: "USD",
    timeline: [
      { phase: "Planning", duration: "1m", status: "completed", startDate: "2024-01-01", endDate: "2024-02-01", progress: 100 },
      { phase: "Data Collection", duration: "2m", status: "active", startDate: "2024-02-01", endDate: "2024-04-01", progress: 65 },
      { phase: "Model Training", duration: "3m", status: "pending", startDate: "2024-04-01", endDate: "2024-07-01", progress: 0 },
      { phase: "Validation", duration: "1m", status: "pending", startDate: "2024-07-01", endDate: "2024-08-01", progress: 0 },
    ],
    milestones: [
      { 
        name: "Collect 10k protein samples", 
        status: "completed", 
        progress: 100, 
        target: 10000, 
        current: 10000,
        budget: 30000,
        description: "Collect and validate 10,000 protein samples for training dataset",
        evidence: [
          { name: "Dataset Summary Report", url: "https://example.com/dataset-report.pdf", type: "report" },
          { name: "Sample Validation Logs", url: "https://example.com/validation-logs.csv", type: "data" }
        ],
        completedDate: "2024-05-15",
        fundsReleased: true
      },
      { 
        name: "Train v1 model", 
        status: "active", 
        progress: 65, 
        target: 1, 
        current: 0.65,
        budget: 45000,
        description: "Train initial AI model on collected protein data",
        evidence: [
          { name: "Training Progress Report", url: "https://example.com/training-report.pdf", type: "report" },
          { name: "Model Performance Metrics", url: "https://example.com/metrics.json", type: "data" }
        ],
        completedDate: null,
        fundsReleased: false,
        pendingVote: true
      },
      { 
        name: "Publish preprint", 
        status: "pending", 
        progress: 0, 
        target: 1, 
        current: 0,
        budget: 25000,
        description: "Submit research findings to preprint server",
        evidence: [],
        completedDate: null,
        fundsReleased: false,
        pendingVote: false
      },
      { 
        name: "Peer Review & Publication", 
        status: "pending", 
        progress: 0, 
        target: 1, 
        current: 0,
        budget: 20000,
        description: "Submit to peer-reviewed journal and address reviewer comments",
        evidence: [],
        completedDate: null,
        fundsReleased: false,
        pendingVote: false
      }
    ],
    goalSummary:
      "Success means publishing a high-accuracy, open-access protein folding model and dataset.",
  },
  funding: {
    totalRequired: 120000,
    raised: 45000,
    tokenPrice: 1.5,
    deadline: "2024-08-31",
    contributors: 23,
    recentContributions: [
      { amount: 5000, date: "2024-06-10", contributor: "Alice" },
      { amount: 3000, date: "2024-06-09", contributor: "Bob" },
      { amount: 2000, date: "2024-06-08", contributor: "Charlie" },
    ]
  },
  governance: {
    votingRights: 1,
    pastVotes: [
      { id: 1, desc: "Approve milestone 1", result: "Passed", date: "2024-05-01", turnout: 85 },
      { id: 2, desc: "Change budget allocation", result: "Rejected", date: "2024-06-01", turnout: 72 },
    ],
    revokeInfo: {
      canInitiate: true,
      requiredSignatures: 15,
      currentSignatures: 3,
      timeRemaining: "72h 30m",
      reason: "Insufficient progress updates and lack of transparency",
      lastUpdate: "2024-06-08",
      signatures: [
        { signer: "Alice", amount: 500, date: "2024-06-10" },
        { signer: "Bob", amount: 300, date: "2024-06-09" },
        { signer: "Charlie", amount: 200, date: "2024-06-08" },
      ]
    }
  },
  progress: {
    currentMilestone: "Data Collection",
    lastUpdated: "2024-06-10 14:30",
    logs: [
      { msg: "Collected 2k samples", time: "2024-06-09", type: "milestone" },
      { msg: "Launched data pipeline", time: "2024-06-05", type: "update" },
      { msg: "Received funding milestone", time: "2024-06-01", type: "funding" },
    ],
    artifacts: [
      { name: "Preprint v0.1", url: "https://arxiv.org/abs/1234.5678", type: "paper" },
      { name: "Dataset sample", url: "https://zenodo.org/record/123456", type: "dataset" },
    ],
  },
  returns: {
    revenueModels: ["Token Royalties", "Licensing", "Open Access"],
    profitBreakdown: [
      { label: "Researchers", value: 40, color: "#00ffff" },
      { label: "Funders", value: 40, color: "#ff00ff" },
      { label: "Platform", value: 20, color: "#ffff00" },
    ],
    payouts: [
      { funder: "Alice", amount: 500, date: "2024-05-15" },
      { funder: "Bob", amount: 300, date: "2024-05-10" },
    ],
    contractProof: "0xabcdef1234567890",
  },
  community: {
    supporters: [
      { name: "Alice", amount: 500, avatar: "A" },
      { name: "Bob", amount: 300, avatar: "B" },
      { name: "Charlie", amount: 200, avatar: "C" },
    ],
    comments: [
      { user: "Alice", text: "Excited for this!", time: "2024-06-10", avatar: "A" },
      { user: "Bob", text: "How will data be shared?", time: "2024-06-09", avatar: "B" },
    ],
    shareUrl: "https://paperfans.io/project/1",
  },
};

const tabList = [
  { key: "basic", label: "📄 Basic Information", icon: "📄" },
  { key: "proposal", label: "📑 Proposal", icon: "📑" },
  { key: "funding", label: "💸 Funding Status", icon: "💸" },
  { key: "governance", label: "🗳️ Governance Info", icon: "🗳️" },
  { key: "progress", label: "📈 Progress Tracker", icon: "📈" },
  { key: "returns", label: "💰 Returns / Royalties", icon: "💰" },
  { key: "community", label: "🌐 Community", icon: "🌐" },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-6 p-6 shadow-lg bg-black/70 border border-white/10 hover:border-neon-cyan/30 transition-all duration-300">
      <h2 className="text-xl font-bold mb-4 neon-cyan">{title}</h2>
      {children}
    </Card>
  );
}

// Interactive Timeline Component
function InteractiveTimeline({ timeline }: { timeline: any[] }) {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
      <div className="relative">
        {/* Timeline Container */}
        <div className="flex items-start justify-between relative">
          {/* Background Connection Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 z-0" />

          {timeline.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center relative group cursor-pointer flex-1"
              onMouseEnter={() => setHoveredPhase(idx)}
              onMouseLeave={() => setHoveredPhase(null)}
            >
              {/* Phase Circle */}
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                step.status === "completed"
                  ? "bg-green-500 border-green-400 shadow-lg shadow-green-500/30"
                  : step.status === "active"
                  ? "bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-500/30"
                  : "bg-gray-600 border-gray-500"
              } ${hoveredPhase === idx ? "scale-110 shadow-xl" : ""}`}>
                {step.status === "completed" && <CheckCircle className="w-6 h-6 text-white" />}
                {step.status === "active" && <Clock className="w-6 h-6 text-white animate-pulse" />}
                {step.status === "pending" && <span className="text-sm font-bold text-white">{idx + 1}</span>}
              </div>

              {/* Phase Info */}
              <div className="mt-4 text-center max-w-32">
                <div className="text-sm font-semibold text-white mb-1">{step.phase}</div>
                <div className="text-xs text-gray-400 mb-2">{step.duration}</div>

                {/* Progress Bar for Active Phase */}
                {step.status === "active" && (
                  <div className="mt-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-cyan-400 mt-1 font-medium">{step.progress}%</div>
                  </div>
                )}

                {/* Status Badge */}
                <Badge className={`mt-2 text-xs ${
                  step.status === "completed"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : step.status === "active"
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                    : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                }`}>
                  {step.status === "completed" ? "✓ Complete" :
                   step.status === "active" ? "⏳ In Progress" :
                   "⏸ Pending"}
                </Badge>
              </div>

              {/* Hover Tooltip */}
              {hoveredPhase === idx && (
                <div className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 bg-black/95 border border-gray-600 rounded-lg p-4 min-w-64 z-30 shadow-xl">
                  <div className="text-sm font-semibold text-white mb-2">{step.phase}</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{step.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Start Date:</span>
                      <span className="text-white">{new Date(step.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">End Date:</span>
                      <span className="text-white">{new Date(step.endDate).toLocaleDateString()}</span>
                    </div>
                    {step.status === "active" && (
                      <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
                        <span className="text-gray-400">Progress:</span>
                        <span className="text-cyan-400 font-medium">{step.progress}%</span>
                      </div>
                    )}
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/95 border-l border-t border-gray-600 rotate-45" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline Summary */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-black/30 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-green-400">
                {timeline.filter(t => t.status === "completed").length}
              </div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
            <div className="text-center p-3 bg-black/30 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-cyan-400">
                {timeline.filter(t => t.status === "active").length}
              </div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
            <div className="text-center p-3 bg-black/30 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-gray-400">
                {timeline.filter(t => t.status === "pending").length}
              </div>
              <div className="text-xs text-gray-400">Pending</div>
            </div>
            <div className="text-center p-3 bg-black/30 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-white">
                {Math.round(timeline.reduce((sum, t) => sum + (t.progress || 0), 0) / timeline.length)}%
              </div>
              <div className="text-xs text-gray-400">Overall Progress</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Enhanced Milestone Cards with Budget and Voting
function EnhancedMilestoneCard({ milestone, index, onVoteClick }: { milestone: any; index: number; onVoteClick: (milestone: any) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "border-green-500/50 bg-green-500/10";
      case "active": return "border-cyan-500/50 bg-cyan-500/10";
      case "pending": return "border-gray-500/50 bg-gray-500/10";
      default: return "border-gray-500/50 bg-gray-500/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-white" />;
      case "active": return <Clock className="w-5 h-5 text-white" />;
      case "pending": return <span className="text-white text-sm">{index + 1}</span>;
      default: return <span className="text-white text-sm">{index + 1}</span>;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400";
      case "active": return "bg-cyan-500/20 text-cyan-400";
      case "pending": return "bg-gray-600/20 text-gray-400";
      default: return "bg-gray-600/20 text-gray-400";
    }
  };

  return (
    <Card 
      className={`p-4 mb-4 transition-all duration-300 cursor-pointer ${getStatusColor(milestone.status)} hover:scale-105`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            milestone.status === "completed" ? "bg-green-500" : 
            milestone.status === "active" ? "bg-cyan-500" : "bg-gray-500"
          }`}>
            {getStatusIcon(milestone.status)}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-white">{milestone.name}</div>
            <div className="text-sm text-gray-400">{milestone.description}</div>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-cyan-400">${milestone.budget.toLocaleString()}</span>
              {milestone.fundsReleased && (
                <Badge className="bg-green-500/20 text-green-400 text-xs">Funds Released</Badge>
              )}
              {milestone.pendingVote && (
                <Badge className="bg-yellow-500/20 text-yellow-400 text-xs animate-pulse">Vote Required</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <Badge className={getStatusBadgeColor(milestone.status)}>
            {milestone.progress}%
          </Badge>
          {milestone.pendingVote && (
            <Button 
              size="sm" 
              className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
              onClick={(e) => {
                e.stopPropagation();
                onVoteClick(milestone);
              }}
            >
              <Vote className="w-4 h-4 mr-1" />
              Vote
            </Button>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-300 mb-2">Progress Details</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress:</span>
                  <span className="text-white">{milestone.current}/{milestone.target}</span>
                </div>
                <Progress value={milestone.progress} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Budget:</span>
                  <span className="text-cyan-400">${milestone.budget.toLocaleString()}</span>
                </div>
                {milestone.completedDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Completed:</span>
                    <span className="text-green-400">{milestone.completedDate}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-semibold text-gray-300 mb-2">Evidence & Documentation</div>
              <div className="space-y-2">
                {milestone.evidence.length > 0 ? (
                  milestone.evidence.map((evidence: any, idx: number) => (
                    <Card key={idx} className="p-2 bg-black/30 border border-white/10">
                      <a 
                        href={evidence.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">{evidence.name}</span>
                        <Badge className="text-xs bg-gray-600/20 text-gray-400">{evidence.type}</Badge>
                      </a>
                    </Card>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic">No evidence uploaded yet</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {milestone.pendingVote && (
              <Button 
                size="sm" 
                className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                onClick={(e) => {
                  e.stopPropagation();
                  onVoteClick(milestone);
                }}
              >
                <Vote className="w-4 h-4 mr-1" />
                Vote on Milestone
              </Button>
            )}
            <Button size="sm" variant="outline" className="text-xs">View Details</Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// Enhanced Pie Chart
function EnhancedPieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="flex items-center space-x-6">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const circumference = 2 * Math.PI * 14; // radius = 14
            const strokeDasharray = (percentage / 100) * circumference;
            const strokeDashoffset = 0;
            const startAngle = data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0);
            
            return (
              <circle
                key={item.label}
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke={item.color}
                strokeWidth="3"
                strokeDasharray={`${strokeDasharray} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${startAngle} 16 16)`}
                className="transition-all duration-1000 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{total}%</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-white">{item.label}</span>
            <span className="text-sm text-gray-400">({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Funding Progress Visualization
function FundingProgress({ funding }: { funding: any }) {
  const progress = (funding.raised / funding.totalRequired) * 100;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <div>
              <div className="text-2xl font-bold text-white">${funding.raised.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Raised</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">${funding.totalRequired.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Goal</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-white">{funding.contributors}</div>
              <div className="text-sm text-gray-400">Contributors</div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">{progress.toFixed(1)}%</span>
        </div>
        <div className="relative">
          <Progress value={progress} className="h-3" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs text-white font-semibold">{progress.toFixed(1)}%</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-300">Recent Contributions</div>
        {funding.recentContributions.map((contribution: any, index: number) => (
          <div key={index} className="flex justify-between items-center p-2 bg-black/30 rounded">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-xs text-cyan-400">{contribution.contributor[0]}</span>
              </div>
              <span className="text-sm text-white">{contribution.contributor}</span>
            </div>
            <div className="text-sm text-cyan-400">${contribution.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectPage() {
  const [tab, setTab] = useState("basic");
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [musdtAmount, setMusdtAmount] = useState("");
  const [mockWallet, setMockWallet] = useState(1000); // mock wallet balance
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [hasSignedRevoke, setHasSignedRevoke] = useState(false);
  const [milestoneVoteModalOpen, setMilestoneVoteModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [userVote, setUserVote] = useState<"approve" | "reject" | null>(null);
  
  // Mock voting data
  const mockVoteData = {
    totalVotes: 23,
    allowVotes: 18,
    rejectVotes: 5,
    timeRemaining: "12h 30m",
    userHasVoted: false
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(mockProject.community.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const tokenPrice = mockProject.funding.tokenPrice;
  const paperTokens = musdtAmount && parseFloat(musdtAmount) > 0 ? (parseFloat(musdtAmount) / tokenPrice) : 0;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{mockProject.title}</h1>
            <p className="text-gray-400 max-w-2xl">{mockProject.abstract}</p>
          </div>
          <Button className="sci-fi-button px-6 py-2 text-lg font-semibold shadow-neon-cyan hover:shadow-neon-cyan/50 transition-all duration-300" onClick={() => setFundModalOpen(true)}>
            <Zap className="w-5 h-5 mr-2" />
            Fund This Project
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
            {tabList.map((t) => (
              <button
                key={t.key}
                className={`px-4 py-2 rounded-t-lg font-semibold transition-all duration-300 ${
                  tab === t.key 
                    ? "bg-neon-cyan/20 text-neon-cyan shadow-lg shadow-neon-cyan/25" 
                    : "bg-black/40 text-gray-300 hover:bg-black/60"
                }`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {tab === "basic" && (
            <SectionCard title="Basic Information">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="font-semibold">Title:</span> {mockProject.title}
                  </div>
                  <div>
                    <span className="font-semibold">Abstract:</span>
                    <p className="text-gray-300 mt-1">{mockProject.abstract}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Domain / Field:</span>
                    <Badge className="ml-2">{mockProject.domain}</Badge>
                  </div>
                  <div>
                    <span className="font-semibold">Tags:</span>
                    <span className="ml-2 space-x-2">
                      {mockProject.tags.map((tag) => (
                        <Badge key={tag} className="inline-block hover:bg-cyan-500/20 transition-colors">{tag}</Badge>
                      ))}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 min-w-[200px]">
                  <Avatar className="w-16 h-16 border-2 border-cyan-500/30">
                    <img src={mockProject.researcher.avatar} alt="avatar" className="rounded-full" />
                  </Avatar>
                  <div className="font-semibold text-center">{mockProject.researcher.name}</div>
                  <div className="text-xs text-gray-400 text-center">Wallet: {mockProject.researcher.wallet}</div>
                  <div className="text-xs text-gray-400 text-center">ORCID: {mockProject.researcher.orcid || "-"}</div>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === "proposal" && (
            <SectionCard title="Proposal">
              <div className="space-y-8">
                {/* Proposal Overview Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Proposal Document Card */}
                  <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Download className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Proposal Document</div>
                        <div className="text-xs text-gray-400">Research Proposal PDF</div>
                      </div>
                    </div>
                    <a
                      href={mockProject.proposal.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg py-3 px-4 hover:bg-cyan-500/30 transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </Card>

                  {/* Budget Overview Card */}
                  <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Total Budget</div>
                        <div className="text-xs text-gray-400">Project Funding Required</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">
                        ${mockProject.proposal.budget.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">{mockProject.proposal.currency}</div>
                    </div>
                  </Card>

                  {/* Milestone Budget Breakdown Card */}
                  <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Milestone Budget</div>
                        <div className="text-xs text-gray-400">Total Allocated</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">
                        ${mockProject.proposal.milestones.reduce((sum, m) => sum + m.budget, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {mockProject.proposal.milestones.length} Milestones
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Goal Summary Section */}
                <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">Project Goal Summary</div>
                      <div className="text-xs text-gray-400">Research Objectives & Expected Outcomes</div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{mockProject.proposal.goalSummary}</p>
                </Card>

                {/* Budget Verification Section */}
                <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-lg">Budget Verification</div>
                        <div className="text-xs text-gray-400">Milestone vs Total Budget Comparison</div>
                      </div>
                    </div>
                    <Badge className={
                      mockProject.proposal.milestones.reduce((sum, m) => sum + m.budget, 0) === mockProject.proposal.budget
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }>
                      {mockProject.proposal.milestones.reduce((sum, m) => sum + m.budget, 0) === mockProject.proposal.budget
                        ? "✓ Verified"
                        : "⚠ Mismatch"
                      }
                    </Badge>
                  </div>
                  <div className="flex items-stretch justify-between gap-4">
                    <div className="flex-1 text-center p-6 bg-black/30 rounded-lg border border-white/10">
                      <div className="text-3xl font-bold text-white mb-2">
                        ${mockProject.proposal.budget.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Total Budget</div>
                    </div>
                    <div className="flex-1 text-center p-6 bg-black/30 rounded-lg border border-white/10">
                      <div className="text-3xl font-bold text-white mb-2">
                        ${mockProject.proposal.milestones.reduce((sum, m) => sum + m.budget, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Milestone Sum</div>
                    </div>
                    <div className="flex-1 text-center p-6 bg-black/30 rounded-lg border border-white/10">
                      <div className={`text-3xl font-bold mb-2 ${
                        mockProject.proposal.budget - mockProject.proposal.milestones.reduce((sum, m) => sum + m.budget, 0) === 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}>
                        ${Math.abs(mockProject.proposal.budget - mockProject.proposal.milestones.reduce((sum, m) => sum + m.budget, 0)).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Difference</div>
                    </div>
                  </div>
                </Card>

                {/* Project Timeline Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <span className="font-semibold text-lg text-white">Project Timeline</span>
                        <div className="text-xs text-gray-400">Research Phase Breakdown</div>
                      </div>
                    </div>
                    <Badge className="bg-cyan-500/20 text-cyan-400">
                      {mockProject.proposal.timeline.length} Phases
                    </Badge>
                  </div>
                  <InteractiveTimeline timeline={mockProject.proposal.timeline} />
                </div>

                {/* Milestone Breakdown Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <span className="font-semibold text-lg text-white">Milestone Breakdown</span>
                        <div className="text-xs text-gray-400">Detailed Project Deliverables</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500/20 text-green-400">
                        {mockProject.proposal.milestones.filter(m => m.status === "completed").length} Completed
                      </Badge>
                      <Badge className="bg-cyan-500/20 text-cyan-400">
                        {mockProject.proposal.milestones.filter(m => m.status === "active").length} Active
                      </Badge>
                      <Badge className="bg-gray-500/20 text-gray-400">
                        {mockProject.proposal.milestones.filter(m => m.status === "pending").length} Pending
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {mockProject.proposal.milestones.map((milestone, index) => (
                      <EnhancedMilestoneCard
                        key={index}
                        milestone={milestone}
                        index={index}
                        onVoteClick={(milestone) => {
                          setSelectedMilestone(milestone);
                          setMilestoneVoteModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === "funding" && (
            <SectionCard title="Funding Status">
              <FundingProgress funding={mockProject.funding} />
            </SectionCard>
          )}

                      {tab === "governance" && (
              <SectionCard title="Governance Info">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
                      <div className="flex items-center space-x-3">
                        <Award className="w-8 h-8 text-purple-400" />
                        <div>
                          <div className="text-2xl font-bold text-white">{mockProject.governance.votingRights}</div>
                          <div className="text-sm text-gray-400">Voting Rights per Token</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  {/* Fund Revocation Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-lg">Fund Revocation</span>
                      <Button 
                        onClick={() => setRevokeModalOpen(true)}
                        className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                        disabled={!mockProject.governance.revokeInfo.canInitiate}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Initiate Revoke
                      </Button>
                    </div>
                    
                    <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                            <div>
                              <div className="font-semibold text-white">Revoke Petition Active</div>
                              <div className="text-sm text-gray-400">Reason: {mockProject.governance.revokeInfo.reason}</div>
                            </div>
                          </div>
                          <Badge className="bg-red-500/20 text-red-400">
                            {mockProject.governance.revokeInfo.currentSignatures}/{mockProject.governance.revokeInfo.requiredSignatures} Signatures
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress:</span>
                            <span className="text-white">
                              {Math.round((mockProject.governance.revokeInfo.currentSignatures / mockProject.governance.revokeInfo.requiredSignatures) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={(mockProject.governance.revokeInfo.currentSignatures / mockProject.governance.revokeInfo.requiredSignatures) * 100} 
                            className="h-2 bg-red-500/20"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Time Remaining:</span>
                          <span className="text-red-400 font-mono">{mockProject.governance.revokeInfo.timeRemaining}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-gray-300">Recent Signatures:</div>
                          {mockProject.governance.revokeInfo.signatures.map((sig, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-black/30 rounded">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                  <span className="text-xs text-red-400">{sig.signer[0]}</span>
                                </div>
                                <span className="text-sm text-white">{sig.signer}</span>
                              </div>
                              <div className="text-sm text-red-400">${sig.amount}</div>
                            </div>
                          ))}
                        </div>
                        
                        {!hasSignedRevoke && (
                          <Button 
                            onClick={() => setHasSignedRevoke(true)}
                            className="w-full bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                          >
                            <Vote className="w-4 h-4 mr-2" />
                            Sign Revoke Petition
                          </Button>
                        )}
                        
                        {hasSignedRevoke && (
                          <div className="text-center p-3 bg-green-500/10 border border-green-500/30 rounded">
                            <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
                            <div className="text-sm text-green-400">You have signed the revoke petition</div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                  
                  <div>
                    <span className="font-semibold mb-4 block">Past Votes:</span>
                    <div className="space-y-3">
                      {mockProject.governance.pastVotes.map((vote) => (
                        <Card key={vote.id} className="p-4 bg-black/30 border border-white/10">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-white">{vote.desc}</div>
                              <div className="text-sm text-gray-400 mt-1">Turnout: {vote.turnout}%</div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge className={
                                vote.result === "Passed" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                              }>
                                {vote.result}
                              </Badge>
                              <div className="text-xs text-gray-400">{vote.date}</div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-semibold mb-2 block">Forum/Discussion Thread:</span>
                    <div className="flex space-x-2">
                      <Input placeholder="Add a comment (placeholder)" className="flex-1" disabled />
                      <Button disabled>Post</Button>
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}

          {tab === "progress" && (
            <SectionCard title="Progress Tracker">
              <div className="space-y-8">
                {/* Progress Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Target className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-white truncate">{mockProject.progress.currentMilestone}</div>
                        <div className="text-sm text-gray-400">Current Milestone</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 hover:border-green-500/50 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-white">{mockProject.progress.lastUpdated.split(' ')[0]}</div>
                        <div className="text-sm text-gray-400">Last Updated</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Vote className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-white">1</div>
                        <div className="text-sm text-gray-400">Pending Votes</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Milestone-Based Funding Section */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Milestone-Based Funding</h3>
                      <p className="text-sm text-gray-400 mt-1">Track progress and funding release for each project milestone</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-400">Total Budget:</div>
                      <div className="text-lg font-bold text-cyan-400">
                        ${mockProject.proposal.milestones.reduce((sum, m) => sum + m.budget, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Milestone Timeline */}
                  <div className="relative">
                    <div className="space-y-6">
                      {mockProject.proposal.milestones.map((milestone, index) => (
                        <div key={index} className="relative">
                          {/* Connection Line */}
                          {index < mockProject.proposal.milestones.length - 1 && (
                            <div className="absolute left-8 top-20 w-0.5 h-12 bg-gradient-to-b from-gray-600 to-gray-700 z-0" />
                          )}

                          <div className="flex items-start space-x-6 relative z-10">
                            {/* Milestone Status Circle */}
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-3 shadow-lg transition-all duration-300 ${
                                milestone.status === "completed"
                                  ? "bg-green-500 border-green-400 shadow-green-500/30"
                                  : milestone.status === "active"
                                  ? "bg-cyan-500 border-cyan-400 shadow-cyan-500/30 animate-pulse"
                                  : "bg-gray-600 border-gray-500 shadow-gray-600/20"
                              }`}>
                                {milestone.status === "completed" && <CheckCircle className="w-8 h-8 text-white" />}
                                {milestone.status === "active" && <Clock className="w-8 h-8 text-white" />}
                                {milestone.status === "pending" && <span className="text-lg font-bold text-white">{index + 1}</span>}
                              </div>
                              <div className="text-xs text-gray-400 mt-2 font-medium">Phase {index + 1}</div>
                            </div>

                            {/* Milestone Content Card */}
                            <div className="flex-1 bg-gradient-to-br from-black/40 to-black/20 border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                              {/* Header Section */}
                              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                                <div className="flex-1">
                                  <h4 className="text-xl font-bold text-white mb-2">{milestone.name}</h4>
                                  <p className="text-sm text-gray-400 leading-relaxed">{milestone.description}</p>
                                </div>
                                <div className="text-right lg:text-right">
                                  <div className="text-2xl font-bold text-cyan-400">${milestone.budget.toLocaleString()}</div>
                                  <div className="text-xs text-gray-400 uppercase tracking-wide">Budget</div>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              {milestone.status === "active" && (
                                <div className="mb-6">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-400">Progress</span>
                                    <span className="text-sm font-medium text-cyan-400">{milestone.progress}%</span>
                                  </div>
                                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-1000 ease-out rounded-full"
                                      style={{ width: `${milestone.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Info Grid */}
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="text-center p-3 bg-black/30 rounded-lg border border-white/5">
                                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Status</div>
                                  <Badge className={`text-xs font-medium ${
                                    milestone.status === "completed" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                    milestone.status === "active" ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" :
                                    "bg-gray-600/20 text-gray-400 border-gray-500/30"
                                  }`}>
                                    {milestone.status === "completed" ? "✓ Complete" :
                                     milestone.status === "active" ? "⏳ Active" :
                                     "⏸ Pending"}
                                  </Badge>
                                </div>

                                <div className="text-center p-3 bg-black/30 rounded-lg border border-white/5">
                                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Progress</div>
                                  <div className="text-lg font-bold text-white">{milestone.progress}%</div>
                                </div>

                                <div className="text-center p-3 bg-black/30 rounded-lg border border-white/5">
                                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Funds</div>
                                  <div className="text-sm font-medium">
                                    {milestone.fundsReleased ? (
                                      <span className="text-green-400">✓ Released</span>
                                    ) : milestone.pendingVote ? (
                                      <span className="text-yellow-400">🗳 Pending Vote</span>
                                    ) : (
                                      <span className="text-gray-400">🔒 Locked</span>
                                    )}
                                  </div>
                                </div>

                                <div className="text-center p-3 bg-black/30 rounded-lg border border-white/5">
                                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Evidence</div>
                                  <div className="text-lg font-bold text-white">{milestone.evidence.length}</div>
                                </div>
                              </div>

                              {/* Completion Status */}
                              {milestone.status === "completed" && milestone.completedDate && (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span className="text-sm font-medium text-green-400">
                                      Completed on {milestone.completedDate}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Voting Section */}
                              {milestone.pendingVote && (
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center space-x-2">
                                      <Vote className="w-5 h-5 text-yellow-400" />
                                      <span className="text-sm font-medium text-yellow-400">
                                        Vote required for funding release
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-300"
                                      onClick={() => {
                                        setSelectedMilestone(milestone);
                                        setMilestoneVoteModalOpen(true);
                                      }}
                                    >
                                      <Vote className="w-4 h-4 mr-2" />
                                      Vote Now
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Budget Summary */}
                  <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Budget Summary</h4>
                        <p className="text-sm text-gray-400">Funding allocation across all milestones</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-green-400 mb-2">
                          ${mockProject.proposal.milestones.filter(m => m.fundsReleased).reduce((sum, m) => sum + m.budget, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wide">Released</div>
                        <div className="text-xs text-green-400 mt-1">
                          {mockProject.proposal.milestones.filter(m => m.fundsReleased).length} milestone(s)
                        </div>
                      </div>

                      <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                          <Vote className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="text-3xl font-bold text-yellow-400 mb-2">
                          ${mockProject.proposal.milestones.filter(m => m.pendingVote).reduce((sum, m) => sum + m.budget, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wide">Pending Vote</div>
                        <div className="text-xs text-yellow-400 mt-1">
                          {mockProject.proposal.milestones.filter(m => m.pendingVote).length} milestone(s)
                        </div>
                      </div>

                      <div className="text-center p-6 bg-gray-500/10 border border-gray-500/30 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto mb-3">
                          <Clock className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-3xl font-bold text-gray-400 mb-2">
                          ${mockProject.proposal.milestones.filter(m => !m.fundsReleased && !m.pendingVote).reduce((sum, m) => sum + m.budget, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wide">Locked</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {mockProject.proposal.milestones.filter(m => !m.fundsReleased && !m.pendingVote).length} milestone(s)
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Update Logs Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Update Logs</h4>
                  </div>
                  <div className="space-y-3">
                    {mockProject.progress.logs.map((log, i) => (
                      <div key={i} className="flex items-start space-x-4 p-4 bg-black/30 rounded-lg border-l-4 border-cyan-500/50 hover:bg-black/40 transition-colors">
                        <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                          log.type === "milestone" ? "bg-green-500" :
                          log.type === "funding" ? "bg-purple-500" : "bg-cyan-500"
                        }`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{log.msg}</div>
                          <div className="text-xs text-gray-400 mt-1">{log.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Research Artifacts Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Download className="w-4 h-4 text-purple-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Research Artifacts</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockProject.progress.artifacts.map((a, i) => (
                      <Card key={i} className="p-4 bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                        <a href={a.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-cyan-400 hover:text-cyan-300 group">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                            <Download className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{a.name}</div>
                            <div className="text-xs text-gray-400 capitalize">{a.type}</div>
                          </div>
                        </a>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === "returns" && (
            <SectionCard title="Returns / Royalties">
              <div className="space-y-8">
                {/* Revenue Model Selection with Interactive Cards */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-lg">Expected Revenue Models:</span>
                    <Badge className="bg-cyan-500/20 text-cyan-400">
                      {mockProject.returns.revenueModels.length} Models Available
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockProject.returns.revenueModels.map((model, index) => (
                      <Card
                        key={model}
                        className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          index === 0
                            ? "bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                            : "bg-black/30 border-white/10 hover:border-cyan-500/30"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? "bg-cyan-500 animate-pulse" : "bg-gray-500"
                          }`} />
                          <div className="flex-1">
                            <div className="font-semibold text-white">{model}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {index === 0 && "Primary Revenue Stream"}
                              {index === 1 && "Secondary Revenue Stream"}
                              {index === 2 && "Alternative Revenue Stream"}
                            </div>
                          </div>
                          {index === 0 && (
                            <Badge className="bg-green-500/20 text-green-400 text-xs">Active</Badge>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Enhanced Profit Breakdown with Interactive Elements */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-lg">Profit Breakdown Model:</span>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-500/20 text-purple-400">Fair Distribution</Badge>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex justify-center">
                      <EnhancedPieChart data={mockProject.returns.profitBreakdown} />
                    </div>
                    <div className="space-y-4">
                      <div className="text-sm font-semibold text-gray-300 mb-3">Distribution Details:</div>
                      {mockProject.returns.profitBreakdown.map((item) => (
                        <Card key={item.label} className="p-4 bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <div>
                                <div className="font-semibold text-white">{item.label}</div>
                                <div className="text-xs text-gray-400">
                                  {item.label === "Researchers" && "Original research team"}
                                  {item.label === "Funders" && "Project contributors & investors"}
                                  {item.label === "Platform" && "PaperFans platform fee"}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold" style={{ color: item.color }}>
                                {item.value}%
                              </div>
                              <div className="text-xs text-gray-400">of profits</div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Payout History with Filters and Analytics */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-lg">History of Payouts:</span>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500/20 text-green-400">
                        ${mockProject.returns.payouts.reduce((sum, p) => sum + p.amount, 0)} Total
                      </Badge>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {mockProject.returns.payouts.length > 0 ? (
                    <div className="space-y-3">
                      {mockProject.returns.payouts.map((p, i) => (
                        <Card key={i} className="p-4 bg-black/30 border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:scale-[1.02]">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <span className="text-sm text-green-400">{p.funder[0]}</span>
                              </div>
                              <div>
                                <div className="font-semibold text-white">{p.funder}</div>
                                <div className="text-xs text-gray-400 flex items-center space-x-2">
                                  <Calendar className="w-3 h-3" />
                                  <span>{p.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-400">${p.amount}</div>
                              <div className="text-xs text-gray-400">Royalty Payment</div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 bg-black/30 border border-white/10 text-center">
                      <div className="text-gray-400 mb-2">No payouts yet</div>
                      <div className="text-sm text-gray-500">
                        Payouts will appear here once the project generates revenue
                      </div>
                    </Card>
                  )}
                </div>

                {/* Enhanced Smart Contract Section with Interactive Elements */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-lg">Smart Contract Proof:</span>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-500/20 text-blue-400">Verified</Badge>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400 text-xs">SC</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">Revenue Distribution Contract</div>
                        <div className="text-xs text-gray-400">Deployed on IOTA Network</div>
                      </div>
                    </div>
                    <div className="bg-black/40 px-4 py-3 rounded-lg border border-white/10 font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400">0xc6da74ae4dd9bcf244c99d417a682af9319031ee19809fe0cec01576049d6e2e</span>
                        <Button size="sm" variant="ghost" className="text-xs p-1">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">Automated</div>
                        <div className="text-xs text-gray-400">Distribution</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">Transparent</div>
                        <div className="text-xs text-gray-400">On-Chain</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">Immutable</div>
                        <div className="text-xs text-gray-400">Rules</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">Real-time</div>
                        <div className="text-xs text-gray-400">Payouts</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Revenue Transparency Dashboard */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-lg">Revenue Transparency:</span>
                    <Badge className="bg-green-500/20 text-green-400">Live Data</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-8 h-8 text-green-400" />
                        <div>
                          <div className="text-2xl font-bold text-white">$12,500</div>
                          <div className="text-sm text-gray-400">Total Revenue Generated</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30">
                      <div className="flex items-center space-x-3">
                        <Users className="w-8 h-8 text-cyan-400" />
                        <div>
                          <div className="text-2xl font-bold text-white">23</div>
                          <div className="text-sm text-gray-400">Beneficiaries</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-8 h-8 text-purple-400" />
                        <div>
                          <div className="text-2xl font-bold text-white">6</div>
                          <div className="text-sm text-gray-400">Months Active</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === "community" && (
            <SectionCard title="Community">
              <div className="space-y-6">
                <div>
                  <span className="font-semibold mb-4 block">Supporters / Funders:</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mockProject.community.supporters.map((s, i) => (
                      <Card key={i} className="p-3 bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <span className="text-sm text-cyan-400">{s.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{s.name}</div>
                            <div className="text-sm text-cyan-400">${s.amount}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="font-semibold mb-4 block">Comments / Feedback:</span>
                  <div className="space-y-3">
                    {mockProject.community.comments.map((c, i) => (
                      <Card key={i} className="p-3 bg-black/30 border border-white/10">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <span className="text-sm text-cyan-400">{c.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-white">{c.user}</span>
                              <span className="text-xs text-gray-400">{c.time}</span>
                            </div>
                            <div className="text-sm text-gray-300">{c.text}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment (mock, not saved)"
                        className="flex-1"
                      />
                      <Button disabled>Post</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="font-semibold mb-2 block">Shareable Proposal URL:</span>
                  <div className="flex items-center gap-2">
                    <Input value={mockProject.community.shareUrl} readOnly className="flex-1" />
                    <Button size="icon" onClick={handleCopy} variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                    {copied && <span className="text-xs text-green-400 ml-2">Copied!</span>}
                  </div>
                </div>
                
                <div>
                  <span className="font-semibold mb-2 block">Social Boost Tools:</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon"><Share2 className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon"><span className="font-bold">in</span></Button>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
      
      {/* Fund Modal */}
      {fundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(10, 20, 40, 0.95)' }}>
          <div className="rounded-xl p-8 shadow-2xl border border-neon-cyan/40 min-w-[340px] flex flex-col items-center bg-gradient-to-br from-[#0a1a28] via-[#1a2233] to-[#0a1a28] backdrop-blur-xl relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-neon-cyan" onClick={() => setFundModalOpen(false)}><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold neon-cyan mb-4">Fund This Project</h2>
            <div className="w-full mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Your MUSDT Balance:</span>
                <span className="font-mono neon-cyan">{mockWallet.toLocaleString(undefined, { maximumFractionDigits: 2 })} MUSDT</span>
              </div>
              <label className="block text-gray-400 mb-1 font-medium">Amount to Fund (MUSDT)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={musdtAmount}
                onChange={e => setMusdtAmount(e.target.value)}
                className="sci-fi-input text-white placeholder-gray-400 mb-2"
                placeholder="Enter amount"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-300">You will receive:</span>
                <span className="font-mono neon-purple">{paperTokens.toLocaleString(undefined, { maximumFractionDigits: 4 })} PAPER</span>
              </div>
            </div>
            <Button className="w-full sci-fi-button text-white font-semibold mt-2" onClick={() => setFundModalOpen(false)} disabled={!musdtAmount || parseFloat(musdtAmount) <= 0}>
              Confirm (Mock)
            </Button>
          </div>
        </div>
      )}

      {/* Revoke Modal */}
      {revokeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(10, 20, 40, 0.95)' }}>
          <div className="rounded-xl p-8 shadow-2xl border border-red-500/40 min-w-[400px] flex flex-col bg-gradient-to-br from-[#0a1a28] via-[#1a2233] to-[#0a1a28] backdrop-blur-xl relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-400" onClick={() => setRevokeModalOpen(false)}><X className="w-5 h-5" /></button>
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <h2 className="text-xl font-bold text-red-400">Initiate Fund Revocation</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="text-sm text-red-300 mb-2">
                  <strong>⚠️ Warning:</strong> This action will initiate a vote to revoke all project funds. 
                  This should only be used if the research team is not providing updates or appears to be acting in bad faith.
                </div>
                <div className="text-xs text-gray-400">
                  • Requires {mockProject.governance.revokeInfo.requiredSignatures} signatures to pass<br/>
                  • 72-hour voting period<br/>
                  • If passed, all funds will be returned to contributors
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Reason for Revocation:</label>
                <textarea
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full h-24 bg-black/40 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 resize-none focus:border-red-500"
                  placeholder="Explain why you believe the funds should be revoked (e.g., lack of progress updates, suspicious activity, etc.)"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  className="flex-1 bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                  onClick={() => {
                    // Mock: Initiate revoke petition
                    setRevokeModalOpen(false);
                    setRevokeReason("");
                  }}
                  disabled={!revokeReason.trim()}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Initiate Revoke Petition
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setRevokeModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Milestone Vote Modal */}
{milestoneVoteModalOpen && selectedMilestone && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-8" style={{ background: 'rgba(10, 20, 40, 0.95)' }}>
    <div className="rounded-xl shadow-2xl border border-yellow-500/40 max-w-[500px] w-full max-h-[90vh] flex flex-col bg-gradient-to-br from-[#0a1a28] via-[#1a2233] to-[#0a1a28] backdrop-blur-xl relative">
      <div className="sticky top-0 z-10 px-8 py-6 bg-gradient-to-b from-[#0a1a28] to-[#0a1a28]/90 backdrop-blur-sm rounded-t-xl">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-yellow-400" onClick={() => setMilestoneVoteModalOpen(false)}>
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <Vote className="w-8 h-8 text-yellow-400" />
          <h2 className="text-xl font-bold text-yellow-400">Vote on Milestone Funding</h2>
        </div>
      </div>
      
      <div className="overflow-y-auto custom-scrollbar px-8 pb-8 pt-8">
        <div className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="font-semibold text-white mb-2">{selectedMilestone.name}</div>
            <div className="text-sm text-gray-300 mb-2">{selectedMilestone.description}</div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Budget:</span>
              <span className="text-yellow-400 font-semibold">${selectedMilestone.budget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Progress:</span>
              <span className="text-cyan-400">{selectedMilestone.progress}%</span>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-semibold text-gray-300 mb-3">Evidence Submitted:</div>
            <div className="space-y-2">
              {selectedMilestone.evidence.length > 0 ? (
                selectedMilestone.evidence.map((evidence: any, idx: number) => (
                  <Card key={idx} className="p-3 bg-black/30 border border-white/10">
                    <a 
                      href={evidence.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">{evidence.name}</span>
                      <Badge className="text-xs bg-gray-600/20 text-gray-400">{evidence.type}</Badge>
                    </a>
                  </Card>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No evidence uploaded yet</div>
              )}
            </div>
          </div>
          
          {/* Vote Summary */}
          <div className="bg-black/30 border border-white/10 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-300 mb-3">Current Vote Status</div>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{mockVoteData.totalVotes}</div>
                <div className="text-xs text-gray-400">Total Votes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{mockVoteData.allowVotes}</div>
                <div className="text-xs text-gray-400">Allow</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">{mockVoteData.rejectVotes}</div>
                <div className="text-xs text-gray-400">Reject</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Allow Progress:</span>
                <span className="text-green-400">{Math.round((mockVoteData.allowVotes / mockVoteData.totalVotes) * 100)}%</span>
              </div>
              <Progress 
                value={(mockVoteData.allowVotes / mockVoteData.totalVotes) * 100} 
                className="h-2 bg-red-500/20"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Time Remaining:</span>
                <span className="text-yellow-400 font-mono">{mockVoteData.timeRemaining}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-semibold text-gray-300 mb-3">Your Vote:</div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className={`h-12 ${userVote === "approve" 
                  ? "bg-green-500/20 text-green-400 border-green-500/30" 
                  : "bg-black/40 text-gray-300 border-white/10 hover:bg-green-500/10"}`}
                onClick={() => setUserVote("approve")}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Allow Funding
              </Button>
              <Button 
                className={`h-12 ${userVote === "reject" 
                  ? "bg-red-500/20 text-red-400 border-red-500/30" 
                  : "bg-black/40 text-gray-300 border-white/10 hover:bg-red-500/10"}`}
                onClick={() => setUserVote("reject")}
              >
                <X className="w-5 h-5 mr-2" />
                Reject Funding
              </Button>
            </div>
          </div>
          
          <div className="bg-black/30 border border-white/10 rounded-lg p-4">
            <div className="text-sm text-gray-300 mb-2">
              <strong>Voting Guidelines:</strong>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              • <strong>Allow</strong> if evidence shows milestone completion<br/>
              • <strong>Reject</strong> if evidence is insufficient or unclear<br/>
              • Majority vote determines funding release<br/>
              • Voting period: 48 hours<br/>
              • Rejected milestones require additional evidence
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-gradient-to-t from-[#0a1a28] to-[#0a1a28]/90 pt-4 pb-2">
            <div className="flex space-x-3">
              <Button 
                className={`flex-1 ${
                  userVote === "approve" 
                    ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30" 
                    : userVote === "reject"
                    ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                }`}
                onClick={() => {
                  // Mock: Submit vote
                  setMilestoneVoteModalOpen(false);
                  setUserVote(null);
                  setSelectedMilestone(null);
                }}
                disabled={!userVote}
              >
                <Vote className="w-4 h-4 mr-2" />
                {userVote === "approve" ? "Submit Allow Vote" : 
                userVote === "reject" ? "Submit Reject Vote" : 
                "Submit Vote"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setMilestoneVoteModalOpen(false);
                  setUserVote(null);
                  setSelectedMilestone(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Plus, X, AlertCircle, Wallet } from "lucide-react";
import { usePaper, PaperData } from "@/lib/paper-service";
import { ConnectButton } from '@iota/dapp-kit';

interface CreateProjectFormData {
  title: string;
  abstract: string;
  category: string;
  domain: string;
  tags: string[];
  authorName: string;
  authorAffiliation: string;
  authorImage: string;
  orcidId: string;
  imageUrl: string;
  fundingGoal: number;
  daysLeft: number;
  technicalApproach: string;
  timeline: Array<{
    phase: string;
    estimatedStartDate: string;
    estimatedEndDate: string;
    amountNeeded: number;
    description: string;
    status: "pending" | "active" | "completed";
  }>;
  returns: {
    revenueModels: string[];
  };
}

const categories = [
  "AI/ML",
  "Quantum Computing",
  "Biotech",
  "Climate Science",
  "Neuroscience",
  "Cryptography",
  "Blockchain",
  "Robotics",
  "Space Exploration",
  "Energy",
  "Other",
];

export default function CreateProjectForm() {
  const { user, getAuthHeaders } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeployingContract, setIsDeployingContract] = useState(false);
  
  // Use the paper service for smart contract interaction
  const { deployPaper, isConnected, address } = usePaper();

  const [formData, setFormData] = useState<CreateProjectFormData>({
    title: "",
    abstract: "",
    category: "",
    domain: "",
    tags: [],
    authorName: user?.name || "",
    authorAffiliation: "",
    authorImage: user?.avatar_url || "",
    orcidId: "",
    imageUrl: "",
    fundingGoal: 0,
    daysLeft: 30,
    technicalApproach: "",
    timeline: [
      {
        phase: "Research Phase",
        estimatedStartDate: "",
        estimatedEndDate: "",
        amountNeeded: 0,
        description: "Initial research and literature review",
        status: "pending",
      },
    ],
    returns: {
      revenueModels: [],
    },
  });

  const handleInputChange = (
    field: keyof CreateProjectFormData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTimelineItem = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        {
          phase: "",
          estimatedStartDate: "",
          estimatedEndDate: "",
          amountNeeded: 0,
          description: "",
          status: "pending" as const,
        },
      ],
    }));
  };

  const updateTimelineItem = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeTimelineItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== CREATE PROJECT FORM SUBMISSION START ===");
    console.log("User:", user?.id, user?.email);
    console.log("Wallet connected:", isConnected);
    console.log("Wallet address:", address);
    console.log("Form data:", formData);

    if (!user) {
      console.error("❌ No user authenticated");
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a project",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      console.error("❌ Wallet not connected");
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to deploy the smart contract",
        variant: "destructive",
      });
      return;
    }

    // Validation
    console.log("🔍 Validating form data...");
    const missingFields = [];
    if (!formData.title) missingFields.push("title");
    if (!formData.abstract) missingFields.push("abstract");
    if (!formData.category) missingFields.push("category");
    if (!formData.authorName) missingFields.push("authorName");
    if (!formData.authorAffiliation) missingFields.push("authorAffiliation");

    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    if (formData.fundingGoal <= 0) {
      console.error("❌ Invalid funding goal:", formData.fundingGoal);
      toast({
        title: "Invalid Funding Goal",
        description: "Funding goal must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    console.log("✅ Form validation passed");

    setIsLoading(true);
    setIsDeployingContract(true);

    try {
      console.log("🚀 Starting smart contract interaction...");
      
      // Prepare the paper data for the smart contract
      const paperData: PaperData = {
        title: formData.title,
        abstract: formData.abstract,
        category: formData.category,
        domain: formData.domain,
        tags: formData.tags,
        technicalApproach: formData.technicalApproach,
        projectImage: formData.imageUrl,
        authorName: formData.authorName,
        authorAffiliation: formData.authorAffiliation,
        authorImage: formData.authorImage,
        orcidId: formData.orcidId,
        fundingGoal: formData.fundingGoal,
        campaignDurationDays: formData.daysLeft,
        researchTeamPercentage: researchTeamPct,
        revenueModels: formData.returns.revenueModels,
        rcltPriceInMusdt: 1000000 // 1 MUSDT = 1 RCLT token (adjustable)
      };

      console.log("📋 Prepared paper data:", paperData);
      console.log("🔗 Calling deployPaper with wallet address:", address);

      // Deploy the research paper using the smart contract
      const result = await deployPaper(paperData);
      
      console.log("📡 Smart contract result:", result);

      if (result.success) {
        console.log("✅ Smart contract deployment successful!");
        console.log("Transaction ID:", result.transactionId);
        console.log("Paper ID:", result.paperId);
        
        toast({
          title: "Research Paper Deployed!",
          description: `Transaction ID: ${result.transactionId}`,
        });

        // Also save to the database for the web interface
        console.log("💾 Saving to database...");
        const authHeaders = getAuthHeaders();
        if (authHeaders) {
          const payload = {
            title: formData.title,
            abstract: formData.abstract,
            category: formData.category,
            authorName: formData.authorName,
            authorAffiliation: formData.authorAffiliation,
            authorImage: formData.authorImage,
            imageUrl: formData.imageUrl,
            fundingGoal: formData.fundingGoal,
            daysLeft: formData.daysLeft,
            technicalApproach: formData.technicalApproach,
            timeline: formData.timeline,
            blockchainTransactionId: result.transactionId,
            blockchainPaperId: result.paperId
          };

          console.log("📤 Database payload:", payload);

          const response = await fetch("/api/projects", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            body: JSON.stringify(payload),
          });

          console.log("📥 Database response status:", response.status);
          
          if (response.ok) {
            const dbResult = await response.json();
            console.log("✅ Database save successful:", dbResult);
            router.push(`/project/${dbResult.id}`);
          } else {
            console.error("❌ Database save failed:", response.status, response.statusText);
            const errorText = await response.text();
            console.error("Database error details:", errorText);
          }
        } else {
          console.error("❌ No auth headers available for database save");
        }
      } else {
        console.error("❌ Smart contract deployment failed!");
        console.error("Error details:", result.error);
        console.error("Full result:", result);
        
        toast({
          title: "Smart Contract Deployment Failed",
          description: result.error || "Failed to deploy research proposal to blockchain",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("💥 Unexpected error during project creation:");
      console.error("Error type:", typeof error);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      console.error("Full error object:", error);
      
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log("🏁 Form submission completed");
      setIsLoading(false);
      setIsDeployingContract(false);
    }
  };

  const [researchTeamPct, setResearchTeamPct] = useState(10);
  const platformPct = 5;
  const maxResearchTeamPct = 95;
  const investorPct = Math.max(0, 100 - platformPct - researchTeamPct);
  const fundraisingGoal = formData.fundingGoal || 0;
  const totalTokens = investorPct > 0 ? Math.round(fundraisingGoal / (investorPct / 100)) : 0;
  const tokensForPlatform = Math.round(totalTokens * (platformPct / 100));
  const tokensForResearch = Math.round(totalTokens * (researchTeamPct / 100));
  const tokensForInvestors = Math.round(totalTokens * (investorPct / 100));
  const researchTeamError = researchTeamPct < 0 || researchTeamPct > (100 - platformPct);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="sci-fi-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold neon-cyan">
            Publish Your Research
          </CardTitle>
          <CardDescription className="text-gray-400">
            Share your groundbreaking research with the PaperFans community and deploy it on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Wallet Connection Status */}
          <div className="mb-6 p-4 rounded-lg border border-white/10 bg-black/50">
            {isConnected ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-green-400">
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm">Wallet Connected</span>
                </div>
                {address && (
                  <div className="text-xs text-gray-400 font-mono">
                    Address: {address.slice(0, 6)}...{address.slice(-4)}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-yellow-400">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">Wallet Not Connected</span>
                </div>
                <div className="mt-2">
                  <ConnectButton />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold neon-purple">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-300"
                  >
                    Project Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="sci-fi-input text-white placeholder-gray-400"
                    placeholder="Enter your project title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-300"
                  >
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="sci-fi-input text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-sci-fi-dark border-neon-cyan">
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="text-white hover:bg-neon-cyan/20"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain" className="text-sm font-medium text-gray-300">Domain / Field *</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={e => handleInputChange("domain", e.target.value)}
                  className="sci-fi-input text-white placeholder-gray-400"
                  placeholder="e.g. Biotech, AI, Climate"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium text-gray-300">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(", ")}
                  onChange={e => handleInputChange("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                  className="sci-fi-input text-white placeholder-gray-400"
                  placeholder="AI, Biotech, Drug Discovery"
                />
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded text-xs font-mono">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="abstract"
                  className="text-sm font-medium text-gray-300"
                >
                  Abstract *
                </Label>
                <Textarea
                  id="abstract"
                  value={formData.abstract}
                  onChange={(e) =>
                    handleInputChange("abstract", e.target.value)
                  }
                  className="sci-fi-input text-white placeholder-gray-400 min-h-[120px]"
                  placeholder="Provide a brief overview of your research project"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="imageUrl"
                  className="text-sm font-medium text-gray-300"
                >
                  Project Image URL
                </Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    handleInputChange("imageUrl", e.target.value)
                  }
                  className="sci-fi-input text-white placeholder-gray-400"
                  placeholder="https://example.com/project-image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="technicalApproach"
                  className="text-sm font-medium text-gray-300"
                >
                  Technical Approach
                </Label>
                <Textarea
                  id="technicalApproach"
                  value={formData.technicalApproach}
                  onChange={(e) =>
                    handleInputChange("technicalApproach", e.target.value)
                  }
                  className="sci-fi-input text-white placeholder-gray-400 min-h-[120px]"
                  placeholder="Describe your technical methodology and approach"
                />
              </div>
            </div>

            {/* Author Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold neon-purple">
                Author Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="authorName"
                    className="text-sm font-medium text-gray-300"
                  >
                    Author Name *
                  </Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) =>
                      handleInputChange("authorName", e.target.value)
                    }
                    className="sci-fi-input text-white placeholder-gray-400"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="authorAffiliation"
                    className="text-sm font-medium text-gray-300"
                  >
                    Affiliation *
                  </Label>
                  <Input
                    id="authorAffiliation"
                    value={formData.authorAffiliation}
                    onChange={(e) =>
                      handleInputChange("authorAffiliation", e.target.value)
                    }
                    className="sci-fi-input text-white placeholder-gray-400"
                    placeholder="University, Company, or Organization"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="authorImage"
                  className="text-sm font-medium text-gray-300"
                >
                  Author Image URL
                </Label>
                <Input
                  id="authorImage"
                  value={formData.authorImage}
                  onChange={(e) =>
                    handleInputChange("authorImage", e.target.value)
                  }
                  className="sci-fi-input text-white placeholder-gray-400"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orcidId" className="text-sm font-medium text-gray-300">ORCID ID</Label>
                <Input
                  id="orcidId"
                  value={formData.orcidId}
                  onChange={e => handleInputChange("orcidId", e.target.value)}
                  className="sci-fi-input text-white placeholder-gray-400"
                  placeholder="0000-0002-1825-0097"
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold neon-purple">
                Funding Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="fundingGoal"
                    className="text-sm font-medium text-gray-300"
                  >
                    Funding Goal ($) *
                  </Label>
                  <Input
                    id="fundingGoal"
                    type="number"
                    value={formData.fundingGoal}
                    onChange={(e) =>
                      handleInputChange(
                        "fundingGoal",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="sci-fi-input text-white placeholder-gray-400"
                    placeholder="50000"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="daysLeft"
                    className="text-sm font-medium text-gray-300"
                  >
                    Campaign Duration (days) *
                  </Label>
                  <Input
                    id="daysLeft"
                    type="number"
                    value={formData.daysLeft}
                    onChange={(e) =>
                      handleInputChange(
                        "daysLeft",
                        parseInt(e.target.value) || 30
                      )
                    }
                    className="sci-fi-input text-white placeholder-gray-400"
                    placeholder="30"
                    min="1"
                    max="365"
                    required
                  />
                </div>
              </div>

              {/* Tokenomics Section */}
              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-semibold neon-purple">Tokenomics</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="bg-black/60 rounded-lg p-4 shadow space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Platform Allocation (%)</Label>
                        <Input value={platformPct} readOnly className="w-20 text-right bg-gray-800 border-none" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Research Team (%)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={maxResearchTeamPct}
                          value={researchTeamPct}
                          onChange={e => {
                            let val = parseInt(e.target.value) || 0;
                            if (val > (100 - platformPct)) val = 100 - platformPct;
                            setResearchTeamPct(val);
                          }}
                          className={`w-20 text-right ${researchTeamError ? 'border-red-500' : ''}`}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Investor (%)</Label>
                        <Input value={investorPct} readOnly className="w-20 text-right bg-gray-800 border-none" />
                      </div>
                      {researchTeamError && (
                        <div className="text-red-400 text-xs mt-1">Total allocation cannot exceed 95% (platform is fixed at 5%)</div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-black/60 rounded-lg p-4 shadow space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Total Token Supply</span>
                        <span className="font-mono text-neon-cyan">{totalTokens.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Platform (5%)</span>
                        <span className="font-mono">{tokensForPlatform.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Research Team ({researchTeamPct}%)</span>
                        <span className="font-mono">{tokensForResearch.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Investors ({investorPct}%)</span>
                        <span className="font-mono">{tokensForInvestors.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold neon-purple">
                  Research Timeline
                </h3>
                <Button
                  type="button"
                  onClick={addTimelineItem}
                  variant="outline"
                  size="sm"
                  className="sci-fi-input hover:bg-neon-cyan/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Phase
                </Button>
              </div>
              <div className="space-y-4">
                {formData.timeline.map((item, index) => (
                  <div key={index} className="sci-fi-card p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-neon-cyan">
                        Phase {index + 1}
                      </h4>
                      {formData.timeline.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeTimelineItem(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">Phase Name</Label>
                        <Input
                          value={item.phase}
                          onChange={(e) => updateTimelineItem(index, "phase", e.target.value)}
                          className="sci-fi-input text-white placeholder-gray-400"
                          placeholder="Phase name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">Estimated Start Date</Label>
                        <Input
                          type="date"
                          value={item.estimatedStartDate}
                          onChange={(e) => updateTimelineItem(index, "estimatedStartDate", e.target.value)}
                          className="sci-fi-input text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">Estimated End Date</Label>
                        <Input
                          type="date"
                          value={item.estimatedEndDate}
                          onChange={(e) => updateTimelineItem(index, "estimatedEndDate", e.target.value)}
                          className="sci-fi-input text-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">Amount Needed ($)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={`${item.amountNeeded ?? ''}`}
                          onChange={(e) => updateTimelineItem(index, "amountNeeded", (parseFloat(e.target.value) || 0).toString())}
                          className="sci-fi-input text-white placeholder-gray-400"
                          placeholder="Amount needed for this phase"
                        />
                        <div className="text-xs text-gray-400 mt-1">
                          {formData.fundingGoal > 0 && item.amountNeeded > 0 ? (
                            <span>
                              {((item.amountNeeded / formData.fundingGoal) * 100).toFixed(2)}% of total funding goal
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateTimelineItem(index, "description", e.target.value)}
                          className="sci-fi-input text-white placeholder-gray-400"
                          placeholder="Describe what will be accomplished in this phase"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Unallocated Funds */}
              <div className="mt-4 text-right">
                <span className="font-semibold text-gray-300">Unallocated Funds: </span>
                <span className="font-mono text-neon-cyan">
                  ${(
                    formData.fundingGoal - formData.timeline.reduce((sum, item) => sum + (item.amountNeeded || 0), 0)
                  ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Returns / Royalties */}
            <div className="space-y-6 mt-8">
              <h3 className="text-xl font-semibold neon-purple">Returns / Royalties</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Expected Revenue Models</Label>
                  <div className="flex flex-col gap-2">
                    {formData.returns.revenueModels.map((model, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input
                          value={model}
                          onChange={e => setFormData(prev => {
                            const arr = [...prev.returns.revenueModels];
                            arr[i] = e.target.value;
                            return { ...prev, returns: { ...prev.returns, revenueModels: arr } };
                          })}
                          className="sci-fi-input text-white"
                          placeholder="e.g. Token Royalties"
                        />
                        <Button type="button" size="sm" variant="ghost" className="text-red-400" onClick={() => setFormData(prev => ({
                          ...prev,
                          returns: { ...prev.returns, revenueModels: prev.returns.revenueModels.filter((_, idx) => idx !== i) }
                        }))}><X className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button type="button" size="sm" variant="outline" className="w-fit" onClick={() => setFormData(prev => ({
                      ...prev,
                      returns: { ...prev.returns, revenueModels: [...prev.returns.revenueModels, ""] }
                    }))}>
                      <Plus className="h-4 w-4 mr-1" /> Add Expected Revenue Model
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="sci-fi-input hover:bg-neon-cyan/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !isConnected}
                className="sci-fi-button text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isDeployingContract ? "Deploying Smart Contract..." : "Creating Project..."}
                  </>
                ) : (
                  <span className="relative z-10">Deploy Research Proposal</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
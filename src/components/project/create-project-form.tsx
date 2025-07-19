"use client";
import { ConnectButton } from "@iota/dapp-kit";

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
import { Loader2, Upload, Plus, X, AlertCircle } from "lucide-react";
import { Transaction } from "@iota/iota-sdk/transactions";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@iota/dapp-kit";
import { RESEARCH_CONTRACT_CONFIG } from "@/lib/researchPaperIscConfig";
import { ExternalLink } from "lucide-react";

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

export function CreateProjectForm() {
  const { user, getAuthHeaders } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [createdTokenId, setCreatedTokenId] = useState<string | null>(null);
  const [transactionDigest, setTransactionDigest] = useState<string | null>(null);

  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute, isPending: isContractPending } = useSignAndExecuteTransaction();

   function serializeString(str: string): number[] {
    return Array.from(new TextEncoder().encode(str));
  }
  
  // Add function to serialize string arrays for IOTA contract calls
  function serializeStringArray(strArray: string[]): number[] {
    const result: number[] = [];
    
    // Vector length as u32 (little-endian)
    result.push(
      strArray.length, 
      0, 
      0, 
      0
    );
    
    for (const str of strArray) {
      const bytes = serializeString(str);
      // String length as u32 (little-endian)
      result.push(
        bytes.length, 
        0, 
        0, 
        0
      );
      // Actual bytes
      result.push(...bytes);
    }
    
    return result;
  }

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

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a project",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (
      !formData.title ||
      !formData.abstract ||
      !formData.category ||
      !formData.authorName ||
      !formData.authorAffiliation
    ) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.fundingGoal <= 0) {
      toast({
        title: "Invalid Funding Goal",
        description: "Funding goal must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First create the blockchain token
      if (currentAccount) {
        // Create transaction for the smart contract
        const transaction = new Transaction();
        
        // Prepare tags and revenue models arrays
        const tagsArray = formData.tags.length > 0 ? formData.tags : ["research"];
        const revenueModelsArray = formData.returns.revenueModels.length > 0 
          ? formData.returns.revenueModels 
          : ["Token Royalties"];

        // Call the create_proposal function on the smart contract
        transaction.moveCall({
          package: RESEARCH_CONTRACT_CONFIG.PACKAGE_ID,
          module: "ResearchToken",
          function: "create_proposal",
          arguments: [
            // Basic Information
            transaction.pure.vector("u8", serializeString(formData.title)),
            transaction.pure.vector("u8", serializeString(formData.abstract)),
            transaction.pure.vector("u8", serializeString(formData.category)),
            transaction.pure.vector("u8", serializeString(formData.domain || formData.category)),
            transaction.pure.vector("u8", serializeStringArray(tagsArray)),
            transaction.pure.vector("u8", serializeString(formData.technicalApproach)),
            transaction.pure.vector("u8", serializeString(formData.imageUrl)),
            
            // Author Information
            transaction.pure.vector("u8", serializeString(formData.authorName)),
            transaction.pure.vector("u8", serializeString(formData.authorAffiliation)),
            transaction.pure.vector("u8", serializeString(formData.authorImage)),
            transaction.pure.vector("u8", serializeString(formData.orcidId || "")),
            
            // Funding Details
            transaction.pure.u64(BigInt(formData.fundingGoal)),
            transaction.pure.u64(BigInt(formData.daysLeft)),
            transaction.pure.u64(BigInt(researchTeamPct)),
            
            // Returns/Royalties
            transaction.pure.vector("u8", serializeStringArray(revenueModelsArray)),
            
            // Treasury cap and policy cap IDs
            transaction.object(RESEARCH_CONTRACT_CONFIG.TREASURY_CAP_ID),
            transaction.object(RESEARCH_CONTRACT_CONFIG.POLICY_CAP_ID),
          ],
        });

        transaction.setGasBudget(30_000_000);

        // Execute the transaction
        await signAndExecute(
          {
            transaction,
            chain: RESEARCH_CONTRACT_CONFIG.NETWORK,
          },
          {
            onSuccess: async (result) => {
              setTransactionDigest(result.digest);
              
              // Now save the project details to your backend API including the transaction digest
              const authHeaders = getAuthHeaders();
              if (!authHeaders) {
                toast({
                  title: "Authentication Error",
                  description: "Please sign in again",
                  variant: "destructive",
                });
                return;
              }

              // Prepare payload with transaction details
              const payload = {
                title: formData.title,
                abstract: formData.abstract,
                category: formData.category,
                domain: formData.domain,
                tags: formData.tags,
                authorName: formData.authorName,
                authorAffiliation: formData.authorAffiliation,
                authorImage: formData.authorImage,
                orcidId: formData.orcidId,
                imageUrl: formData.imageUrl,
                fundingGoal: formData.fundingGoal,
                daysLeft: formData.daysLeft,
                technicalApproach: formData.technicalApproach,
                timeline: formData.timeline,
                researchTeamPercentage: researchTeamPct,
                investorPercentage: investorPct,
                platformPercentage: platformPct,
                revenueModels: formData.returns.revenueModels,
                transactionInfo: {
                  digest: result.digest,
                  network: RESEARCH_CONTRACT_CONFIG.NETWORK
                }
              };

              const response = await fetch("/api/projects", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...authHeaders,
                },
                body: JSON.stringify(payload),
              });

              if (!response.ok) {
                throw new Error("Failed to create project in backend");
              }

              const apiResult = await response.json();

              toast({
                title: "Research CLT Created!",
                description: "Your research project has been tokenized successfully",
              });

              router.push(`/project/${apiResult.id}`);
            },
            onError: (error) => {
              console.error("Transaction error:", error);
              toast({
                title: "Transaction Failed",
                description: `Failed to create token: ${error.message}`,
                variant: "destructive",
              });
              setIsLoading(false);
            },
          }
        );
      } else {
        // Fallback if wallet not connected
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to create a research token",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
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
            Share your groundbreaking research with the PaperFans community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
  {!currentAccount && (
    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-400" />
        <h3 className="text-lg font-medium text-red-300">
          Wallet Connection Required
        </h3>
      </div>
      <p className="text-gray-300 text-sm mt-2">
        Connect your IOTA wallet to publish your research project as a token.
      </p>
      <div className="mt-3">
        <ConnectButton />
      </div>
    </div>
  )}
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
                          onChange={(e) => updateTimelineItem(index, "amountNeeded", parseFloat(e.target.value) || 0)}
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
    disabled={isLoading || isContractPending || !currentAccount}
    className="sci-fi-button text-white font-semibold"
  >
    {isLoading || isContractPending ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {isContractPending ? "Creating Research Token..." : "Creating Project..."}
      </>
    ) : (
      <span className="relative z-10">
        {currentAccount ? "Publish Project" : "Connect Wallet to Publish"}
      </span>
    )}
  </Button>
</div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

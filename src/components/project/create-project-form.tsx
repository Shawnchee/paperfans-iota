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
import { Loader2, Upload, Plus, X } from "lucide-react";

interface CreateProjectFormData {
  title: string;
  abstract: string;
  category: string;
  domain: string;
  tags: string[];
  tagsInput?: string;
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

  const updateTimelineItem = (index: number, field: string, value: any) => {
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

  // Enhanced validation function
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Required field validation
    if (!formData.title.trim()) errors.push("Project title is required");
    if (!formData.abstract.trim()) errors.push("Abstract is required");
    if (!formData.category) errors.push("Category is required");
    if (!formData.domain.trim()) errors.push("Domain/Field is required");
    if (!formData.authorName.trim()) errors.push("Author name is required");
    if (!formData.authorAffiliation.trim()) errors.push("Author affiliation is required");

    // Funding validation
    if (formData.fundingGoal <= 0) errors.push("Funding goal must be greater than 0");
    if (formData.daysLeft <= 0 || formData.daysLeft > 365) errors.push("Campaign duration must be between 1 and 365 days");

    // Timeline validation
    if (formData.timeline.length === 0) {
      errors.push("At least one timeline phase is required");
    } else {
      formData.timeline.forEach((item, index) => {
        if (!item.phase.trim()) errors.push(`Phase ${index + 1}: Phase name is required`);
        if (!item.description.trim()) errors.push(`Phase ${index + 1}: Description is required`);
        if (item.amountNeeded < 0) errors.push(`Phase ${index + 1}: Amount needed cannot be negative`);
      });
    }

    // Check if timeline amounts exceed funding goal
    const totalTimelineAmount = formData.timeline.reduce((sum, item) => sum + (item.amountNeeded || 0), 0);
    if (totalTimelineAmount > formData.fundingGoal) {
      errors.push("Total timeline amounts cannot exceed the funding goal");
    }

    return { isValid: errors.length === 0, errors };
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

    // Enhanced validation
    const validation = validateForm();
    if (!validation.isValid) {
      toast({
        title: "Validation Errors",
        description: validation.errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        return;
      }

      // Prepare payload to match backend API expectations
      const payload = {
        title: formData.title.trim(),
        abstract: formData.abstract.trim(),
        category: formData.category,
        authorName: formData.authorName.trim(),
        authorAffiliation: formData.authorAffiliation.trim(),
        authorImage: formData.authorImage.trim() || null,
        imageUrl: formData.imageUrl.trim() || null,
        fundingGoal: formData.fundingGoal,
        daysLeft: formData.daysLeft,
        technicalApproach: formData.technicalApproach.trim() || null,
        timeline: formData.timeline, // Send as array, API will stringify
      };

      console.log('Submitting project data:', payload);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific API errors
        const errorMessage = result.error || result.details || "Failed to create project";
        throw new Error(errorMessage);
      }

      toast({
        title: "Project Created Successfully!",
        description: "Your research project has been published successfully",
      });

      // Navigate to the created project
      router.push(`/project/${result.id}`);
    } catch (error) {
      console.error('Project creation error:', error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [researchTeamPct, setResearchTeamPct] = useState(10);
  const platformPct = 5;
  const maxResearchTeamPct = 95; // Maximum 95% (since platform takes 5%)
  const investorPct = 95 - researchTeamPct; // Remaining percentage for public investors
  const fundraisingGoal = formData.fundingGoal || 0;
  
  // Calculate token amounts based on total funding goal
  const platformAmount = Math.round(fundraisingGoal * (platformPct / 100));
  const researchTeamAmount = Math.round(fundraisingGoal * (researchTeamPct / 100));
  const investorAmount = Math.round(fundraisingGoal * (investorPct / 100));
  
  // Total tokens equals the funding goal (1:1 ratio)
  const totalTokens = fundraisingGoal;
  const tokensForPlatform = platformAmount;
  const tokensForResearch = researchTeamAmount;
  const tokensForInvestors = investorAmount;
  
  const researchTeamError = researchTeamPct < 0 || researchTeamPct > maxResearchTeamPct;

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
                  value={formData.tagsInput !== undefined ? formData.tagsInput : formData.tags.join(", ")}
                  onChange={e => {
                    // Store the raw input for controlled input
                    handleInputChange("tagsInput", e.target.value);
                    // Only update tags array when user types a comma or blurs the field
                    if (e.target.value.includes(",")) {
                      const tagsArr = e.target.value
                        .split(",")
                        .map(t => t.trim())
                        .filter(Boolean);
                      handleInputChange("tags", tagsArr);
                    } else if (e.target.value === "") {
                      handleInputChange("tags", []);
                    }
                  }}
                  onBlur={e => {
                    // On blur, always update tags array to match input
                    const tagsArr = e.target.value
                      .split(",")
                      .map(t => t.trim())
                      .filter(Boolean);
                    handleInputChange("tags", tagsArr);
                    handleInputChange("tagsInput", tagsArr.join(", "));
                  }}
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
                <div>
                  <h3 className="text-xl font-semibold neon-purple">Funding Allocation</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    The platform takes a 5% fee from the total funding. You can allocate the remaining 95% between your research team and public investors.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="bg-black/60 rounded-lg p-4 shadow space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Platform Fee (%)</Label>
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
                            if (val > maxResearchTeamPct) val = maxResearchTeamPct;
                            setResearchTeamPct(val);
                          }}
                          className={`w-20 text-right ${researchTeamError ? 'border-red-500' : ''}`}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Public Investors (%)</Label>
                        <Input value={investorPct} readOnly className="w-20 text-right bg-gray-800 border-none" />
                      </div>
                      {researchTeamError && (
                        <div className="text-red-400 text-xs mt-1">Research team allocation cannot exceed 95% (platform fee is fixed at 5%)</div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-black/60 rounded-lg p-4 shadow space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Total Funding Goal</span>
                        <span className="font-mono text-neon-cyan">${fundraisingGoal.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Platform Fee (5%)</span>
                        <span className="font-mono">${platformAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Research Team ({researchTeamPct}%)</span>
                        <span className="font-mono">${researchTeamAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Public Investors ({investorPct}%)</span>
                        <span className="font-mono">${investorAmount.toLocaleString()}</span>
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
                        <Label className="text-xs text-gray-400">Phase Name *</Label>
                        <Input
                          value={item.phase}
                          onChange={(e) => updateTimelineItem(index, "phase", e.target.value)}
                          className="sci-fi-input text-white placeholder-gray-400"
                          placeholder="Phase name"
                          required
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
                        <Label className="text-xs text-gray-400">Description *</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateTimelineItem(index, "description", e.target.value)}
                          className="sci-fi-input text-white placeholder-gray-400"
                          placeholder="Describe what will be accomplished in this phase"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Unallocated Funds */}
              <div className="mt-4 text-right">
                <span className="font-semibold text-gray-300">Unallocated Funds: </span>
                <span className={`font-mono ${formData.fundingGoal - formData.timeline.reduce((sum, item) => sum + (item.amountNeeded || 0), 0) < 0 ? 'text-red-400' : 'text-neon-cyan'}`}>
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
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="sci-fi-button text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  <span className="relative z-10">Publish Project</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

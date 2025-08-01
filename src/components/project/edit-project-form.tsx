"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Plus, X, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditProjectFormData {
  title: string;
  abstract: string;
  category: string;
  authorName: string;
  authorAffiliation: string;
  authorImage: string;
  imageUrl: string;
  fundingGoal: number;
  daysLeft: number;
  technicalApproach: string;
  timeline: Array<{
    phase: string;
    duration: string;
    description: string;
    status: "pending" | "active" | "completed";
  }>;
  fundingTiers: Array<{
    name: string;
    description: string;
    amount: number;
    benefits: string[];
    maxBackers?: number;
  }>;
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

interface EditProjectFormProps {
  projectId: string;
}

export function EditProjectForm({ projectId }: EditProjectFormProps) {
  const { user, getAuthHeaders } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  const [formData, setFormData] = useState<EditProjectFormData>({
    title: "",
    abstract: "",
    category: "",
    authorName: user?.name || "",
    authorAffiliation: "",
    authorImage: user?.avatar_url || "",
    imageUrl: "",
    fundingGoal: 0,
    daysLeft: 30,
    technicalApproach: "",
    timeline: [],
    fundingTiers: [],
  });

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        const authHeaders = getAuthHeaders();
        if (!authHeaders) {
          toast({
            title: "Authentication Error",
            description: "Please sign in again",
            variant: "destructive",
          });
          router.push("/auth");
          return;
        }

        const response = await fetch(`/api/projects/${projectId}`, {
          headers: authHeaders,
        });

        

        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "Project Not Found",
              description: "The project you're looking for doesn't exist",
              variant: "destructive",
            });
          } else if (response.status === 403) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to edit this project",
              variant: "destructive",
            });
          } else {
            throw new Error("Failed to fetch project");
          }
          router.push("/dashboard");
          return;
        }

        const project = await response.json();

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

        setFormData({
          title: project.title,
          abstract: project.abstract,
          category: project.category,
          authorName: project.authorName,
          authorAffiliation: project.authorAffiliation,
          authorImage: project.authorImage || "",
          imageUrl: project.imageUrl || "",
          fundingGoal: project.fundingGoal,
          daysLeft: project.daysLeft,
          technicalApproach: project.technicalApproach || "",
          timeline: safeJsonParse(project.timeline),
          fundingTiers: project.fundingTiers || [],
        });
      } catch (error) {
        console.error("Error loading project:", error);
        toast({
          title: "Error Loading Project",
          description: "Failed to load project data. Please try again.",
          variant: "destructive",
        });
        router.push("/dashboard");
      } finally {
        setIsLoadingProject(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId, router, toast]);

  const handleInputChange = (field: keyof EditProjectFormData, value: any) => {
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
          duration: "",
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

  const addFundingTier = () => {
    setFormData((prev) => ({
      ...prev,
      fundingTiers: [
        ...prev.fundingTiers,
        {
          name: "",
          description: "",
          amount: 0,
          benefits: [""],
        },
      ],
    }));
  };

  const updateFundingTier = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      fundingTiers: prev.fundingTiers.map((tier, i) =>
        i === index ? { ...tier, [field]: value } : tier
      ),
    }));
  };

  const updateFundingTierBenefit = (
    tierIndex: number,
    benefitIndex: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      fundingTiers: prev.fundingTiers.map((tier, i) =>
        i === tierIndex
          ? {
              ...tier,
              benefits: tier.benefits.map((benefit, j) =>
                j === benefitIndex ? value : benefit
              ),
            }
          : tier
      ),
    }));
  };

  const addFundingTierBenefit = (tierIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      fundingTiers: prev.fundingTiers.map((tier, i) =>
        i === tierIndex ? { ...tier, benefits: [...tier.benefits, ""] } : tier
      ),
    }));
  };

  const removeFundingTierBenefit = (
    tierIndex: number,
    benefitIndex: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      fundingTiers: prev.fundingTiers.map((tier, i) =>
        i === tierIndex
          ? {
              ...tier,
              benefits: tier.benefits.filter((_, j) => j !== benefitIndex),
            }
          : tier
      ),
    }));
  };

  const removeFundingTier = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fundingTiers: prev.fundingTiers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to edit projects",
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
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          ...formData,
          timeline: formData.timeline.filter(
            (item) => item.phase && item.description
          ),
          fundingTiers: formData.fundingTiers.filter(
            (tier) => tier.name && tier.amount > 0
          ),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      toast({
        title: "Project Updated!",
        description: "Your research project has been updated successfully",
      });

      router.push(`/project/${projectId}`);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProject) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="sci-fi-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold neon-cyan">
                Edit Project
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your research project details
              </CardDescription>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="sci-fi-input">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
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
            </div>

            {/* Project Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold neon-purple">
                Project Details
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
                      <Button
                        type="button"
                        onClick={() => removeTimelineItem(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">
                          Phase Name
                        </Label>
                        <Input
                          value={item.phase}
                          onChange={(e) =>
                            updateTimelineItem(index, "phase", e.target.value)
                          }
                          className="sci-fi-input text-white placeholder-gray-400"
                          placeholder="Research Phase"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">
                          Duration
                        </Label>
                        <Input
                          value={item.duration}
                          onChange={(e) =>
                            updateTimelineItem(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                          className="sci-fi-input text-white placeholder-gray-400"
                          placeholder="3 months"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-400">
                        Description
                      </Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          updateTimelineItem(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="sci-fi-input text-white placeholder-gray-400"
                        placeholder="Describe what will be accomplished in this phase"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Funding Tiers */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold neon-purple">
                  Funding Tiers
                </h3>
                <Button
                  type="button"
                  onClick={addFundingTier}
                  variant="outline"
                  size="sm"
                  className="sci-fi-input hover:bg-neon-cyan/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </div>

              <div className="space-y-4">
                {formData.fundingTiers.map((tier, index) => (
                  <div key={index} className="sci-fi-card p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-neon-cyan">
                        Tier {index + 1}
                      </h4>
                      <Button
                        type="button"
                        onClick={() => removeFundingTier(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">
                          Tier Name
                        </Label>
                        <Input
                          value={tier.name}
                          onChange={(e) =>
                            updateFundingTier(index, "name", e.target.value)
                          }
                          className="sci-fi-input text-white placeholder-gray-400"
                          placeholder="Early Supporter"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">
                          Amount ($)
                        </Label>
                        <Input
                          type="number"
                          value={tier.amount}
                          onChange={(e) =>
                            updateFundingTier(
                              index,
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="sci-fi-input text-white placeholder-gray-400"
                          placeholder="50"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-400">
                        Description
                      </Label>
                      <Textarea
                        value={tier.description}
                        onChange={(e) =>
                          updateFundingTier(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="sci-fi-input text-white placeholder-gray-400"
                        placeholder="Describe what backers get at this tier"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-gray-400">
                          Benefits
                        </Label>
                        <Button
                          type="button"
                          onClick={() => addFundingTierBenefit(index)}
                          variant="ghost"
                          size="sm"
                          className="text-neon-cyan hover:text-neon-purple"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Benefit
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {tier.benefits.map((benefit, benefitIndex) => (
                          <div
                            key={benefitIndex}
                            className="flex items-center space-x-2"
                          >
                            <Input
                              value={benefit}
                              onChange={(e) =>
                                updateFundingTierBenefit(
                                  index,
                                  benefitIndex,
                                  e.target.value
                                )
                              }
                              className="sci-fi-input text-white placeholder-gray-400"
                              placeholder="Benefit description"
                            />
                            {tier.benefits.length > 1 && (
                              <Button
                                type="button"
                                onClick={() =>
                                  removeFundingTierBenefit(index, benefitIndex)
                                }
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/dashboard">
                <Button
                  type="button"
                  variant="outline"
                  className="sci-fi-input hover:bg-neon-cyan/20"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="sci-fi-button text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Project...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    <span className="relative z-10">Update Project</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Copy, Download, Share2, X, Loader2, Twitter, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/lib/types";

// Interface for the enhanced project data structure
interface ProjectDetail extends Project {
  domain?: string;
  tags?: string[];
  researcher?: {
    name: string;
    wallet: string;
    orcid?: string;
    avatar?: string;
  };
  proposal?: {
    docUrl?: string;
    budget: number; 
    currency: string;
    timeline: Array<{
      phase: string;
      duration: string;
      status: "completed" | "active" | "pending";
    }>;
    milestones: Array<{
      name: string;
      status: "completed" | "active" | "pending";
    }>;
    goalSummary: string;
  };
  funding: {
    totalRequired: number;
    raised: number;
    tokenPrice: number;
    deadline: string;
  };
  governance?: {
    votingRights: number;
    pastVotes: Array<{
      id: number;
      desc: string;
      result: string;
      date: string;
    }>;
  };
  progress?: {
    currentMilestone: string;
    lastUpdated: string;
    logs: Array<{
      msg: string;
      time: string;
    }>;
    artifacts: Array<{
      name: string;
      url: string;
    }>;
  };
  returns?: {
    revenueModels: string[];
    profitBreakdown: Array<{
      label: string;
      value: number;
    }>;
    payouts: Array<{
      funder: string;
      amount: number;
    }>;
    contractProof: string;
  };
  community?: {
    supporters: Array<{
      name: string;
      amount: number;
    }>;
    comments: Array<{
      user: string;
      text: string;
      time: string;
    }>;
    shareUrl: string;
  };
}

const tabList = [
  { key: "basic", label: "📄 Basic Information" },
  { key: "proposal", label: "📑 Proposal" },
  { key: "funding", label: "💸 Funding Status" },
  { key: "governance", label: "🗳️ Governance Info" },
  { key: "progress", label: "📈 Progress Tracker" },
  { key: "returns", label: "💰 Returns / Royalties" },
  { key: "community", label: "🌐 Community" },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-6 p-6 shadow-lg bg-black/70 border border-white/10">
      <h2 className="text-xl font-bold mb-4 neon-cyan">{title}</h2>
      {children}
    </Card>
  );
}

export default function ProjectPage() {
  const params = useParams();
  const { toast } = useToast();
  const [tab, setTab] = useState("basic");
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [musdtAmount, setMusdtAmount] = useState("");
  const [mockWallet, setMockWallet] = useState(1000); // mock wallet balance
  
  // Project data state
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (!params?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Project not found");
          }
          throw new Error("Failed to load project");
        }
        
        const projectData: Project = await response.json();
        
        // Transform API data to match our expected format
        const transformedProject: ProjectDetail = {
          ...projectData,
          domain: projectData.category, // Use category as domain for now
          tags: projectData.category ? [projectData.category] : [],
          researcher: {
            name: projectData.authorName,
            wallet: "0x" + Math.random().toString(36).substring(2, 15), // Mock wallet
            orcid: "0000-0002-1825-0097", // Mock ORCID
            avatar: projectData.authorImage || "/next.svg",
          },
          proposal: {
            docUrl: "https://example.com/proposal.pdf", // Mock URL
            budget: projectData.fundingGoal,
            currency: "USD",
            timeline: projectData.timeline ? 
              (typeof projectData.timeline === 'string' ? 
                JSON.parse(projectData.timeline) : 
                projectData.timeline
              ).map((item: any, index: number) => ({
                phase: item.phase || `Phase ${index + 1}`,
                duration: item.estimatedEndDate && item.estimatedStartDate ? 
                  `${Math.ceil((new Date(item.estimatedEndDate).getTime() - new Date(item.estimatedStartDate).getTime()) / (1000 * 60 * 60 * 24 * 30))}m` : 
                  "1m",
                status: item.status || (index === 0 ? "active" : "pending")
              })) : [
                { phase: "Planning", duration: "1m", status: "completed" },
                { phase: "Research", duration: "2m", status: "active" },
                { phase: "Development", duration: "3m", status: "pending" },
              ],
            milestones: [
              { name: "Project Setup", status: "completed" },
              { name: "Research Phase", status: "active" },
              { name: "Development Phase", status: "pending" },
            ],
            goalSummary: projectData.abstract,
          },
          funding: {
            totalRequired: projectData.fundingGoal,
            raised: projectData.currentFunding,
            tokenPrice: 1.5, // Mock token price
            deadline: new Date(Date.now() + projectData.daysLeft * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          },
          governance: {
            votingRights: 1,
            pastVotes: [
              { id: 1, desc: "Approve project setup", result: "Passed", date: "2024-05-01" },
            ],
          },
          progress: {
            currentMilestone: "Research Phase",
            lastUpdated: new Date().toLocaleString(),
            logs: [
              { msg: "Project created successfully", time: new Date().toLocaleDateString() },
            ],
            artifacts: [
              { name: "Project Proposal", url: "https://example.com/proposal.pdf" },
            ],
          },
          returns: {
            revenueModels: ["Token Royalties", "Licensing", "Open Access"],
            profitBreakdown: [
              { label: "Researchers", value: 40 },
              { label: "Funders", value: 40 },
              { label: "Platform", value: 20 },
            ],
            payouts: [],
            contractProof: "0x" + Math.random().toString(36).substring(2, 15),
          },
          community: {
            supporters: [],
            comments: [
              { user: "System", text: "Project created", time: new Date().toLocaleDateString() },
            ],
            shareUrl: `${window.location.origin}/project/${params?.id}`,
          },
        };
        
        setProject(transformedProject);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : "Failed to load project");
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to load project",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params?.id, toast]);

  // Pie chart placeholder
  function PieChart({ data }: { data: { label: string; value: number }[] }) {
    return (
      <div className="flex space-x-4">
        {data.map((d) => (
          <div key={d.label} className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full" style={{ background: "#0ff2", border: "2px solid #0ff" }} />
            <span className="text-xs mt-1">{d.label} ({d.value}%)</span>
          </div>
        ))}
      </div>
    );
  }

  // Copy to clipboard
  const handleCopy = () => {
    if (!project?.community?.shareUrl) return;
    navigator.clipboard.writeText(project.community.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Social sharing functions
  const handleShareX = () => {
    if (!project) return;
    const text = `Check out this amazing research project: ${project.title} on PaperFans! 🚀`;
    const url = project.community?.shareUrl || window.location.href;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  };

  const handleShareTelegram = () => {
    if (!project) return;
    const text = `Check out this amazing research project: ${project.title} on PaperFans! 🚀`;
    const url = project.community?.shareUrl || window.location.href;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  const handleShareDiscord = () => {
    if (!project) return;
    const text = `Check out this amazing research project: ${project.title} on PaperFans! 🚀`;
    const url = project.community?.shareUrl || window.location.href;
    const shareUrl = `https://discord.com/api/oauth2/authorize?client_id=YOUR_DISCORD_CLIENT_ID&permissions=2048&scope=bot&response_type=code&redirect_uri=${encodeURIComponent(url)}`;
    // For now, just copy the URL to clipboard since Discord sharing is more complex
    navigator.clipboard.writeText(`${text}\n${url}`);
    toast({
      title: "Discord Share",
      description: "Project link copied! You can paste it in your Discord server.",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-neon-cyan" />
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Project Not Found</h2>
          <p className="text-gray-400 mb-4">{error || "The project you're looking for doesn't exist."}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const tokenPrice = project.funding.tokenPrice;
  const paperTokens = musdtAmount && parseFloat(musdtAmount) > 0 ? (parseFloat(musdtAmount) / tokenPrice) : 0;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-gray-400 max-w-2xl">{project.abstract}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Social Sharing Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleShareX}
                variant="outline"
                size="sm"
                className="sci-fi-input hover:bg-blue-500/20 hover:border-blue-500/50 transition-colors"
                title="Share on X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleShareTelegram}
                variant="outline"
                size="sm"
                className="sci-fi-input hover:bg-blue-500/20 hover:border-blue-500/50 transition-colors"
                title="Share on Telegram"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleShareDiscord}
                variant="outline"
                size="sm"
                className="sci-fi-input hover:bg-purple-500/20 hover:border-purple-500/50 transition-colors"
                title="Share on Discord"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </Button>
            </div>
            <Button className="sci-fi-button px-6 py-2 text-lg font-semibold shadow-neon-cyan" onClick={() => setFundModalOpen(true)}>Fund This Project</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
            {tabList.map((t) => (
              <button
                key={t.key}
                className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${tab === t.key ? "bg-neon-cyan/20 text-neon-cyan shadow" : "bg-black/40 text-gray-300"}`}
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
                    <span className="font-semibold">Title:</span> {project.title}
                  </div>
                  <div>
                    <span className="font-semibold">Abstract:</span>
                    <p className="text-gray-300 mt-1">{project.abstract}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Domain / Field:</span>
                    <Badge className="ml-2">{project.domain}</Badge>
                  </div>
                  <div>
                    <span className="font-semibold">Tags:</span>
                    <span className="ml-2 space-x-2">
                      {project.tags?.map((tag) => (
                        <Badge key={tag} className="inline-block">{tag}</Badge>
                      ))}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 min-w-[200px]">
                  <Avatar className="w-16 h-16">
                    <img src={project.researcher?.avatar} alt="avatar" className="rounded-full" />
                  </Avatar>
                  <div className="font-semibold">{project.researcher?.name}</div>
                  <div className="text-xs text-gray-400">Wallet: {project.researcher?.wallet}</div>
                  <div className="text-xs text-gray-400">ORCID: {project.researcher?.orcid || "-"}</div>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === "proposal" && (
            <SectionCard title="Proposal">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="font-semibold">Proposal Document:</span>
                    <a
                      href={project.proposal?.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-neon-cyan underline flex items-center gap-1"
                    >
                      <Download className="w-4 h-4 inline" /> Download PDF
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold">Budget:</span> ${project.proposal?.budget.toLocaleString()} {project.proposal?.currency}
                  </div>
                  <div>
                    <span className="font-semibold">Timeline:</span>
                    <div className="flex flex-row gap-4 mt-2">
                      {project.proposal?.timeline.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full mb-1 ${step.status === "completed" ? "bg-neon-green" : step.status === "active" ? "bg-neon-cyan" : "bg-gray-500"}`}></div>
                          <span className="text-xs font-mono">{step.phase}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">Milestone Breakdown:</span>
                    <ul className="list-disc ml-6 mt-1">
                      {project.proposal?.milestones.map((m, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span>{m.name}</span>
                          <Badge className={m.status === "active" ? "bg-neon-cyan/20 text-neon-cyan" : "bg-gray-600/20 text-gray-400"}>{m.status}</Badge>
                          <Button size="sm" variant="outline" className="ml-2">Vote</Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold">Goal Summary:</span>
                    <p className="text-gray-300 mt-1">{project.proposal?.goalSummary}</p>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === "funding" && (
            <SectionCard title="Funding Status">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="font-semibold">Total Funds Required:</span> ${project.funding.totalRequired.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Funds Raised So Far:</span> ${project.funding.raised.toLocaleString()}
                    <Progress value={project.funding.raised / project.funding.totalRequired * 100} className="mt-2" />
                  </div>
                  <div>
                    <span className="font-semibold">Token Price Allocation:</span> 1 token = ${project.funding.tokenPrice} USD
                  </div>
                  <div>
                    <span className="font-semibold">Deadline to Fund:</span> {project.funding.deadline}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === "governance" && (
            <SectionCard title="Governance Info">
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Voting Rights per Token:</span> {project.governance?.votingRights}
                </div>
                <div>
                  <span className="font-semibold">Past Votes:</span>
                  <table className="w-full mt-2 text-sm">
                    <thead>
                      <tr className="text-left text-gray-400">
                        <th className="py-1">#</th>
                        <th>Description</th>
                        <th>Result</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.governance?.pastVotes.map((vote) => (
                        <tr key={vote.id} className="border-b border-white/5">
                          <td className="py-1">{vote.id}</td>
                          <td>{vote.desc}</td>
                          <td>{vote.result}</td>
                          <td>{vote.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <span className="font-semibold">Forum/Discussion Thread:</span>
                  <div className="mt-2">
                    <Input placeholder="Add a comment (placeholder)" disabled />
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === "progress" && (
            <SectionCard title="Progress Tracker">
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Current Milestone:</span>
                  <Badge className="ml-2 bg-neon-cyan/20 text-neon-cyan">{project.progress?.currentMilestone}</Badge>
                </div>
                <div>
                  <span className="font-semibold">Last Updated:</span> {project.progress?.lastUpdated}
                </div>
                <div>
                  <span className="font-semibold">Update Logs:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {project.progress?.logs.map((log, i) => (
                      <li key={i} className="text-sm text-gray-300">{log.msg} <span className="text-xs text-gray-500 ml-2">({log.time})</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">Research Artifacts:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {project.progress?.artifacts.map((a, i) => (
                      <li key={i}>
                        <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-neon-cyan underline">{a.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === "returns" && (
            <SectionCard title="Returns / Royalties">
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Expected Revenue Models:</span>
                  <select className="ml-2 bg-black/40 border border-white/10 rounded px-2 py-1 text-white">
                    {project.returns?.revenueModels.map((model) => (
                      <option key={model}>{model}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="font-semibold">Profit Breakdown Model:</span>
                  <PieChart data={project.returns?.profitBreakdown || []} />
                </div>
                <div>
                  <span className="font-semibold">History of Payouts:</span>
                  <table className="w-full mt-2 text-sm">
                    <thead>
                      <tr className="text-left text-gray-400">
                        <th>Funder</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.returns?.payouts.map((p, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td>{p.funder}</td>
                          <td>${p.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <span className="font-semibold">Smart Contract Proof:</span>
                  <div className="ml-2 inline-block bg-black/40 px-2 py-1 rounded text-xs font-mono border border-white/10">
                    {project.returns?.contractProof}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === "community" && (
            <SectionCard title="Community">
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Supporters / Funders:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {project.community?.supporters.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="font-semibold">{s.name}</span>
                        <span className="text-xs text-gray-400">(${s.amount})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">Comments / Feedback:</span>
                  <div className="mt-2 space-y-2">
                    {project.community?.comments.map((c, i) => (
                      <div key={i} className="bg-black/30 rounded px-3 py-2 text-sm">
                        <span className="font-semibold">{c.user}:</span> {c.text}
                        <span className="ml-2 text-xs text-gray-500">({c.time})</span>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
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
                  <span className="font-semibold">Shareable Proposal URL:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={project.community?.shareUrl} readOnly className="flex-1" />
                    <Button size="icon" onClick={handleCopy} variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                    {copied && <span className="text-xs text-green-400 ml-2">Copied!</span>}
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Social Boost Tools:</span>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleShareX}
                      title="Share on X (Twitter)"
                      className="hover:bg-blue-500/20 hover:border-blue-500/50"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleShareTelegram}
                      title="Share on Telegram"
                      className="hover:bg-blue-500/20 hover:border-blue-500/50"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleShareDiscord}
                      title="Share on Discord"
                      className="hover:bg-purple-500/20 hover:border-purple-500/50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleCopy}
                      title="Copy Link"
                      className="hover:bg-green-500/20 hover:border-green-500/50"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
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
    </div>
  );
}

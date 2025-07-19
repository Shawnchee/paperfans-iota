"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Copy, Download, Share2, X } from "lucide-react";

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
    avatar: "/next.svg",
  },
  proposal: {
    docUrl: "https://example.com/proposal.pdf",
    budget: 120000,
    currency: "USD",
    timeline: [
      { phase: "Planning", duration: "1m", status: "completed" },
      { phase: "Data Collection", duration: "2m", status: "active" },
      { phase: "Model Training", duration: "3m", status: "pending" },
      { phase: "Validation", duration: "1m", status: "pending" },
    ],
    milestones: [
      { name: "Collect 10k protein samples", status: "active" },
      { name: "Train v1 model", status: "pending" },
      { name: "Publish preprint", status: "pending" },
    ],
    goalSummary:
      "Success means publishing a high-accuracy, open-access protein folding model and dataset.",
  },
  funding: {
    totalRequired: 120000,
    raised: 45000,
    tokenPrice: 1.5,
    deadline: "2024-08-31",
  },
  governance: {
    votingRights: 1,
    pastVotes: [
      { id: 1, desc: "Approve milestone 1", result: "Passed", date: "2024-05-01" },
      { id: 2, desc: "Change budget allocation", result: "Rejected", date: "2024-06-01" },
    ],
  },
  progress: {
    currentMilestone: "Data Collection",
    lastUpdated: "2024-06-10 14:30",
    logs: [
      { msg: "Collected 2k samples", time: "2024-06-09" },
      { msg: "Launched data pipeline", time: "2024-06-05" },
    ],
    artifacts: [
      { name: "Preprint v0.1", url: "https://arxiv.org/abs/1234.5678" },
      { name: "Dataset sample", url: "https://zenodo.org/record/123456" },
    ],
  },
  returns: {
    revenueModels: ["Token Royalties", "Licensing", "Open Access"],
    profitBreakdown: [
      { label: "Researchers", value: 40 },
      { label: "Funders", value: 40 },
      { label: "Platform", value: 20 },
    ],
    payouts: [
      { funder: "Alice", amount: 500 },
      { funder: "Bob", amount: 300 },
    ],
    contractProof: "0xabcdef1234567890",
  },
  community: {
    supporters: [
      { name: "Alice", amount: 500 },
      { name: "Bob", amount: 300 },
      { name: "Charlie", amount: 200 },
    ],
    comments: [
      { user: "Alice", text: "Excited for this!", time: "2024-06-10" },
      { user: "Bob", text: "How will data be shared?", time: "2024-06-09" },
    ],
    shareUrl: "https://paperfans.io/project/1",
  },
};

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
  const [tab, setTab] = useState("basic");
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [musdtAmount, setMusdtAmount] = useState("");
  const [mockWallet, setMockWallet] = useState(1000); // mock wallet balance

  // Pie chart placeholder
  function PieChart({ data }: { data: { label: string; value: number }[] }) {
    // Just a placeholder, not a real chart
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
    navigator.clipboard.writeText(mockProject.community.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
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
          <Button className="sci-fi-button px-6 py-2 text-lg font-semibold shadow-neon-cyan" onClick={() => setFundModalOpen(true)}>Fund This Project</Button>
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
                        <Badge key={tag} className="inline-block">{tag}</Badge>
                      ))}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 min-w-[200px]">
                  <Avatar className="w-16 h-16">
                    <img src={mockProject.researcher.avatar} alt="avatar" className="rounded-full" />
                  </Avatar>
                  <div className="font-semibold">{mockProject.researcher.name}</div>
                  <div className="text-xs text-gray-400">Wallet: {mockProject.researcher.wallet}</div>
                  <div className="text-xs text-gray-400">ORCID: {mockProject.researcher.orcid || "-"}</div>
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
                      href={mockProject.proposal.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-neon-cyan underline flex items-center gap-1"
                    >
                      <Download className="w-4 h-4 inline" /> Download PDF
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold">Budget:</span> ${mockProject.proposal.budget.toLocaleString()} {mockProject.proposal.currency}
                  </div>
                  <div>
                    <span className="font-semibold">Timeline:</span>
                    <div className="flex flex-row gap-4 mt-2">
                      {mockProject.proposal.timeline.map((step, idx) => (
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
                      {mockProject.proposal.milestones.map((m, i) => (
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
                    <p className="text-gray-300 mt-1">{mockProject.proposal.goalSummary}</p>
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
                    <span className="font-semibold">Total Funds Required:</span> ${mockProject.funding.totalRequired.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Funds Raised So Far:</span> ${mockProject.funding.raised.toLocaleString()}
                    <Progress value={mockProject.funding.raised / mockProject.funding.totalRequired * 100} className="mt-2" />
                  </div>
                  <div>
                    <span className="font-semibold">Token Price Allocation:</span> 1 token = ${mockProject.funding.tokenPrice} USD
                  </div>
                  <div>
                    <span className="font-semibold">Deadline to Fund:</span> {mockProject.funding.deadline}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === "governance" && (
            <SectionCard title="Governance Info">
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Voting Rights per Token:</span> {mockProject.governance.votingRights}
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
                      {mockProject.governance.pastVotes.map((vote) => (
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
                  <Badge className="ml-2 bg-neon-cyan/20 text-neon-cyan">{mockProject.progress.currentMilestone}</Badge>
                </div>
                <div>
                  <span className="font-semibold">Last Updated:</span> {mockProject.progress.lastUpdated}
                </div>
                <div>
                  <span className="font-semibold">Update Logs:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {mockProject.progress.logs.map((log, i) => (
                      <li key={i} className="text-sm text-gray-300">{log.msg} <span className="text-xs text-gray-500 ml-2">({log.time})</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">Research Artifacts:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {mockProject.progress.artifacts.map((a, i) => (
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
                    {mockProject.returns.revenueModels.map((model) => (
                      <option key={model}>{model}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="font-semibold">Profit Breakdown Model:</span>
                  <PieChart data={mockProject.returns.profitBreakdown} />
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
                      {mockProject.returns.payouts.map((p, i) => (
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
                    {mockProject.returns.contractProof}
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
                    {mockProject.community.supporters.map((s, i) => (
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
                    {mockProject.community.comments.map((c, i) => (
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
                    <Input value={mockProject.community.shareUrl} readOnly className="flex-1" />
                    <Button size="icon" onClick={handleCopy} variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                    {copied && <span className="text-xs text-green-400 ml-2">Copied!</span>}
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Social Boost Tools:</span>
                  <div className="flex gap-2 mt-2">
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
    </div>
  );
}

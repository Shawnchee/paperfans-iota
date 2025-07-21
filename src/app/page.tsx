"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Users, DollarSign, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";

const categories = [
  "All",
  "AI/ML",
  "Quantum",
  "Biotech",
  "Climate",
  "Neuro",
  "Crypto",
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  // Fetch projects from the API
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      return response.json();
    },
  });

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalFunding = projects.reduce(
    (sum, project) => sum + project.currentFunding,
    0
  );
  const totalProjects = projects.length;
  const totalResearchers = new Set(projects.map((p) => p.authorName)).size;

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Failed to load projects</h2>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
            alt="Futuristic technology interface"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-mono font-bold mb-6 float">
            <span className="glitch neon-cyan" data-text="Decentralized">
              Decentralized
            </span>
            <br />
            <span className="glitch text-white" data-text="Research Funding">
              Research Funding
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Democratize scientific research through{" "}
            <span className="neon-cyan">Web3</span>. Fund breakthrough papers,
            own future revenue, and accelerate human knowledge.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="sci-fi-button px-8 py-4 text-white font-semibold">
              <span className="relative z-10">Explore Research</span>
            </Button>
            {user ? (
              <Link href="/create-project">
                <Button
                  variant="outline"
                  className="px-8 py-4 sci-fi-input hover:bg-neon-cyan/10 transition-all duration-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button
                  variant="outline"
                  className="px-8 py-4 sci-fi-input hover:bg-neon-cyan/10 transition-all duration-300"
                >
                  Submit Paper
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="sci-fi-card rounded-xl p-8 text-center float" style={{ animationDelay: "0s" }}>
              <div className="relative">
                <DollarSign className="mx-auto mb-4 h-12 w-12 neon-cyan" />
                <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-xl"></div>
              </div>
              <div className="text-4xl font-mono font-bold neon-cyan mb-2">
                ${1.2}M
              </div>
              <div className="text-gray-400 font-medium">Total Funding</div>
            </div>
            <div className="sci-fi-card rounded-xl p-8 text-center float" style={{ animationDelay: "0.5s" }}>
              <div className="relative">
                <TrendingUp className="mx-auto mb-4 h-12 w-12 neon-purple" />
                <div className="absolute inset-0 bg-neon-purple/20 rounded-full blur-xl"></div>
              </div>
              <div className="text-4xl font-mono font-bold neon-purple mb-2">
                {totalProjects}
              </div>
              <div className="text-gray-400 font-medium">Active Projects</div>
            </div>
            <div className="sci-fi-card rounded-xl p-8 text-center float" style={{ animationDelay: "1s" }}>
              <div className="relative">
                <Users className="mx-auto mb-4 h-12 w-12 neon-green" />
                <div className="absolute inset-0 bg-neon-green/20 rounded-full blur-xl"></div>
              </div>
              <div className="text-4xl font-mono font-bold neon-green mb-2">
                {totalResearchers}
              </div>
              <div className="text-gray-400 font-medium">Researchers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neon-cyan z-10" />
            <Input
              placeholder="Search research projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sci-fi-input text-white placeholder-gray-400"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "sci-fi-badge text-white border-neon-cyan"
                    : "sci-fi-input hover:bg-neon-cyan/20 hover:text-neon-cyan hover:border-neon-cyan"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="glass-effect rounded-xl h-96 animate-pulse"
                />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold mb-4">No projects found</h3>
              <p className="text-gray-400">
                {searchQuery || selectedCategory !== "All"
                  ? "Try adjusting your search or filters"
                  : "Be the first to submit a research project!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

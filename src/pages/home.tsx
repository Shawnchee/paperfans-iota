import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Users, DollarSign } from "lucide-react";
import type { Project } from "@/lib/types";

const categories = ["All", "AI/ML", "Quantum", "Biotech", "Climate", "Neuro", "Crypto"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalFunding = projects.reduce((sum, project) => sum + project.currentFunding, 0);
  const totalProjects = projects.length;
  const totalResearchers = new Set(projects.map(p => p.authorName)).size;

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
    <div className="min-h-screen pt-20">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Futuristic technology interface" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-mono font-bold mb-6">
            <span className="neon-text neon-cyan">Decentralized</span><br />
            <span className="text-white">Research Funding</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Democratize scientific research through Web3. Fund breakthrough papers, own future revenue, and accelerate human knowledge.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300 animate-glow">
              Explore Research
            </Button>
            <Button variant="outline" className="px-8 py-4 glass-effect hover:bg-white/10 transition-all duration-300">
              Submit Paper
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-effect rounded-xl p-6 text-center hologram-border">
              <DollarSign className="mx-auto mb-2 h-8 w-8 neon-cyan" />
              <div className="text-3xl font-mono font-bold neon-cyan mb-2">
                ${(totalFunding / 1000000).toFixed(1)}M
              </div>
              <div className="text-gray-400">Total Funding</div>
            </div>
            <div className="glass-effect rounded-xl p-6 text-center hologram-border">
              <TrendingUp className="mx-auto mb-2 h-8 w-8 neon-purple" />
              <div className="text-3xl font-mono font-bold neon-purple mb-2">
                {totalProjects}
              </div>
              <div className="text-gray-400">Active Projects</div>
            </div>
            <div className="glass-effect rounded-xl p-6 text-center hologram-border">
              <Users className="mx-auto mb-2 h-8 w-8 neon-green" />
              <div className="text-3xl font-mono font-bold neon-green mb-2">
                {totalResearchers}
              </div>
              <div className="text-gray-400">Researchers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search research projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-effect border-white/20 focus:border-neon-cyan"
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
                    ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan"
                    : "glass-effect hover:bg-neon-cyan/20 hover:text-neon-cyan hover:border-neon-cyan"
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
                <div key={i} className="glass-effect rounded-xl h-96 animate-pulse" />
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

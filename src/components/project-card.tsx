import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FundingProgress } from "./funding-progress";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

const categoryColors = {
  "AI/ML": "bg-neon-cyan/20 text-neon-cyan",
  Quantum: "bg-neon-purple/20 text-neon-purple",
  Biotech: "bg-neon-green/20 text-neon-green",
  Climate: "bg-neon-cyan/20 text-neon-cyan",
  Neuro: "bg-neon-purple/20 text-neon-purple",
  Crypto: "bg-neon-green/20 text-neon-green",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const percentageFunded = (project.currentFunding / project.fundingGoal) * 100;

  return (
    <Link href={`/project/${project.id}`} className="block">
      <div className="sci-fi-card rounded-xl overflow-hidden cursor-pointer group relative">
        {/* Holographic Border Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

        <div className="relative bg-sci-fi-dark rounded-xl overflow-hidden">
          <div className="relative">
            <img
              src={project.imageUrl || ""}
              alt={project.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay with sci-fi effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-sci-fi-dark/80 to-transparent"></div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Badge
                className={`px-3 py-1 rounded-full text-xs font-mono sci-fi-badge ${
                  categoryColors[
                    project.category as keyof typeof categoryColors
                  ] || "bg-gray-600/20 text-gray-400"
                }`}
              >
                {project.category}
              </Badge>
              <span className="text-xs text-neon-cyan font-mono">
                {Math.round(percentageFunded)}% Funded
              </span>
            </div>

            <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-white group-hover:text-neon-cyan transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-sm text-gray-400 mb-4 line-clamp-3">
              {project.abstract}
            </p>

            <FundingProgress
              currentFunding={project.currentFunding}
              fundingGoal={project.fundingGoal}
              daysLeft={project.daysLeft}
              className="mb-4"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8 ring-2 ring-neon-cyan/30">
                  <AvatarImage
                    src={project.authorImage || ""}
                    alt={project.authorName}
                  />
                  <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                    {project.authorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-300">
                  {project.authorName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

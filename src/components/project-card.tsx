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
      <div className="project-card glass-effect rounded-xl overflow-hidden cursor-pointer">
        <img
          src={project.imageUrl || ""}
          alt={project.title}
          className="w-full h-48 object-cover"
        />

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge
              className={`px-3 py-1 rounded-full text-xs font-mono ${
                categoryColors[
                  project.category as keyof typeof categoryColors
                ] || "bg-gray-600/20 text-gray-400"
              }`}
            >
              {project.category}
            </Badge>
            <span className="text-xs text-gray-400 font-mono">
              {Math.round(percentageFunded)}% Funded
            </span>
          </div>

          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
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
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={project.authorImage || ""}
                  alt={project.authorName}
                />
                <AvatarFallback>
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
            <span className="text-xs neon-green font-mono">
              Expected ROI: {project.expectedRoi}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

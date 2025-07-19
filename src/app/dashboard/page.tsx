"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FundingProgress } from "@/components/funding-progress";
import { Plus, Edit, Eye, TrendingUp, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading, getAuthHeaders } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Fetch user's projects
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["/api/projects/my"],
    queryFn: async () => {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/projects/my", {
        headers: authHeaders,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      return await response.json();
    },
    enabled: !!user && !!getAuthHeaders(),
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  const totalFunding = projects.reduce(
    (sum, project) => sum + project.currentFunding,
    0
  );
  const totalBackers = projects.reduce(
    (sum, project) => sum + project.backerCount,
    0
  );
  const activeProjects = projects.filter((p) => p.daysLeft > 0).length;

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold neon-cyan mb-2">Dashboard</h1>
              <p className="text-gray-400">Manage your research projects</p>
            </div>
            <Link href="/create-project">
              <Button className="sci-fi-button text-white font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                <span className="relative z-10">Create Project</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="sci-fi-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-neon-cyan/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Funding</p>
                  <p className="text-2xl font-bold text-white">
                    ${totalFunding.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sci-fi-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-neon-purple/20 rounded-lg">
                  <Users className="h-6 w-6 text-neon-purple" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Backers</p>
                  <p className="text-2xl font-bold text-white">
                    {totalBackers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sci-fi-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-neon-green/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-neon-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-white">
                    {activeProjects}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Your Projects</h2>
            <Badge className="sci-fi-badge">
              {projects.length} {projects.length === 1 ? "Project" : "Projects"}
            </Badge>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="sci-fi-card animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-600 rounded mb-4"></div>
                    <div className="h-3 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="sci-fi-card">
              <CardContent className="p-6 text-center">
                <p className="text-red-400">Failed to load projects</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="mt-4 sci-fi-input"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : projects.length === 0 ? (
            <Card className="sci-fi-card">
              <CardContent className="p-12 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-neon-cyan" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Projects Yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Start your research journey by creating your first project
                  </p>
                </div>
                <Link href="/create-project">
                  <Button className="sci-fi-button text-white font-semibold">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="relative z-10">
                      Create Your First Project
                    </span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="sci-fi-card group hover:scale-105 transition-transform duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-white group-hover:text-neon-cyan transition-colors duration-300">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 mt-1">
                          {project.category}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`px-2 py-1 text-xs ${
                          project.daysLeft > 0
                            ? "bg-neon-green/20 text-neon-green"
                            : "bg-gray-600/20 text-gray-400"
                        }`}
                      >
                        {project.daysLeft > 0
                          ? `${project.daysLeft} days left`
                          : "Ended"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {project.abstract}
                    </p>

                    <FundingProgress
                      currentFunding={project.currentFunding}
                      fundingGoal={project.fundingGoal}
                      daysLeft={project.daysLeft}
                    />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        ${project.currentFunding.toLocaleString()} / $
                        {project.fundingGoal.toLocaleString()}
                      </span>
                      <span className="text-neon-cyan font-mono">
                        {Math.round(
                          (project.currentFunding / project.fundingGoal) * 100
                        )}
                        %
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={project.authorImage}
                            alt={project.authorName}
                          />
                          <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xs">
                            {project.authorName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-400">
                          {project.backerCount} backers
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link href={`/project/${project.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-neon-cyan hover:bg-neon-cyan/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/project/${project.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-neon-purple hover:bg-neon-purple/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

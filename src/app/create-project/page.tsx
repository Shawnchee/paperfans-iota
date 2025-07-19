"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { CreateProjectForm } from "@/components/project/create-project-form";

export default function CreateProjectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

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

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10">
        <CreateProjectForm />
      </div>
    </div>
  );
}

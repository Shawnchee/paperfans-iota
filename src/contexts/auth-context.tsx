"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import {
  supabase,
  AuthUser,
  AuthContextType,
  convertUser,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  updateUserProfile,
} from "@/lib/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(convertUser(session?.user ?? null));
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(convertUser(session?.user ?? null));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await signInWithEmail(email, password);
    return { error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await signUpWithEmail(email, password, name);
    return { error };
  };

  const signOutUser = async () => {
    await signOut();
  };

  const updateProfileUser = async (updates: Partial<AuthUser>) => {
    if (!user) return { error: new Error("No user logged in") };
    const { error } = await updateUserProfile(user.id, updates);
    if (!error) {
      setUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
    return { error };
  };

  const getAuthHeaders = () => {
    if (!session?.access_token) return null;
    return {
      Authorization: `Bearer ${session.access_token}`,
    };
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut: signOutUser,
    updateProfile: updateProfileUser,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

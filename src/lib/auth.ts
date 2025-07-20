import { createClient } from '@supabase/supabase-js'
import { User, Session } from '@supabase/supabase-js'
import { User as UserProfile } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  wallet_address?: string
}

export interface AuthContextType {
  user: AuthUser | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error: any }>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
  getAuthHeaders: () => { Authorization: string } | null
}

// Convert Supabase User to our AuthUser format
export function convertUser(user: User | null): AuthUser | null {
  if (!user) return null

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.user_metadata?.full_name,
    avatar_url: user.user_metadata?.avatar_url,
    wallet_address: user.user_metadata?.wallet_address,
  }
}

// Auth helper functions
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        full_name: name,
      }
    }
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function updateUserProfile(userId: string, updates: Partial<AuthUser>) {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  })
  return { data, error }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user: convertUser(user), error }
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
} 
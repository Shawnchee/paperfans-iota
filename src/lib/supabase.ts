import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: number
          title: string
          abstract: string
          category: string
          author_name: string
          author_affiliation: string
          author_image?: string
          image_url?: string
          funding_goal: number
          current_funding: number
          backer_count: number
          days_left: number
          technical_approach?: string
          timeline?: string
          recent_activity?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          abstract: string
          category: string
          author_name: string
          author_affiliation: string
          author_image?: string
          image_url?: string
          funding_goal: number
          current_funding?: number
          backer_count?: number
          days_left: number
          technical_approach?: string
          timeline?: string
          recent_activity?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          abstract?: string
          category?: string
          author_name?: string
          author_affiliation?: string
          author_image?: string
          image_url?: string
          funding_goal?: number
          current_funding?: number
          backer_count?: number
          days_left?: number
          technical_approach?: string
          timeline?: string
          recent_activity?: string
          created_at?: string
          updated_at?: string
        }
      }
      funding_tiers: {
        Row: {
          id: number
          project_id: number
          name: string
          description: string
          amount: number
          benefits: string[]
          backer_count: number
          max_backers?: number
          created_at: string
        }
        Insert: {
          id?: number
          project_id: number
          name: string
          description: string
          amount: number
          benefits: string[]
          backer_count?: number
          max_backers?: number
          created_at?: string
        }
        Update: {
          id?: number
          project_id?: number
          name?: string
          description?: string
          amount?: number
          benefits?: string[]
          backer_count?: number
          max_backers?: number
          created_at?: string
        }
      }
      funding_contributions: {
        Row: {
          id: number
          project_id: number
          contributor_name: string
          amount: number
          wallet_address?: string
          transaction_id?: string
          created_at: string
        }
        Insert: {
          id?: number
          project_id: number
          contributor_name: string
          amount: number
          wallet_address?: string
          transaction_id?: string
          created_at?: string
        }
        Update: {
          id?: number
          project_id?: number
          contributor_name?: string
          amount?: number
          wallet_address?: string
          transaction_id?: string
          created_at?: string
        }
      }
    }
  }
} 
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tools: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          homepage_url: string | null
          affiliate_url: string | null
          primary_tag: string | null
          tags: string[] | null
          pricing: 'free' | 'freemium' | 'paid' | null
          platform: 'web' | 'api' | 'desktop' | null
          language: string[] | null
          no_signup: boolean | null
          status: string | null
          last_updated: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          homepage_url?: string | null
          affiliate_url?: string | null
          primary_tag?: string | null
          tags?: string[] | null
          pricing?: 'free' | 'freemium' | 'paid' | null
          platform?: 'web' | 'api' | 'desktop' | null
          language?: string[] | null
          no_signup?: boolean | null
          status?: string | null
          last_updated?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          homepage_url?: string | null
          affiliate_url?: string | null
          primary_tag?: string | null
          tags?: string[] | null
          pricing?: 'free' | 'freemium' | 'paid' | null
          platform?: 'web' | 'api' | 'desktop' | null
          language?: string[] | null
          no_signup?: boolean | null
          status?: string | null
          last_updated?: string | null
          created_at?: string | null
        }
      }
      clicks: {
        Row: {
          id: number
          tool_id: string | null
          clicked_at: string | null
          referrer: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          ip: string | null
        }
        Insert: {
          id?: number
          tool_id?: string | null
          clicked_at?: string | null
          referrer?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          ip?: string | null
        }
        Update: {
          id?: number
          tool_id?: string | null
          clicked_at?: string | null
          referrer?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          ip?: string | null
        }
      }
      submissions: {
        Row: {
          id: number
          name: string
          homepage_url: string
          description: string | null
          email: string | null
          status: 'pending' | 'approved' | 'rejected' | null
          created_at: string | null
        }
        Insert: {
          id?: number
          name: string
          homepage_url: string
          description?: string | null
          email?: string | null
          status?: 'pending' | 'approved' | 'rejected' | null
          created_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          homepage_url?: string
          description?: string | null
          email?: string | null
          status?: 'pending' | 'approved' | 'rejected' | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tool = Database['public']['Tables']['tools']['Row']
export type Click = Database['public']['Tables']['clicks']['Row']
export type Submission = Database['public']['Tables']['submissions']['Row']
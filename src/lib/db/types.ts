export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clicks: {
        Row: {
          clicked_at: string | null
          id: number
          ip: string | null
          referrer: string | null
          tool_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          clicked_at?: string | null
          id?: number
          ip?: string | null
          referrer?: string | null
          tool_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          clicked_at?: string | null
          id?: number
          ip?: string | null
          referrer?: string | null
          tool_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clicks_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string | null
          description: string | null
          email: string | null
          homepage_url: string | null
          id: number
          name: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          homepage_url?: string | null
          id?: number
          name?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          homepage_url?: string | null
          id?: number
          name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          affiliate_url: string | null
          created_at: string | null
          description: string | null
          homepage_url: string | null
          id: string
          language: string[] | null
          last_updated: string | null
          name: string
          no_signup: boolean | null
          platform: string | null
          primary_tag: string | null
          pricing: string | null
          slug: string
          status: string | null
          tags: string[] | null
        }
        Insert: {
          affiliate_url?: string | null
          created_at?: string | null
          description?: string | null
          homepage_url?: string | null
          id?: string
          language?: string[] | null
          last_updated?: string | null
          name: string
          no_signup?: boolean | null
          platform?: string | null
          primary_tag?: string | null
          pricing?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
        }
        Update: {
          affiliate_url?: string | null
          created_at?: string | null
          description?: string | null
          homepage_url?: string | null
          id?: string
          language?: string[] | null
          last_updated?: string | null
          name?: string
          no_signup?: boolean | null
          platform?: string | null
          primary_tag?: string | null
          pricing?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_tools: {
        Args: {
          query: string
        }
        Returns: {
          id: string
          name: string
          description: string | null
          slug: string
          primary_tag: string | null
          tags: string[] | null
          pricing: string | null
          platform: string | null
          language: string[] | null
          no_signup: boolean | null
          last_updated: string | null
          affiliate_url: string | null
          created_at: string | null
          homepage_url: string | null
          status: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tool = Database['public']['Tables']['tools']['Row'];
export type Click = Database['public']['Tables']['clicks']['Row'];
export type Submission = Database['public']['Tables']['submissions']['Row'];

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
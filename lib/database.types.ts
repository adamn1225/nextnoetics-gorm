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
      blog_posts: {
        Row: {
          content: string
          content_html: string | null
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          scheduled_publish_date: string | null
          slug: string
          smm_calendar_id: number | null
          status: string | null
          tags: string[] | null
          template: string | null
          template_url: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          content_html?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          scheduled_publish_date?: string | null
          slug: string
          smm_calendar_id?: number | null
          status?: string | null
          tags?: string[] | null
          template?: string | null
          template_url?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          content_html?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          scheduled_publish_date?: string | null
          slug?: string
          smm_calendar_id?: number | null
          status?: string | null
          tags?: string[] | null
          template?: string | null
          template_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_smm_calendar_id_fkey"
            columns: ["smm_calendar_id"]
            isOneToOne: false
            referencedRelation: "smm_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_project_plan: {
        Row: {
          additional_services: string | null
          analytics: string | null
          branding_materials: string | null
          budget_range: string | null
          business_description: string | null
          business_name: string | null
          color_preferences: string | null
          content_management: string | null
          content_ready: string | null
          created_at: string | null
          current_website: boolean | null
          design_style: string | null
          domain_info: string | null
          ecommerce_needs: string | null
          features: string | null
          hosting_info: string | null
          id: number
          inspiration: string | null
          integrations: string | null
          maintenance_needs: string | null
          other_info: string | null
          page_count: string | null
          project_goals: string | null
          seo_assistance: string | null
          service_type: string | null
          target_audience: string | null
          timeline: string | null
          training: string | null
          user_authentication: string | null
          user_id: string | null
          website_name: string | null
        }
        Insert: {
          additional_services?: string | null
          analytics?: string | null
          branding_materials?: string | null
          budget_range?: string | null
          business_description?: string | null
          business_name?: string | null
          color_preferences?: string | null
          content_management?: string | null
          content_ready?: string | null
          created_at?: string | null
          current_website?: boolean | null
          design_style?: string | null
          domain_info?: string | null
          ecommerce_needs?: string | null
          features?: string | null
          hosting_info?: string | null
          id?: number
          inspiration?: string | null
          integrations?: string | null
          maintenance_needs?: string | null
          other_info?: string | null
          page_count?: string | null
          project_goals?: string | null
          seo_assistance?: string | null
          service_type?: string | null
          target_audience?: string | null
          timeline?: string | null
          training?: string | null
          user_authentication?: string | null
          user_id?: string | null
          website_name?: string | null
        }
        Update: {
          additional_services?: string | null
          analytics?: string | null
          branding_materials?: string | null
          budget_range?: string | null
          business_description?: string | null
          business_name?: string | null
          color_preferences?: string | null
          content_management?: string | null
          content_ready?: string | null
          created_at?: string | null
          current_website?: boolean | null
          design_style?: string | null
          domain_info?: string | null
          ecommerce_needs?: string | null
          features?: string | null
          hosting_info?: string | null
          id?: number
          inspiration?: string | null
          integrations?: string | null
          maintenance_needs?: string | null
          other_info?: string | null
          page_count?: string | null
          project_goals?: string | null
          seo_assistance?: string | null
          service_type?: string | null
          target_audience?: string | null
          timeline?: string | null
          training?: string | null
          user_authentication?: string | null
          user_id?: string | null
          website_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_project_plan_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string | null
          email: string
          id: number
          message: string | null
          name: string
          phone: string | null
          service: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          message?: string | null
          name: string
          phone?: string | null
          service?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          message?: string | null
          name?: string
          phone?: string | null
          service?: string | null
        }
        Relationships: []
      }
      default_tasks: {
        Row: {
          description: string
          id: number
          link: string
          title: string
        }
        Insert: {
          description: string
          id?: number
          link: string
          title: string
        }
        Update: {
          description?: string
          id?: number
          link?: string
          title?: string
        }
        Relationships: []
      }
      files: {
        Row: {
          category: string | null
          created_at: string | null
          file_description: string | null
          file_id: string
          file_name: string
          file_url: string
          id: string
          organization_id: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          file_description?: string | null
          file_id: string
          file_name: string
          file_url: string
          id?: string
          organization_id?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          file_description?: string | null
          file_id?: string
          file_name?: string
          file_url?: string
          id?: string
          organization_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          cms_token: string | null
          created_at: string | null
          organization_id: string
          organization_name: string | null
          role: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          cms_token?: string | null
          created_at?: string | null
          organization_id: string
          organization_name?: string | null
          role: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          cms_token?: string | null
          created_at?: string | null
          organization_id?: string
          organization_name?: string | null
          role?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ahrefs_key: string | null
          branding_content_uploaded: boolean | null
          cms_enabled: boolean | null
          company_name: string | null
          created_at: string | null
          email: string
          google_analytics_key: string | null
          id: string
          name: string
          onboarding_completed: boolean | null
          organization_id: string | null
          phone: string | null
          profile_image: string | null
          role: string | null
          semrush_key: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ahrefs_key?: string | null
          branding_content_uploaded?: boolean | null
          cms_enabled?: boolean | null
          company_name?: string | null
          created_at?: string | null
          email: string
          google_analytics_key?: string | null
          id?: string
          name: string
          onboarding_completed?: boolean | null
          organization_id?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: string | null
          semrush_key?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ahrefs_key?: string | null
          branding_content_uploaded?: boolean | null
          cms_enabled?: boolean | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          google_analytics_key?: string | null
          id?: string
          name?: string
          onboarding_completed?: boolean | null
          organization_id?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: string | null
          semrush_key?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      public_project_plan: {
        Row: {
          additional_services: string | null
          analytics: string | null
          branding_materials: string | null
          budget_range: string | null
          business_description: string | null
          business_name: string | null
          color_preferences: string | null
          content_management: string | null
          content_ready: string | null
          created_at: string | null
          design_style: string | null
          domain_info: string | null
          ecommerce_needs: string | null
          email: string
          features: string | null
          full_name: string | null
          hosting_info: string | null
          id: string
          inspiration: string | null
          integrations: string | null
          maintenance_needs: string | null
          other_info: string | null
          page_count: string | null
          phone_number: string | null
          project_goals: string | null
          seo_assistance: string | null
          service_type: string | null
          target_audience: string | null
          timeline: string | null
          training: string | null
          user_authentication: string | null
        }
        Insert: {
          additional_services?: string | null
          analytics?: string | null
          branding_materials?: string | null
          budget_range?: string | null
          business_description?: string | null
          business_name?: string | null
          color_preferences?: string | null
          content_management?: string | null
          content_ready?: string | null
          created_at?: string | null
          design_style?: string | null
          domain_info?: string | null
          ecommerce_needs?: string | null
          email: string
          features?: string | null
          full_name?: string | null
          hosting_info?: string | null
          id?: string
          inspiration?: string | null
          integrations?: string | null
          maintenance_needs?: string | null
          other_info?: string | null
          page_count?: string | null
          phone_number?: string | null
          project_goals?: string | null
          seo_assistance?: string | null
          service_type?: string | null
          target_audience?: string | null
          timeline?: string | null
          training?: string | null
          user_authentication?: string | null
        }
        Update: {
          additional_services?: string | null
          analytics?: string | null
          branding_materials?: string | null
          budget_range?: string | null
          business_description?: string | null
          business_name?: string | null
          color_preferences?: string | null
          content_management?: string | null
          content_ready?: string | null
          created_at?: string | null
          design_style?: string | null
          domain_info?: string | null
          ecommerce_needs?: string | null
          email?: string
          features?: string | null
          full_name?: string | null
          hosting_info?: string | null
          id?: string
          inspiration?: string | null
          integrations?: string | null
          maintenance_needs?: string | null
          other_info?: string | null
          page_count?: string | null
          phone_number?: string | null
          project_goals?: string | null
          seo_assistance?: string | null
          service_type?: string | null
          target_audience?: string | null
          timeline?: string | null
          training?: string | null
          user_authentication?: string | null
        }
        Relationships: []
      }
      smm_calendar: {
        Row: {
          blog_post_id: string | null
          created_date: string | null
          description: string | null
          id: number
          media_url: string | null
          organization_id: string | null
          post_automatically: boolean | null
          post_due_date: string
          sm_platform: string
          status: string | null
          tags: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          blog_post_id?: string | null
          created_date?: string | null
          description?: string | null
          id?: number
          media_url?: string | null
          organization_id?: string | null
          post_automatically?: boolean | null
          post_due_date: string
          sm_platform: string
          status?: string | null
          tags?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          blog_post_id?: string | null
          created_date?: string | null
          description?: string | null
          id?: number
          media_url?: string | null
          organization_id?: string | null
          post_automatically?: boolean | null
          post_due_date?: string
          sm_platform?: string
          status?: string | null
          tags?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_blog_post"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smm_calendar_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smm_calendar_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: number
          is_request: boolean | null
          notes: string | null
          organization_id: string | null
          status: string | null
          task_type: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          is_request?: boolean | null
          notes?: string | null
          organization_id?: string | null
          status?: string | null
          task_type?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          is_request?: boolean | null
          notes?: string | null
          organization_id?: string | null
          status?: string | null
          task_type?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tokens: {
        Row: {
          access_token: string
          expires_at: string | null
          id: string
          platform: string
          user_id: string | null
        }
        Insert: {
          access_token: string
          expires_at?: string | null
          id?: string
          platform: string
          user_id?: string | null
        }
        Update: {
          access_token?: string
          expires_at?: string | null
          id?: string
          platform?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      notify_upcoming_events: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          encrypted: boolean | null
          encryption_key_id: string | null
          expiry_date: string | null
          file_hash: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          institution_id: string | null
          issuer: string
          malware_scan_date: string | null
          malware_scan_status: string | null
          metadata: Json | null
          name: string
          privacy: string
          status: string
          type: string
          updated_at: string
          upload_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          encrypted?: boolean | null
          encryption_key_id?: string | null
          expiry_date?: string | null
          file_hash?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          institution_id?: string | null
          issuer: string
          malware_scan_date?: string | null
          malware_scan_status?: string | null
          metadata?: Json | null
          name: string
          privacy?: string
          status?: string
          type: string
          updated_at?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          encrypted?: boolean | null
          encryption_key_id?: string | null
          expiry_date?: string | null
          file_hash?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          institution_id?: string | null
          issuer?: string
          malware_scan_date?: string | null
          malware_scan_status?: string | null
          metadata?: Json | null
          name?: string
          privacy?: string
          status?: string
          type?: string
          updated_at?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          api_key_required: boolean | null
          country: string | null
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
          verification_endpoint: string | null
        }
        Insert: {
          api_key_required?: boolean | null
          country?: string | null
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
          verification_endpoint?: string | null
        }
        Update: {
          api_key_required?: boolean | null
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
          verification_endpoint?: string | null
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          badge: string | null
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          name: string
          price_per_check: number | null
          price_per_month: number | null
          sort_order: number
          updated_at: string
          verification_limit: number | null
        }
        Insert: {
          badge?: string | null
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          price_per_check?: number | null
          price_per_month?: number | null
          sort_order?: number
          updated_at?: string
          verification_limit?: number | null
        }
        Update: {
          badge?: string | null
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          price_per_check?: number | null
          price_per_month?: number | null
          sort_order?: number
          updated_at?: string
          verification_limit?: number | null
        }
        Relationships: []
      }
      references: {
        Row: {
          company: string | null
          created_at: string
          document_id: string | null
          id: string
          position: string | null
          reference_email: string | null
          reference_form_completed: boolean | null
          reference_form_sent: boolean | null
          reference_name: string
          reference_phone: string | null
          reference_response: Json | null
          reference_score: number | null
          relationship: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          document_id?: string | null
          id?: string
          position?: string | null
          reference_email?: string | null
          reference_form_completed?: boolean | null
          reference_form_sent?: boolean | null
          reference_name: string
          reference_phone?: string | null
          reference_response?: Json | null
          reference_score?: number | null
          relationship?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          document_id?: string | null
          id?: string
          position?: string | null
          reference_email?: string | null
          reference_form_completed?: boolean | null
          reference_form_sent?: boolean | null
          reference_name?: string
          reference_phone?: string | null
          reference_response?: Json | null
          reference_score?: number | null
          relationship?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "references_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "references_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          location: string | null
          resolved: boolean | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          location?: string | null
          resolved?: boolean | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          location?: string | null
          resolved?: boolean | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          action: string
          activity_type: string
          created_at: string
          details: string | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          activity_type?: string
          created_at?: string
          details?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          activity_type?: string
          created_at?: string
          details?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_qualifications: {
        Row: {
          created_at: string
          date_obtained: string | null
          id: string
          institution: string
          title: string
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          date_obtained?: string | null
          id?: string
          institution: string
          title: string
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          date_obtained?: string | null
          id?: string
          institution?: string
          title?: string
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_qualifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string
          refresh_token: string
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string
          refresh_token: string
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string
          refresh_token?: string
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          billing_cycle_end: string | null
          billing_cycle_start: string | null
          created_at: string
          id: string
          pricing_plan_id: string
          status: string
          updated_at: string
          user_id: string
          verifications_used: number
        }
        Insert: {
          billing_cycle_end?: string | null
          billing_cycle_start?: string | null
          created_at?: string
          id?: string
          pricing_plan_id: string
          status?: string
          updated_at?: string
          user_id: string
          verifications_used?: number
        }
        Update: {
          billing_cycle_end?: string | null
          billing_cycle_start?: string | null
          created_at?: string
          id?: string
          pricing_plan_id?: string
          status?: string
          updated_at?: string
          user_id?: string
          verifications_used?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_pricing_plan_id_fkey"
            columns: ["pricing_plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_locked_until: string | null
          auth_id: string
          bio: string | null
          company: string | null
          created_at: string
          documents_verified: number | null
          email: string
          failed_login_attempts: number | null
          full_name: string | null
          id: string
          job_title: string | null
          last_login_at: string | null
          last_login_ip: unknown | null
          location: string | null
          mfa_enabled: boolean | null
          mfa_secret: string | null
          phone: string | null
          total_documents: number | null
          updated_at: string
          user_type: string
          verification_score: number | null
        }
        Insert: {
          account_locked_until?: string | null
          auth_id: string
          bio?: string | null
          company?: string | null
          created_at?: string
          documents_verified?: number | null
          email: string
          failed_login_attempts?: number | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          last_login_at?: string | null
          last_login_ip?: unknown | null
          location?: string | null
          mfa_enabled?: boolean | null
          mfa_secret?: string | null
          phone?: string | null
          total_documents?: number | null
          updated_at?: string
          user_type?: string
          verification_score?: number | null
        }
        Update: {
          account_locked_until?: string | null
          auth_id?: string
          bio?: string | null
          company?: string | null
          created_at?: string
          documents_verified?: number | null
          email?: string
          failed_login_attempts?: number | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          last_login_at?: string | null
          last_login_ip?: unknown | null
          location?: string | null
          mfa_enabled?: boolean | null
          mfa_secret?: string | null
          phone?: string | null
          total_documents?: number | null
          updated_at?: string
          user_type?: string
          verification_score?: number | null
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          document_id: string
          id: string
          metadata: Json | null
          priority: number | null
          request_type: string
          requested_at: string
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          document_id: string
          id?: string
          metadata?: Json | null
          priority?: number | null
          request_type: string
          requested_at?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          document_id?: string
          id?: string
          metadata?: Json | null
          priority?: number | null
          request_type?: string
          requested_at?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_results: {
        Row: {
          ai_analysis: Json | null
          confidence_level: string | null
          created_at: string
          document_id: string
          fraud_indicators: Json | null
          id: string
          institution_response: Json | null
          manual_review_notes: string | null
          updated_at: string
          verification_request_id: string
          verification_score: number | null
          verified_at: string
          verifier_id: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          confidence_level?: string | null
          created_at?: string
          document_id: string
          fraud_indicators?: Json | null
          id?: string
          institution_response?: Json | null
          manual_review_notes?: string | null
          updated_at?: string
          verification_request_id: string
          verification_score?: number | null
          verified_at?: string
          verifier_id?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          confidence_level?: string | null
          created_at?: string
          document_id?: string
          fraud_indicators?: Json | null
          id?: string
          institution_response?: Json | null
          manual_review_notes?: string | null
          updated_at?: string
          verification_request_id?: string
          verification_score?: number | null
          verified_at?: string
          verifier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_results_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_results_verification_request_id_fkey"
            columns: ["verification_request_id"]
            isOneToOne: false
            referencedRelation: "verification_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      verifications: {
        Row: {
          admin_notes: string | null
          admin_override: boolean | null
          ai_confidence_score: number | null
          created_at: string
          document_id: string | null
          explanation: string | null
          filename: string
          id: string
          processed_text: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          admin_override?: boolean | null
          ai_confidence_score?: number | null
          created_at?: string
          document_id?: string | null
          explanation?: string | null
          filename: string
          id?: string
          processed_text?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          admin_override?: boolean | null
          ai_confidence_score?: number | null
          created_at?: string
          document_id?: string | null
          explanation?: string | null
          filename?: string
          id?: string
          processed_text?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verifications_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          p_user_id: string
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_details?: Json
        }
        Returns: string
      }
      log_security_event: {
        Args: {
          p_event_type: string
          p_user_id?: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_location?: string
          p_severity?: string
          p_details?: Json
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

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
      business_analytics: {
        Row: {
          annual_growth_rate: number | null
          business_id: string
          compliance_score: number | null
          created_at: string
          employees_count: number | null
          gnh_contributions: number | null
          id: string
          quarterly_growth_rate: number | null
          reporting_quarter: number | null
          reporting_year: number
          sustainability_score: number | null
          tax_paid: number | null
          total_expenses: number | null
          total_revenue: number | null
          updated_at: string
        }
        Insert: {
          annual_growth_rate?: number | null
          business_id: string
          compliance_score?: number | null
          created_at?: string
          employees_count?: number | null
          gnh_contributions?: number | null
          id?: string
          quarterly_growth_rate?: number | null
          reporting_quarter?: number | null
          reporting_year: number
          sustainability_score?: number | null
          tax_paid?: number | null
          total_expenses?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Update: {
          annual_growth_rate?: number | null
          business_id?: string
          compliance_score?: number | null
          created_at?: string
          employees_count?: number | null
          gnh_contributions?: number | null
          id?: string
          quarterly_growth_rate?: number | null
          reporting_quarter?: number | null
          reporting_year?: number
          sustainability_score?: number | null
          tax_paid?: number | null
          total_expenses?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_licenses: {
        Row: {
          business_id: string
          conditions: Json | null
          created_at: string
          expiry_date: string | null
          fee_paid: number
          id: string
          issue_date: string
          issuing_authority: string
          license_name: string
          license_number: string | null
          license_type: string
          renewal_date: string | null
          renewal_fee: number | null
          requirements_met: Json | null
          status: Database["public"]["Enums"]["business_status"] | null
          updated_at: string
        }
        Insert: {
          business_id: string
          conditions?: Json | null
          created_at?: string
          expiry_date?: string | null
          fee_paid?: number
          id?: string
          issue_date?: string
          issuing_authority: string
          license_name: string
          license_number?: string | null
          license_type: string
          renewal_date?: string | null
          renewal_fee?: number | null
          requirements_met?: Json | null
          status?: Database["public"]["Enums"]["business_status"] | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          conditions?: Json | null
          created_at?: string
          expiry_date?: string | null
          fee_paid?: number
          id?: string
          issue_date?: string
          issuing_authority?: string
          license_name?: string
          license_number?: string | null
          license_type?: string
          renewal_date?: string | null
          renewal_fee?: number | null
          requirements_met?: Json | null
          status?: Database["public"]["Enums"]["business_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_licenses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_registrations: {
        Row: {
          annual_compliance_fee: number | null
          annual_revenue_range: string | null
          business_address: string | null
          business_did: string
          business_email: string
          business_id: string
          business_name: string
          business_phone: string | null
          business_sector: string | null
          business_type: string
          created_at: string
          did_signature: string
          employee_count: number | null
          id: string
          last_compliance_date: string | null
          license_expiry_date: string | null
          license_fee_paid: number | null
          license_type: string | null
          metadata: Json | null
          next_compliance_due: string | null
          owner_user_id: string
          registration_date: string | null
          registration_fee_paid: number | null
          registration_number: string | null
          tax_identification_number: string | null
          total_fees_paid: number | null
          total_gnh_contributions: number | null
          updated_at: string
          verification_status:
            | Database["public"]["Enums"]["business_status"]
            | null
          wallet_address: string
        }
        Insert: {
          annual_compliance_fee?: number | null
          annual_revenue_range?: string | null
          business_address?: string | null
          business_did: string
          business_email: string
          business_id: string
          business_name: string
          business_phone?: string | null
          business_sector?: string | null
          business_type: string
          created_at?: string
          did_signature: string
          employee_count?: number | null
          id?: string
          last_compliance_date?: string | null
          license_expiry_date?: string | null
          license_fee_paid?: number | null
          license_type?: string | null
          metadata?: Json | null
          next_compliance_due?: string | null
          owner_user_id: string
          registration_date?: string | null
          registration_fee_paid?: number | null
          registration_number?: string | null
          tax_identification_number?: string | null
          total_fees_paid?: number | null
          total_gnh_contributions?: number | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["business_status"]
            | null
          wallet_address: string
        }
        Update: {
          annual_compliance_fee?: number | null
          annual_revenue_range?: string | null
          business_address?: string | null
          business_did?: string
          business_email?: string
          business_id?: string
          business_name?: string
          business_phone?: string | null
          business_sector?: string | null
          business_type?: string
          created_at?: string
          did_signature?: string
          employee_count?: number | null
          id?: string
          last_compliance_date?: string | null
          license_expiry_date?: string | null
          license_fee_paid?: number | null
          license_type?: string | null
          metadata?: Json | null
          next_compliance_due?: string | null
          owner_user_id?: string
          registration_date?: string | null
          registration_fee_paid?: number | null
          registration_number?: string | null
          tax_identification_number?: string | null
          total_fees_paid?: number | null
          total_gnh_contributions?: number | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["business_status"]
            | null
          wallet_address?: string
        }
        Relationships: []
      }
      business_transactions: {
        Row: {
          amount: number
          blockchain_tx_hash: string | null
          business_id: string
          created_at: string
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          payment_processed_at: string | null
          payment_reference: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_date: string | null
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          blockchain_tx_hash?: string | null
          business_id: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_processed_at?: string | null
          payment_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_date?: string | null
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          blockchain_tx_hash?: string | null
          business_id?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_processed_at?: string | null
          payment_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_date?: string | null
          transaction_id?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "business_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_attestations: {
        Row: {
          attestation_data: Json | null
          attestation_type: string
          blockchain_tx_hash: string | null
          created_at: string
          description: string | null
          expiry_date: string | null
          id: string
          issue_date: string
          issuer_did: string | null
          issuer_name: string
          metadata: Json | null
          status: string | null
          title: string
          user_id: string
          verification_hash: string | null
        }
        Insert: {
          attestation_data?: Json | null
          attestation_type: string
          blockchain_tx_hash?: string | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string
          issuer_did?: string | null
          issuer_name: string
          metadata?: Json | null
          status?: string | null
          title: string
          user_id: string
          verification_hash?: string | null
        }
        Update: {
          attestation_data?: Json | null
          attestation_type?: string
          blockchain_tx_hash?: string | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string
          issuer_did?: string | null
          issuer_name?: string
          metadata?: Json | null
          status?: string | null
          title?: string
          user_id?: string
          verification_hash?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_business_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_transaction_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      business_status: "pending" | "active" | "suspended" | "expired"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
      transaction_type:
        | "registration_fee"
        | "license_fee"
        | "annual_compliance"
        | "gnh_contribution"
        | "penalty"
        | "refund"
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
      business_status: ["pending", "active", "suspended", "expired"],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
      ],
      transaction_type: [
        "registration_fee",
        "license_fee",
        "annual_compliance",
        "gnh_contribution",
        "penalty",
        "refund",
      ],
    },
  },
} as const

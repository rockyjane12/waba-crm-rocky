export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          billing_address: Json | null;
          created_at: string | null;
          display_phone_number: string | null;
          email: string | null;
          id: number;
          last_order_at: string | null;
          metadata: Json | null;
          name: string | null;
          order_history: Json | null;
          phone_number: string;
          phone_number_id: string | null;
          preferred_payment_method: string | null;
          shipping_address: Json | null;
          status: string | null;
          stripe_customer_id: string | null;
          total_orders: number | null;
          total_spent: number | null;
          updated_at: string | null;
          wa_id: string;
        };
        Insert: {
          billing_address?: Json | null;
          created_at?: string | null;
          display_phone_number?: string | null;
          email?: string | null;
          id?: number;
          last_order_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          order_history?: Json | null;
          phone_number: string;
          phone_number_id?: string | null;
          preferred_payment_method?: string | null;
          shipping_address?: Json | null;
          status?: string | null;
          stripe_customer_id?: string | null;
          total_orders?: number | null;
          total_spent?: number | null;
          updated_at?: string | null;
          wa_id: string;
        };
        Update: {
          billing_address?: Json | null;
          created_at?: string | null;
          display_phone_number?: string | null;
          email?: string | null;
          id?: number;
          last_order_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          order_history?: Json | null;
          phone_number?: string;
          phone_number_id?: string | null;
          preferred_payment_method?: string | null;
          shipping_address?: Json | null;
          status?: string | null;
          stripe_customer_id?: string | null;
          total_orders?: number | null;
          total_spent?: number | null;
          updated_at?: string | null;
          wa_id?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          billing_address: Json | null;
          contact_phone: string | null;
          created_at: string | null;
          currency: string | null;
          customer_id: number | null;
          customer_wa_id: string;
          delivery_charge: number | null;
          id: number;
          items: Json | null;
          metadata: Json | null;
          order_id: string;
          order_status: string | null;
          payment_id: string | null;
          payment_method: string | null;
          payment_status: string | null;
          product_items: Json | null;
          shipping_address: Json | null;
          subtotal: number | null;
          total_amount: number | null;
          updated_at: string | null;
        };
        Insert: {
          billing_address?: Json | null;
          contact_phone?: string | null;
          created_at?: string | null;
          currency?: string | null;
          customer_id?: number | null;
          customer_wa_id: string;
          delivery_charge?: number | null;
          id?: number;
          items?: Json | null;
          metadata?: Json | null;
          order_id: string;
          order_status?: string | null;
          payment_id?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          product_items?: Json | null;
          shipping_address?: Json | null;
          subtotal?: number | null;
          total_amount?: number | null;
          updated_at?: string | null;
        };
        Update: {
          billing_address?: Json | null;
          contact_phone?: string | null;
          created_at?: string | null;
          currency?: string | null;
          customer_id?: number | null;
          customer_wa_id?: string;
          delivery_charge?: number | null;
          id?: number;
          items?: Json | null;
          metadata?: Json | null;
          order_id?: string;
          order_status?: string | null;
          payment_id?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          product_items?: Json | null;
          shipping_address?: Json | null;
          subtotal?: number | null;
          total_amount?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      waba_profiles: {
        Row: {
          business_address: Json | null;
          business_description: string | null;
          business_name: string | null;
          created_at: string | null;
          display_phone_number: string | null;
          id: string;
          metadata: Json | null;
          phone_number: string | null;
          phone_number_id: string | null;
          profile_picture_url: string | null;
          settings: Json | null;
          status: string | null;
          updated_at: string | null;
          user_id: string;
          verification_status: string | null;
          waba_id: string | null;
        };
        Insert: {
          business_address?: Json | null;
          business_description?: string | null;
          business_name?: string | null;
          created_at?: string | null;
          display_phone_number?: string | null;
          id?: string;
          metadata?: Json | null;
          phone_number?: string | null;
          phone_number_id?: string | null;
          profile_picture_url?: string | null;
          settings?: Json | null;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
          verification_status?: string | null;
          waba_id?: string | null;
        };
        Update: {
          business_address?: Json | null;
          business_description?: string | null;
          business_name?: string | null;
          created_at?: string | null;
          display_phone_number?: string | null;
          id?: string;
          metadata?: Json | null;
          phone_number?: string | null;
          phone_number_id?: string | null;
          profile_picture_url?: string | null;
          settings?: Json | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
          verification_status?: string | null;
          waba_id?: string | null;
        };
        Relationships: [];
      };
      whatsapp_customers: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          name: string | null;
          phone_number: string;
          wa_id: string;
          profile_name: string | null;
          status: string | null;
          metadata: Json | null;
          last_message_at: string | null;
          last_message: string | null;
          conversation_status: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          name?: string | null;
          phone_number: string;
          wa_id: string;
          profile_name?: string | null;
          status?: string | null;
          metadata?: Json | null;
          last_message_at?: string | null;
          last_message?: string | null;
          conversation_status?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          name?: string | null;
          phone_number?: string;
          wa_id?: string;
          profile_name?: string | null;
          status?: string | null;
          metadata?: Json | null;
          last_message_at?: string | null;
          last_message?: string | null;
          conversation_status?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

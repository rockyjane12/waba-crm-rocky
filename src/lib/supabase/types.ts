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
      };
      whatsapp_messages: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          conversation_id: string;
          sender_id: string;
          content: string;
          message_type: string;
          metadata: Json | null;
          timestamp: string;
          wa_id: string;
          status: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          conversation_id: string;
          sender_id: string;
          content: string;
          message_type: string;
          metadata?: Json | null;
          timestamp: string;
          wa_id: string;
          status: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          message_type?: string;
          metadata?: Json | null;
          timestamp?: string;
          wa_id?: string;
          status?: string;
        };
      };
      whatsapp_statuses: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          wa_id: string;
          status_type: string;
          status_data: Json | null;
          metadata: Json | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          wa_id: string;
          status_type: string;
          status_data?: Json | null;
          metadata?: Json | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          wa_id?: string;
          status_type?: string;
          status_data?: Json | null;
          metadata?: Json | null;
        };
      };
      waba_profiles: {
        Row: {
          id: string;
          user_id: string;
          business_name: string | null;
          business_description: string | null;
          phone_number: string | null;
          display_phone_number: string | null;
          waba_id: string | null;
          phone_number_id: string | null;
          status: string | null;
          verification_status: string | null;
          profile_picture_url: string | null;
          business_address: Json | null;
          settings: Json | null;
          metadata: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name?: string | null;
          business_description?: string | null;
          phone_number?: string | null;
          display_phone_number?: string | null;
          waba_id?: string | null;
          phone_number_id?: string | null;
          status?: string | null;
          verification_status?: string | null;
          profile_picture_url?: string | null;
          business_address?: Json | null;
          settings?: Json | null;
          metadata?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string | null;
          business_description?: string | null;
          phone_number?: string | null;
          display_phone_number?: string | null;
          waba_id?: string | null;
          phone_number_id?: string | null;
          status?: string | null;
          verification_status?: string | null;
          profile_picture_url?: string | null;
          business_address?: Json | null;
          settings?: Json | null;
          metadata?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
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
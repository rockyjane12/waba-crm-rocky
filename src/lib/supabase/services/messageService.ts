import { createBaseService, ServiceResponse } from "./baseService";
import { Database } from "../types";
import { supabase } from "../../../integrations/supabase/client";

// Type for WhatsApp message from the database
export type WhatsAppMessage = Database["public"]["Tables"]["whatsapp_messages"]["Row"];
export type WhatsAppMessageInsert = Database["public"]["Tables"]["whatsapp_messages"]["Insert"];
export type WhatsAppMessageUpdate = Database["public"]["Tables"]["whatsapp_messages"]["Update"];

// Create the base service for messages
const baseService = createBaseService<WhatsAppMessage>("whatsapp_messages");

/**
 * Get messages by conversation ID
 */
const getByConversationId = async (conversationId: string): Promise<ServiceResponse<WhatsAppMessage[]>> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("timestamp", { ascending: true });

    return { data: data as WhatsAppMessage[], error };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Unknown error") 
    };
  }
};

/**
 * Get messages by WhatsApp ID
 */
const getByWaId = async (waId: string): Promise<ServiceResponse<WhatsAppMessage[]>> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .eq("wa_id", waId)
      .order("timestamp", { ascending: true });

    return { data: data as WhatsAppMessage[], error };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Unknown error") 
    };
  }
};

/**
 * Update message status
 */
const updateStatus = async (id: number, status: string): Promise<ServiceResponse<WhatsAppMessage>> => {
  return baseService.update(id, { 
    status,
    updated_at: new Date().toISOString()
  });
};

/**
 * Get unread messages count by conversation ID
 */
const getUnreadCount = async (conversationId: string): Promise<ServiceResponse<number>> => {
  try {
    const { count, error } = await supabase
      .from("whatsapp_messages")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", conversationId)
      .eq("status", "delivered");

    return { data: count || 0, error };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Unknown error") 
    };
  }
};

/**
 * Get latest message by conversation ID
 */
const getLatestByConversationId = async (conversationId: string): Promise<ServiceResponse<WhatsAppMessage>> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    return { data: data as WhatsAppMessage, error };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Unknown error") 
    };
  }
};

// Export the message service with all methods
export const messageService = {
  ...baseService,
  getByConversationId,
  getByWaId,
  updateStatus,
  getUnreadCount,
  getLatestByConversationId
};
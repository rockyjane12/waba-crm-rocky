import { createBaseService, ServiceResponse } from "./baseService";
import { Database } from "../types";
import { supabase } from "../../../integrations/supabase/client";

// Type for WhatsApp status from the database
export type WhatsAppStatus = Database["public"]["Tables"]["whatsapp_statuses"]["Row"];
export type WhatsAppStatusInsert = Database["public"]["Tables"]["whatsapp_statuses"]["Insert"];
export type WhatsAppStatusUpdate = Database["public"]["Tables"]["whatsapp_statuses"]["Update"];

// Create the base service for statuses
const baseService = createBaseService<WhatsAppStatus>("whatsapp_statuses");

/**
 * Get statuses by WhatsApp ID
 */
const getByWaId = async (waId: string): Promise<ServiceResponse<WhatsAppStatus[]>> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_statuses")
      .select("*")
      .eq("wa_id", waId)
      .order("created_at", { ascending: false });

    return { data: data as WhatsAppStatus[], error };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Unknown error") 
    };
  }
};

/**
 * Get statuses by status type
 */
const getByStatusType = async (statusType: string): Promise<ServiceResponse<WhatsAppStatus[]>> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_statuses")
      .select("*")
      .eq("status_type", statusType)
      .order("created_at", { ascending: false });

    return { data: data as WhatsAppStatus[], error };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Unknown error") 
    };
  }
};

/**
 * Get latest status for a WhatsApp ID
 */
const getLatestByWaId = async (waId: string): Promise<ServiceResponse<WhatsAppStatus>> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_statuses")
      .select("*")
      .eq("wa_id", waId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return { data: data as WhatsAppStatus, error };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Unknown error") 
    };
  }
};

// Export the status service with all methods
export const statusService = {
  ...baseService,
  getByWaId,
  getByStatusType,
  getLatestByWaId
};
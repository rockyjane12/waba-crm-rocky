import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

type WhatsAppMessage = {
  id: number;
  created_at: string | null;
  updated_at: string | null;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  metadata: any | null;
  timestamp: string;
  wa_id: string;
  status: string;
};

interface UseMessagesOptions {
  conversationId?: string;
  waId?: string;
  limit?: number;
}

export const useMessages = (options: UseMessagesOptions = {}) => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const loadMessages = useCallback(async () => {
    if (!options.waId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let query = supabase.from('whatsapp_messages').select('*');
      
      // Apply filters based on options
      if (options.conversationId) {
        query = query.eq('conversation_id', options.conversationId);
      }
      
      if (options.waId) {
        query = query.eq('wa_id', options.waId);
      }
      
      // Apply limit if provided
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      // Order by timestamp, fallback to created_at
      query = query.order('timestamp', { ascending: true });
      
      const { data, error: apiError } = await query;
      
      if (apiError) throw apiError;
      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err : new Error('Failed to load messages'));
    } finally {
      setIsLoading(false);
    }
  }, [options.conversationId, options.waId, options.limit]);

  // Create a new message
  const createMessage = async (messageData: Partial<WhatsAppMessage>) => {
    try {
      // Add timestamps if not provided
      const now = new Date().toISOString();
      const data = {
        ...messageData,
        created_at: messageData.created_at || now,
        updated_at: messageData.updated_at || now,
        timestamp: messageData.timestamp || now,
      };
      
      const { data: newMessage, error: apiError } = await supabase
        .from('whatsapp_messages')
        .insert(data)
        .select()
        .single();
        
      if (apiError) throw apiError;
      
      // Optimistically update the local state
      setMessages(prev => [...prev, newMessage as WhatsAppMessage]);
      
      return newMessage;
    } catch (err) {
      console.error('Error creating message:', err);
      throw err;
    }
  };

  // Update a message
  const updateMessage = async (id: number, messageData: Partial<WhatsAppMessage>) => {
    try {
      const { data: updatedMessage, error: apiError } = await supabase
        .from('whatsapp_messages')
        .update({
          ...messageData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
        
      if (apiError) throw apiError;
      
      // Update the local state
      setMessages(prev => 
        prev.map(msg => msg.id === id ? (updatedMessage as WhatsAppMessage) : msg)
      );
      
      return updatedMessage;
    } catch (err) {
      console.error('Error updating message:', err);
      throw err;
    }
  };

  // Delete a message
  const deleteMessage = async (id: number) => {
    try {
      const { error: apiError } = await supabase
        .from('whatsapp_messages')
        .delete()
        .eq('id', id);
        
      if (apiError) throw apiError;
      
      // Update the local state
      setMessages(prev => prev.filter(msg => msg.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting message:', err);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Set up real-time subscription
  useEffect(() => {
    if (!options.waId) return;

    // Clean up previous subscription if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create new subscription
    const channel = supabase
      .channel(`whatsapp_messages_${options.waId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'whatsapp_messages',
        filter: `wa_id=eq.${options.waId}`
      }, (payload) => {
        // Handle different types of changes
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new as WhatsAppMessage]);
        } else if (payload.eventType === 'UPDATE') {
          setMessages(prev => 
            prev.map(msg => msg.id === payload.new.id ? (payload.new as WhatsAppMessage) : msg)
          );
        } else if (payload.eventType === 'DELETE') {
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [options.waId]);

  return {
    messages,
    isLoading,
    error,
    createMessage,
    updateMessage,
    deleteMessage,
    refresh: loadMessages,
  };
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageService } from "@/services/api/MessageService";
import type { Message } from "@/types";
import { useEffect } from "react";

const MESSAGES_QUERY_KEY = "messages";
const messageService = new MessageService();

interface UseMessagesOptions {
  conversationId?: string;
  waId?: string;
}

const filterMessages = (messages: Message[], conversationId?: string, waId?: string) => {
  return messages.filter((message) => {
    return (
      (!conversationId || message.conversation_id === conversationId) &&
      (!waId || message.customer_wa_id === waId)
    );
  });
};

export function useMessages(options: UseMessagesOptions = {}) {
  const queryClient = useQueryClient();
  const { conversationId, waId } = options;

  const query = useQuery({
    queryKey: [MESSAGES_QUERY_KEY, { conversationId, waId }],
    queryFn: () => {
      if (conversationId) {
        return messageService.getMessagesByConversation(conversationId);
      }
      if (waId) {
        return messageService.getMessagesByWaId(waId);
      }
      return messageService.getAllMessages();
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Message>) => messageService.createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Message> }) =>
      messageService.updateMessage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => messageService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = messageService.subscribeToMessages(
      (message: Message, eventType: "INSERT" | "UPDATE" | "DELETE") => {
        // Only update if the message matches the current filter
        const shouldUpdate =
          (!conversationId || message.conversation_id === conversationId) &&
          (!waId || message.customer_wa_id === waId);

        if (shouldUpdate) {
          queryClient.setQueryData<Message[]>(
            [MESSAGES_QUERY_KEY, { conversationId, waId }],
            (oldMessages = []) => {
              switch (eventType) {
                case "INSERT":
                  return [...oldMessages, message];
                case "UPDATE":
                  return oldMessages.map((m) =>
                    m.id === message.id ? message : m,
                  );
                case "DELETE":
                  return oldMessages.filter((m) => m.id !== message.id);
                default:
                  return oldMessages;
              }
            },
          );
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient, conversationId, waId]);

  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createMessage: createMutation.mutateAsync,
    updateMessage: updateMutation.mutateAsync,
    deleteMessage: deleteMutation.mutateAsync,
  };
}

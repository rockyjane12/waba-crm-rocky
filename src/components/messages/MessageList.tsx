import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock } from "lucide-react";

interface Message {
  id: number;
  sender_id: string;
  content: string;
  timestamp: string;
  status: string;
  from?: string;
  type?: string;
  order?: number;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageStatus = ({ status }: { status: string }) => {
  if (status === "sent") {
    return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
  }
  if (status === "delivered") {
    return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
  }
  if (status === "read") {
    return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
  }
  return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
};

const MessageList = ({ messages = [], isLoading }: MessageListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-2">Loading messages...</p>
      </div>
    );
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return (
      <div className="flex justify-center p-4">
        <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4 bg-[#f0f2f5]">
      <div className="space-y-4">
        {messages.map((message) => {
          if (!message || typeof message !== 'object' || !message.content) return null;
          
          const date = new Date(message.timestamp);
          const isValidDate = !isNaN(date.getTime());
          const senderId = message.sender_id || message.from || 'unknown';
          const messageContent = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
          
          return (
            <div
              key={message.id}
              className={cn(
                "flex",
                senderId !== "business"
                  ? "justify-start"
                  : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[65%] rounded-lg px-4 py-2 shadow-sm",
                  senderId !== "business" ? "wa-message-incoming" : "wa-message-outgoing",
                  "hover:shadow-md transition-shadow"
                )}
              >
                <p className="text-sm break-words">{messageContent}</p>
                <div className="flex items-center justify-end gap-1 mt-1.5">
                  <span className="text-[11px] text-muted-foreground">
                    {isValidDate ? format(date, "HH:mm") : "--:--"}
                  </span>
                  {senderId === "business" && (
                    <MessageStatus status={message.status} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MessageList;

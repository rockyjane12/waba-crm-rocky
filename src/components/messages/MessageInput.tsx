import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Paperclip, Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    
    try {
      setSending(true);
      await onSendMessage(newMessage);
      setNewMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-3 border-t bg-background">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 hover:bg-accent/50"
          disabled={disabled}
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 hover:bg-accent/50"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          className="flex-1 bg-background focus-visible:ring-offset-0"
          disabled={disabled}
        />
        <Button
          size="icon"
          className="shrink-0 bg-primary hover:bg-primary/90"
          onClick={handleSend}
          disabled={!newMessage.trim() || sending || disabled}
        >
          {sending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
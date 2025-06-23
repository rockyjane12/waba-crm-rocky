import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils/format/date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Phone, Video, MoreVertical } from "lucide-react";

interface Customer {
  name: string | null;
  profile_name: string | null;
  wa_id: string;
  conversation_status: string | null;
  last_message_at: string | null;
}

interface ChatHeaderProps {
  customer: Customer;
}

const ChatHeader = ({ customer }: ChatHeaderProps) => {
  return (
    <div className="p-3 border-b flex justify-between items-center bg-background">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {(customer.name || customer.profile_name || "U").charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium leading-none mb-1">
            {customer.name || customer.profile_name || customer.wa_id}
          </h3>
          <p className="text-sm text-muted-foreground">
            {customer.conversation_status === "active"
              ? "online"
              : customer.last_message_at
                ? `last seen ${formatRelativeTime(new Date(customer.last_message_at))}`
                : "offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent/50"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent/50"
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent/50"
        >
          <Video className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent/50"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Contact Info</DropdownMenuItem>
            <DropdownMenuItem>Select Messages</DropdownMenuItem>
            <DropdownMenuItem>Close Chat</DropdownMenuItem>
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Block Contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
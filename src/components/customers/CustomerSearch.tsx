import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

interface CustomerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}

export const CustomerSearch = ({
  searchTerm,
  onSearchChange,
  showSearch,
  setShowSearch,
}: CustomerSearchProps) => {
  if (showSearch) {
    return (
      <div className="p-2 border-b flex items-center gap-2 bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSearch(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="p-2 border-b flex items-center justify-between bg-background">
      <h2 className="text-lg font-semibold px-2">Chats</h2>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSearch(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
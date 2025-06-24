import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { nanoid } from "nanoid";

interface RetailerIdGeneratorProps {
  onGenerate: (id: string) => void;
  length?: number;
}

export function RetailerIdGenerator({ 
  onGenerate, 
  length = 10 
}: RetailerIdGeneratorProps) {
  const generateId = () => {
    // Generate a unique ID using nanoid
    const id = nanoid(length);
    onGenerate(id);
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={generateId}
      title="Generate unique ID"
    >
      <RefreshCw className="h-4 w-4" />
    </Button>
  );
}
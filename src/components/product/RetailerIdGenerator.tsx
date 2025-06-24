import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { nanoid } from "nanoid";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            onClick={generateId}
            className="transition-all duration-200 hover:bg-primary/10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Generate unique retailer ID</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
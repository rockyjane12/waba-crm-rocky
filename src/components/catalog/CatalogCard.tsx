import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Package } from "lucide-react";
import { Catalog } from "@/types/catalog";
import { cn } from "@/lib/utils";

interface CatalogCardProps {
  catalog: Catalog;
  isSelected: boolean;
  onClick: (catalogId: string) => void;
}

export const CatalogCard: React.FC<CatalogCardProps> = ({
  catalog,
  isSelected,
  onClick,
}) => {
  const handleClick = () => {
    onClick(catalog.id);
  };

  // Use a default image if thumbnailUrl is not available
  const imageUrl = catalog.thumbnailUrl || "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col",
        isSelected ? "ring-2 ring-primary" : ""
      )}
      onClick={handleClick}
    >
      <div className="relative h-48 w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10" />
        <img
          src={imageUrl}
          alt={catalog.name}
          className="object-cover w-full h-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
          }}
        />
        <div className="absolute top-2 right-2 z-20">
          <Badge variant={catalog.status === "active" ? "success" : catalog.status === "draft" ? "secondary" : "outline"}>
            {catalog.status}
          </Badge>
        </div>
        {catalog.isDefault && (
          <div className="absolute top-2 left-2 z-20">
            <Badge variant="primary">Default</Badge>
          </div>
        )}
      </div>
      <CardContent className="flex-1 p-4">
        <h3 className="text-lg font-semibold mb-2">{catalog.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {catalog.description || "No description available"}
        </p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Package className="h-4 w-4 mr-1" />
          <span>{catalog.productCount} products</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onClick(catalog.id);
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          {isSelected ? "Selected" : "View Products"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CatalogCard;
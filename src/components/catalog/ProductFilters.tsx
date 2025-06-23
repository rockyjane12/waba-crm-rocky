import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFilters } from "@/types/product";
import { Search, Filter, X, RefreshCw, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ProductFilterBarProps {
  filters: ProductFilters;
  onUpdateFilters: (filters: Partial<ProductFilters>) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  className?: string;
}

const AVAILABILITY_OPTIONS = [
  { value: "", label: "All Availability" },
  { value: "in stock", label: "In Stock" },
  { value: "out of stock", label: "Out of Stock" },
  { value: "preorder", label: "Preorder" },
];

const VISIBILITY_OPTIONS = [
  { value: "", label: "All Visibility" },
  { value: "published", label: "Published" },
  { value: "hidden", label: "Hidden" },
];

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  filters,
  onUpdateFilters,
  onClearFilters,
  onRefresh,
  isRefreshing,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onUpdateFilters({ search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, onUpdateFilters]);

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values as [number, number]);
  };

  const applyPriceRange = () => {
    onUpdateFilters({ 
      priceRange: { 
        min: priceRange[0], 
        max: priceRange[1] 
      } 
    });
  };

  const hasFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "" && value !== null
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => {
                setSearchTerm("");
                onUpdateFilters({ search: "" });
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            value={filters.availability || ""}
            onValueChange={(value) =>
              onUpdateFilters({ availability: value as string })
            }
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <SelectValue placeholder="Availability" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.visibility || ""}
            onValueChange={(value) =>
              onUpdateFilters({ visibility: value as string })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px]">
                <Sliders className="h-4 w-4 mr-2" />
                Price Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Min: £{priceRange[0]}</Label>
                    <Label>Max: £{priceRange[1]}</Label>
                  </div>
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={applyPriceRange}>Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </Button>
        </div>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.search}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => onUpdateFilters({ search: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.availability && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Availability:{" "}
              {
                AVAILABILITY_OPTIONS.find(
                  (option) => option.value === filters.availability
                )?.label
              }
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => onUpdateFilters({ availability: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.visibility && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Visibility:{" "}
              {
                VISIBILITY_OPTIONS.find(
                  (option) => option.value === filters.visibility
                )?.label
              }
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => onUpdateFilters({ visibility: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.priceRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: £{filters.priceRange.min} - £{filters.priceRange.max}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => onUpdateFilters({ priceRange: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={onClearFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductFilterBar;
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { useIsMobile } from "@/hooks";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  mobileLabel?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  loadingMessage?: string;
  renderMobileCard?: (item: T, index: number) => React.ReactNode;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading,
  error,
  emptyMessage = "No data found",
  loadingMessage = "Loading...",
  renderMobileCard,
  onRowClick,
}: DataTableProps<T>) {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="text-center space-y-4">
          <Loading text={loadingMessage} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 border-red-200 bg-red-50">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">⚠</span>
          </div>
          <p className="text-red-800 font-medium mb-2">Something went wrong</p>
          <p className="text-red-600 text-sm">{error.message}</p>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-8 bg-gradient-to-br from-gray-50 to-white border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📭</span>
          </div>
          <p className="text-gray-600 font-medium mb-2">No data available</p>
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      </Card>
    );
  }

  // Mobile card layout - if custom renderMobileCard function is provided
  if (isMobile && renderMobileCard) {
    return (
      <div className="space-y-4 px-1">
        {data.map((item, index) => (
          <div
            key={item.id || index}
            onClick={() => onRowClick?.(item)}
            className={cn(onRowClick && "cursor-pointer")}
          >
            {renderMobileCard(item, index)}
          </div>
        ))}
      </div>
    );
  }

  // Fallback mobile layout using columns data
  if (isMobile) {
    return (
      <div className="space-y-4 px-1">
        {data.map((item, index) => (
          <Card
            key={item.id || index}
            className="p-5 shadow-md border-0 bg-gradient-to-br from-white to-gray-50"
          >
            <div className="space-y-4">
              {columns.map((column) => {
                if (column.key === "actions") {
                  return (
                    <div
                      key={String(column.key)}
                      className="pt-4 border-t border-gray-100"
                    >
                      <div className="flex gap-2 justify-end">
                        {column.render
                          ? column.render(item, index)
                          : item[column.key as keyof T]}
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={String(column.key)}
                    className="flex justify-between items-start gap-3"
                  >
                    <span className="text-sm font-semibold text-gray-700 min-w-0 flex-shrink-0">
                      {column.mobileLabel || column.header}:
                    </span>
                    <span className="text-sm text-right min-w-0 flex-1 font-medium text-gray-900">
                      {column.render
                        ? column.render(item, index)
                        : item[column.key as keyof T]}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop table layout with enhanced styling
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    "font-semibold text-gray-700 py-4",
                    column.className,
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={item.id || index}
                className={cn(
                  "hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    className={cn("py-4", column.className)}
                  >
                    {column.render
                      ? column.render(item, index)
                      : item[column.key as keyof T]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
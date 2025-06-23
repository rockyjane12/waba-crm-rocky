import React from 'react';
import type { Customer } from '@/types/common';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface CustomerListProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string) => void;
  isLoading: boolean;
  searchTerm: string;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  isLoading,
  searchTerm,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
        {searchTerm ? (
          <>
            <p>No customers found matching "{searchTerm}"</p>
            <p className="text-sm">Try a different search term</p>
          </>
        ) : (
          <p>No conversations yet</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {customers.map((customer) => (
        <Button
          key={customer.wa_id}
          variant={selectedCustomerId === customer.wa_id ? "secondary" : "ghost"}
          className="w-full justify-start px-2 py-6 h-auto"
          onClick={() => onSelectCustomer(customer.wa_id)}
        >
          <div className="flex flex-col items-start gap-1 overflow-hidden">
            <div className="flex items-center justify-between w-full">
              <span className="font-medium truncate">
                {customer.name || customer.phone_number}
              </span>
              {customer.last_message_at && (
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(customer.last_message_at), { addSuffix: true })}
                </span>
              )}
            </div>
            {customer.last_message && (
              <span className="text-sm text-muted-foreground truncate w-full">
                {customer.last_message}
              </span>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
};
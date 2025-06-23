import React from 'react';
import { useCustomers } from '@/hooks/queries/useCustomers';
import { CustomerCard } from './CustomerCard';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterParams, SortParams } from '@/types/common';

interface CustomerListProps {
  filters?: FilterParams[];
  sort?: SortParams;
  limit?: number;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  filters,
  sort,
  limit,
}) => {
  const { customers, isLoading, error } = useCustomers({
    includeStatus: true,
    includeMessages: false,
    filters,
    sort,
    pagination: limit ? { page: 1, limit } : undefined,
  });

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50">
        Error loading customers: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No customers found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
    </div>
  );
};
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomerService } from "@/lib/supabase/services/customerService";
import type { Customer, CustomerWithRelations, FilterParams, PaginationParams, SortParams } from "@/types/common";
import { useEffect } from "react";

const CUSTOMERS_QUERY_KEY = "customers";
const customerService = new CustomerService();

export type UseCustomersOptions = {
  includeMessages?: boolean;
  includeStatus?: boolean;
  filters?: FilterParams[];
  sort?: SortParams;
  pagination?: PaginationParams;
};

export function useCustomers(options: UseCustomersOptions = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, options],
    queryFn: async () => {
      const customers = await customerService.getAllCustomers(options);
      return customers;
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = customerService.subscribeToCustomers(
      (customer: Customer, eventType: "INSERT" | "UPDATE" | "DELETE") => {
        queryClient.setQueryData<CustomerWithRelations[]>(
          [CUSTOMERS_QUERY_KEY, options],
          (oldCustomers = []) => {
            switch (eventType) {
              case "INSERT":
                return [...oldCustomers, customer as CustomerWithRelations];
              case "UPDATE":
                return oldCustomers.map((c) =>
                  c.id === customer.id ? { ...c, ...customer } : c
                );
              case "DELETE":
                return oldCustomers.filter((c) => c.id !== customer.id);
              default:
                return oldCustomers;
            }
          }
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient, options]);

  return {
    customers: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

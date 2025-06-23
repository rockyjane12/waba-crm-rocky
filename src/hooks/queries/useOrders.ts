import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/services/api/OrderService";
import type { Order } from "@/types";

const ORDERS_QUERY_KEY = "orders";
const orderService = new OrderService();

export function useOrders(options = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [ORDERS_QUERY_KEY],
    queryFn: () => orderService.getAllOrders(),
    ...options,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Order>) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Order> }) =>
      orderService.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });

  return {
    orders: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createOrder: createMutation.mutateAsync,
    updateOrder: updateMutation.mutateAsync,
    deleteOrder: deleteMutation.mutateAsync,
  };
}

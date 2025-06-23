import { Customer } from "@/types/customer";
import { Order } from "@/types/order";
import { TableFilterState } from "@/types/common";

export interface SortConfig<T> {
  field: keyof T;
  direction: "asc" | "desc";
}

export const filterCustomers = (
  customers: Customer[],
  { searchTerm, statusFilter }: TableFilterState,
): Customer[] => {
  const searchLower = searchTerm.toLowerCase();

  return customers.filter((customer) => {
    const matchesSearch =
      customer.wa_id.toLowerCase().includes(searchLower) ||
      (customer.name?.toLowerCase() || "").includes(searchLower) ||
      customer.phone_number.toLowerCase().includes(searchLower) ||
      (customer.email?.toLowerCase() || "").includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
};

export const filterOrders = (
  orders: Order[],
  { searchTerm, statusFilter }: TableFilterState,
): Order[] => {
  const searchLower = searchTerm.toLowerCase();

  return orders.filter((order) => {
    const matchesSearch =
      order.customer_wa_id.toLowerCase().includes(searchLower) ||
      order.order_id.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || order.order_status === statusFilter;

    return matchesSearch && matchesStatus;
  });
};

export const sortData = <T extends Record<string, any>>(
  data: T[],
  { field, direction }: SortConfig<T>,
): T[] => {
  return [...data].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue === null || aValue === undefined)
      return direction === "asc" ? -1 : 1;
    if (bValue === null || bValue === undefined)
      return direction === "asc" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return direction === "asc"
      ? aValue > bValue
        ? 1
        : -1
      : bValue > aValue
        ? 1
        : -1;
  });
};

export const paginateData = <T>(
  data: T[],
  page: number,
  itemsPerPage: number,
): T[] => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return data.slice(start, end);
};

export const calculateTotalPages = (
  totalItems: number,
  itemsPerPage: number,
): number => {
  return Math.ceil(totalItems / itemsPerPage);
};
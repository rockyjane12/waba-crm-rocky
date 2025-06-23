"use client";

import React, { useState, useCallback, useEffect } from "react";
import { PageContainer } from "@/components/PageContainer";
import { OrderList, OrderFilters } from "@/components/orders";
import { supabase } from "@/lib/supabase/client";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Order } from '@/types/order';
import type { PostgrestResponse } from '@supabase/supabase-js';

export default function OrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    // Copy over existing params except the ones we're updating
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (key !== 'search' && key !== 'status') {
        params.set(key, value);
      }
    });
    
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }
    
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [searchTerm, statusFilter, pathname, router, searchParams]);

  // Initialize filters from URL
  useEffect(() => {
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    
    if (search) setSearchTerm(search);
    if (status) setStatusFilter(status);
  }, [searchParams]);

  // Memoize the fetch function to ensure it's stable across renders
  const fetchOrders = useCallback(async () => {
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply server-side filters if they exist
    if (statusFilter !== "all") {
      query = query.eq("order_status", statusFilter);
    }
    
    if (searchTerm) {
      query = query.or(`customer_wa_id.ilike.%${searchTerm}%,order_id.ilike.%${searchTerm}%`);
    }

    const response = await query;
    return {
      data: response.data as Order[] | null,
      error: response.error
    };
  }, [statusFilter, searchTerm]);

  // Fetch orders from Supabase with caching
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Order[]>(fetchOrders, [statusFilter, searchTerm], {
    cacheKey: `orders_list_${statusFilter}_${searchTerm}`,
    staleTime: 30000, // 30 seconds
  });

  // Handle refresh with debouncing
  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ order_status: newStatus })
        .eq("order_id", orderId);

      if (error) {
        toast.error(`Failed to update order status: ${error.message}`);
      } else {
        toast.success(`Order ${orderId} status updated to ${newStatus}`);
        handleRefresh();
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <PageContainer
      title="Orders"
      subtitle="Manage and track customer orders"
    >
      <div className="space-y-6">
        <OrderFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <OrderList
          orders={orders || []}
          isLoading={isLoading}
          error={error}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </PageContainer>
  );
}
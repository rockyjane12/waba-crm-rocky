import { BaseService } from "./BaseService";
import type { Order } from "@/types";

interface DBOrder {
  id: number;
  created_at: string | null;
  updated_at: string | null;
  customer_id: number | null;
  customer_wa_id: string;
  status: string | null;
  total_amount: number | null;
  currency: string | null;
  billing_address: any;
  shipping_address: any;
  product_items: any[];
  metadata: any;
  contact_phone: string | null;
  delivery_charge: number | null;
}

export class OrderService extends BaseService {
  constructor() {
    super("orders");
  }

  private transformDBOrderToOrder(dbOrder: DBOrder): Order {
    return {
      id: dbOrder.id,
      created_at: dbOrder.created_at || "",
      updated_at: dbOrder.updated_at || "",
      customer_id: dbOrder.customer_id || 0,
      customer_wa_id: dbOrder.customer_wa_id,
      status: dbOrder.status || "pending",
      total_amount: dbOrder.total_amount || 0,
      currency: dbOrder.currency || "USD",
      billing_address: dbOrder.billing_address || {},
      shipping_address: dbOrder.shipping_address || {},
      product_items: dbOrder.product_items || [],
      metadata: dbOrder.metadata || {},
      contact_phone: dbOrder.contact_phone || "",
      delivery_charge: dbOrder.delivery_charge || 0,
    };
  }

  async getAllOrders(): Promise<Order[]> {
    const dbOrders = await this.getAll<DBOrder>();
    return dbOrders.map(this.transformDBOrderToOrder);
  }

  async getOrderById(id: string): Promise<Order> {
    const dbOrder = await this.getById<DBOrder>(id);
    return this.transformDBOrderToOrder(dbOrder);
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    const created = await this.create<DBOrder>(data);
    return this.transformDBOrderToOrder(created);
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    const updated = await this.update<DBOrder>(id, data);
    return this.transformDBOrderToOrder(updated);
  }

  async deleteOrder(id: string): Promise<void> {
    return this.delete(id);
  }
}

export const orderService = new OrderService();

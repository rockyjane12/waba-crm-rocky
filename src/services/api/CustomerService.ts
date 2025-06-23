import { BaseService } from "./BaseService";
import type { Customer } from "@/types/customer";

interface DBCustomer {
  id: number;
  created_at: string | null;
  updated_at: string | null;
  name: string | null;
  phone_number: string;
  wa_id: string;
  profile_name: string | null;
  status: string | null;
  metadata: any | null;
  last_message_at: string | null;
  last_message: string | null;
  conversation_status: string | null;
}

export class CustomerService extends BaseService<Customer> {
  constructor() {
    super("whatsapp_customers");
  }

  private transformDBCustomerToCustomer(dbCustomer: DBCustomer): Customer {
    return {
      id: dbCustomer.id,
      created_at: dbCustomer.created_at || "",
      updated_at: dbCustomer.updated_at || "",
      name: dbCustomer.name || dbCustomer.profile_name || "",
      phone_number: dbCustomer.phone_number,
      wa_id: dbCustomer.wa_id,
      profile_name: dbCustomer.profile_name || "",
      status: dbCustomer.status || "inactive",
      metadata: dbCustomer.metadata || {},
      last_message_at: dbCustomer.last_message_at || "",
      last_message: dbCustomer.last_message || "",
      conversation_status: dbCustomer.conversation_status || "inactive"
    };
  }

  subscribeToCustomers(
    callback: (
      customer: Customer,
      eventType: "INSERT" | "UPDATE" | "DELETE"
    ) => void
  ): () => void {
    return this.subscribeToChanges<DBCustomer>((payload) => {
      if (payload.new) {
        callback(
          this.transformDBCustomerToCustomer(payload.new),
          payload.eventType
        );
      } else if (payload.old && payload.eventType === "DELETE") {
        callback(
          this.transformDBCustomerToCustomer(payload.old),
          payload.eventType
        );
      }
    });
  }

  async getAllCustomers(): Promise<Customer[]> {
    const dbCustomers = await this.getAll<DBCustomer>();
    return dbCustomers.map(this.transformDBCustomerToCustomer);
  }

  async getCustomerById(id: string): Promise<Customer> {
    const dbCustomer = await this.getById<DBCustomer>(id);
    return this.transformDBCustomerToCustomer(dbCustomer);
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const created = await this.create<DBCustomer>(data);
    return this.transformDBCustomerToCustomer(created);
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const updated = await this.update<DBCustomer>(id, data);
    return this.transformDBCustomerToCustomer(updated);
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.delete(id);
  }
}

export const customerService = new CustomerService();

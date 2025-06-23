import { SupabaseClient, RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export class BaseService<T> {
  protected client: SupabaseClient;
  protected table: string;
  private subscriptions: Map<string, RealtimeChannel>;

  constructor(table: string) {
    this.client = supabase;
    this.table = table;
    this.subscriptions = new Map();
  }

  protected async getAll<U = T>(): Promise<U[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as U[];
  }

  protected async getById<U = T>(id: string | number): Promise<U> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as U;
  }

  protected async create<U = T>(data: Partial<U>): Promise<U> {
    const { data: created, error } = await this.client
      .from(this.table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created as U;
  }

  protected async update<U = T>(id: string | number, data: Partial<U>): Promise<U> {
    const { data: updated, error } = await this.client
      .from(this.table)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated as U;
  }

  protected async delete(id: string | number): Promise<void> {
    const { error } = await this.client
      .from(this.table)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  protected subscribeToChanges<U = T>(
    callback: (payload: {
      new: U | null;
      old: U | null;
      eventType: "INSERT" | "UPDATE" | "DELETE";
    }) => void,
  ): () => void {
    const channel = this.client
      .channel(`${this.table}_changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: this.table,
        },
        (payload) => {
          callback({
            new: payload.new as U,
            old: payload.old as U,
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
          });
        },
      )
      .subscribe();

    this.subscriptions.set(`${this.table}_changes`, channel);

    // Return unsubscribe function
    return () => {
      channel.unsubscribe();
      this.subscriptions.delete(`${this.table}_changes`);
    };
  }
}

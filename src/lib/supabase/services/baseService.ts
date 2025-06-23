import { FilterParams, PaginationParams, SortParams } from '@/types/common';
import { supabase } from '../client';
import { PostgrestError } from "@supabase/supabase-js";

export interface ServiceResponse<T> {
  data: T | null;
  error: PostgrestError | Error | null;
}

export interface QueryOptions {
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  page?: number;
  pageSize?: number;
  select?: string;
}

export interface RealtimeOptions {
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
}

export type RealtimeCallback<T> = (
  data: T,
  eventType: "INSERT" | "UPDATE" | "DELETE"
) => void;

export class BaseService {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected async getAll<T>(
    options: {
      select?: string;
      relationships?: string[];
      filters?: FilterParams[];
      sort?: SortParams;
      pagination?: PaginationParams;
    } = {}
  ) {
    const {
      select = '*',
      relationships = [],
      filters = [],
      sort,
      pagination,
    } = options;

    let query = supabase
      .from(this.tableName)
      .select(
        relationships.length > 0
          ? `${select}, ${relationships.join(', ')}`
          : select
      );

    // Apply filters
    filters.forEach((filter) => {
      const { field, value, operator = 'eq' } = filter;
      switch (operator) {
        case 'eq':
          query = query.eq(field, value);
          break;
        case 'neq':
          query = query.neq(field, value);
          break;
        case 'gt':
          query = query.gt(field, value);
          break;
        case 'gte':
          query = query.gte(field, value);
          break;
        case 'lt':
          query = query.lt(field, value);
          break;
        case 'lte':
          query = query.lte(field, value);
          break;
        case 'like':
          query = query.like(field, `%${value}%`);
          break;
        case 'ilike':
          query = query.ilike(field, `%${value}%`);
          break;
      }
    });

    // Apply sorting
    if (sort) {
      query = query.order(sort.field, {
        ascending: sort.direction === 'asc',
      });
    }

    // Apply pagination
    if (pagination) {
      const { page, limit } = pagination;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data as T[];
  }

  protected async getById<T>(
    id: string,
    options: {
      select?: string;
      relationships?: string[];
    } = {}
  ) {
    const { select = '*', relationships = [] } = options;

    const { data, error } = await supabase
      .from(this.tableName)
      .select(
        relationships.length > 0
          ? `${select}, ${relationships.join(', ')}`
          : select
      )
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as T;
  }

  protected async create<T>(record: Partial<T>) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(record)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as T;
  }

  protected async update<T>(id: string, record: Partial<T>) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(record)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as T;
  }

  protected async delete(id: string) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  protected subscribeToChanges<T>(
    callback: (record: T, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
  ) {
    const subscription = supabase
      .channel(`${this.tableName}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.tableName,
        },
        (payload) => {
          const record = payload.new as T;
          const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
          callback(record, eventType);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}
import { useCallback } from 'react';
import { useSupabaseClient } from './useSupabaseClient';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type TableName = keyof Tables;

interface DatabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

export const useDatabase = <T extends TableName>(table: T) => {
  const supabase = useSupabaseClient();

  type Row = Tables[T]['Row'];
  type Insert = Tables[T]['Insert'];
  type Update = Tables[T]['Update'];

  const getAll = useCallback(async (options?: {
    orderBy?: { column: keyof Row; ascending?: boolean };
    filters?: Partial<Record<keyof Row, any>>;
  }): Promise<DatabaseResponse<Row[]>> => {
    try {
      let query = supabase.from(table).select('*');

      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy.column as string, {
          ascending: options.orderBy.ascending ?? false,
        });
      }

      const { data, error } = await query;

      return { data: data as Row[], error };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  }, [supabase, table]);

  const getById = useCallback(async (id: string | number): Promise<DatabaseResponse<Row>> => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      return { data: data as Row, error };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  }, [supabase, table]);

  const create = useCallback(async (data: Insert): Promise<DatabaseResponse<Row>> => {
    try {
      const { data: created, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      return { data: created as Row, error };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  }, [supabase, table]);

  const update = useCallback(async (
    id: string | number,
    data: Update
  ): Promise<DatabaseResponse<Row>> => {
    try {
      const { data: updated, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      return { data: updated as Row, error };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  }, [supabase, table]);

  const remove = useCallback(async (id: string | number): Promise<{ error: PostgrestError | null }> => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      return { error: error as PostgrestError };
    }
  }, [supabase, table]);

  return {
    getAll,
    getById,
    create,
    update,
    remove,
  };
}; 
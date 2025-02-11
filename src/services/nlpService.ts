
import { supabase } from "@/integrations/supabase/client";

export type QueryResult = {
  type: 'chart' | 'text';
  data: any;
  title: string;
};

export class NLPService {
  async processQuery(query: string): Promise<QueryResult> {
    try {
      const { data, error } = await supabase.functions.invoke('process-query', {
        body: { query },
      });

      if (error) throw error;

      return data as QueryResult;
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    }
  }
}

export const createNLPService = () => new NLPService();

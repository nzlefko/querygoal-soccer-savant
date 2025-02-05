import OpenAI from 'openai';

export type QueryResult = {
  type: 'chart' | 'text';
  data: any;
  title: string;
};

export class NLPService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async processQuery(query: string): Promise<QueryResult> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a football statistics expert. Convert natural language queries into structured data responses."
          },
          {
            role: "user",
            content: query
          }
        ],
        model: "gpt-4",
      });

      // For now, return mock data until API-Football integration
      return {
        type: 'chart',
        title: query,
        data: [
          { name: 'Arsenal', value: 12 },
          { name: 'Chelsea', value: 8 },
          { name: 'Liverpool', value: 15 },
          { name: 'Man City', value: 18 },
        ]
      };
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    }
  }
}

export const createNLPService = (apiKey: string) => new NLPService(apiKey);
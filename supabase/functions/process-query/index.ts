
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.83.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const { query } = await req.json();

    // Validate OpenAI API key
    if (!Deno.env.get('OPENAI_API_KEY')) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      const completion = await openai.chat.completions.create({
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
        model: "gpt-4o-mini", // Using the smaller, more cost-effective model
        max_tokens: 150, // Limit the response size
      });

      const response = {
        type: 'chart',
        title: query,
        data: [
          { name: 'Arsenal', value: 12 },
          { name: 'Chelsea', value: 8 },
          { name: 'Liverpool', value: 15 },
          { name: 'Man City', value: 18 },
        ]
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (openAiError: any) {
      console.error('OpenAI API Error:', openAiError);
      
      // Check for rate limit or quota errors
      if (openAiError.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Service is currently busy. Please try again in a few moments.",
            type: 'text',
            title: 'Error',
            data: "The service is temporarily unavailable. Please try again later."
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      throw openAiError;
    }
  } catch (error) {
    console.error('Error in process-query function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        type: 'text',
        title: 'Error',
        data: "Sorry, we couldn't process your query at this time. Please try again later."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

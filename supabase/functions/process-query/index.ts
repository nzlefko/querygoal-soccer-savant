
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
      model: "gpt-4o-mini",
    });

    // For now, return mock data until API-Football integration
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
  } catch (error) {
    console.error('Error processing query:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

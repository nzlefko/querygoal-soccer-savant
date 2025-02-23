
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
      return new Response(
        JSON.stringify({
          type: 'text',
          title: 'Configuration Error',
          data: 'OpenAI API key is not configured'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
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
        model: "gpt-3.5-turbo", // Updated to use a valid model name
        max_tokens: 150,
      });

      // Process the completion response
      const content = completion.choices[0].message.content;
      console.log("OpenAI response:", content);

      // For now, return sample data
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
      
      // Return a regular response with error information
      return new Response(
        JSON.stringify({
          type: 'text',
          title: 'Service Unavailable',
          data: 'The service is temporarily unavailable. Please try again later.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in process-query function:', error);
    return new Response(
      JSON.stringify({
        type: 'text',
        title: 'Error',
        data: "Sorry, we couldn't process your query at this time. Please try again later."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

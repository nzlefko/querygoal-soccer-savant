import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import SearchBar from '../components/SearchBar';
import ResultCard from '../components/ResultCard';
import { createNLPService, QueryResult } from '../services/nlpService';

const Index = () => {
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      // For development, using a temporary API key. In production, this should be handled securely
      const nlpService = createNLPService('your-openai-key-here');
      const queryResult = await nlpService.processQuery(query);
      setResult(queryResult);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            Goalytics
          </h1>
          <p className="text-xl text-muted-foreground">
            Get instant insights into football statistics
          </p>
        </div>

        <SearchBar onSearch={handleSearch} />

        {isLoading && (
          <div className="mt-8 text-center text-muted-foreground">
            Processing your query...
          </div>
        )}

        {result && (
          <div className="mt-12">
            <ResultCard
              title={result.title}
              data={result.data}
              type={result.type}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
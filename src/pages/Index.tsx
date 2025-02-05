import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ResultCard from '../components/ResultCard';

const Index = () => {
  const [result, setResult] = useState<any>(null);

  const handleSearch = (query: string) => {
    // Sample data - this will be replaced with actual API calls
    const sampleData = [
      { name: 'Arsenal', value: 12 },
      { name: 'Chelsea', value: 8 },
      { name: 'Liverpool', value: 15 },
      { name: 'Man City', value: 18 },
    ];

    setResult({
      title: query,
      data: sampleData,
      type: 'chart'
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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
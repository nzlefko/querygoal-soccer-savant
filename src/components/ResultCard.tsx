import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultCardProps {
  title: string;
  data?: any;
  type: 'chart' | 'text';
}

const ResultCard = ({ title, data, type }: ResultCardProps) => {
  if (!data) return null;

  return (
    <div className="result-card">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {type === 'chart' && (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                }}
              />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {type === 'text' && (
        <p className="text-lg text-muted-foreground">{data}</p>
      )}
    </div>
  );
};

export default ResultCard;
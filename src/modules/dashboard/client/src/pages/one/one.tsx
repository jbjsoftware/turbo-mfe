import { useEffect, useState } from 'react';
import { GaugeChart } from '@/components/gauge-chart';
import { Card } from '@repo/ui/components/ui/card';
import { useLoaderData } from 'react-router';

interface OneLoaderData {
  message: string;
  timestamp: number;
}

const One = () => {
  const data = useLoaderData() as OneLoaderData;
  const [gaugeValue, setGaugeValue] = useState(50);

  useEffect(() => {
    const interval = setInterval(() => {
      setGaugeValue((prev) => {
        const change = (Math.random() - 0.5) * 20;
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Page One</h2>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800 mb-2">{data.message}</p>
        <p className="text-blue-600 text-sm">Loaded at: {new Date(data.timestamp).toLocaleTimeString()}</p>
      </div>
      <div className="mt-4">
        <p className="text-gray-600">This data was loaded by the route's loader function using React Router's Data Mode!</p>
      </div>

      <GaugeChart value={gaugeValue} label="CPU Usage" />
    </div>
  );
};

export default One;

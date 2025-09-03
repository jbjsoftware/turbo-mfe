import { useLoaderData } from 'react-router';

interface OneLoaderData {
  message: string;
  timestamp: number;
}

const One = () => {
  const data = useLoaderData() as OneLoaderData;

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
    </div>
  );
};

export default One;

import { useLoaderData, useActionData, Form } from 'react-router';

interface TwoLoaderData {
  message: string;
  timestamp: number;
}

interface TwoActionData {
  success: boolean;
}

const Two = () => {
  const data = useLoaderData() as TwoLoaderData;
  const actionData = useActionData() as TwoActionData | undefined;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Page Two</h2>

      {/* Display loader data */}
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <p className="text-green-800 mb-2">{data.message}</p>
        <p className="text-green-600 text-sm">Loaded at: {new Date(data.timestamp).toLocaleTimeString()}</p>
      </div>

      {/* Display action result */}
      {actionData && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <p className="text-yellow-800">Form submitted successfully! ✅</p>
        </div>
      )}

      {/* Form that uses the route's action */}
      <div className="bg-white p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Test Form Action</h3>
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Form
          </button>
        </Form>
      </div>

      <div className="mt-6">
        <p className="text-gray-600">This page demonstrates both loader data and form actions using React Router's Data Mode!</p>
      </div>
    </div>
  );
};

export default Two;

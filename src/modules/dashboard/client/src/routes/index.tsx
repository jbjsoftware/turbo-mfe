import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Page One</h2>
    </div>
  );
}

export default Index;

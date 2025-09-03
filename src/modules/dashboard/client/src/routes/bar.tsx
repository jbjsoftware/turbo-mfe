import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/bar')({
  component: Bar,
});

function Bar() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">
        Dashboard Page Bar
      </h2>
    </div>
  );
}

export default Bar;

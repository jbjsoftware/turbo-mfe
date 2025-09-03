import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/foo')({
  component: Foo,
});

function Foo() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Page Foo</h2>
    </div>
  );
}

export default Foo;

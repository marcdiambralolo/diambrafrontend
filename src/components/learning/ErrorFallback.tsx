'use client';

export default function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700">
      <p>Une erreur s&apos;est produite :</p>
      <pre>{error.message}</pre>
    </div>
  );
}
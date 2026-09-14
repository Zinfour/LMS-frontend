import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full flex-1">
      <Loader2 className="animate-spin size-12 mb-4" />
      <h1 className="text-sm font-bold">Loading...</h1>
    </div>
  );
}

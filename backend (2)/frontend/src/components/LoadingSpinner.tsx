import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Processing...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-12 h-12 text-forest animate-spin mb-4" />
      <p className="text-charcoal font-semibold">{message}</p>
    </div>
  );
}


import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...', fullPage = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${fullPage ? 'min-h-[60vh]' : 'py-16'}`}>
      <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;

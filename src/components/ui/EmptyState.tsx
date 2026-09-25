import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionPath?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, actionPath }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-500 max-w-md">{description}</p>}
      {actionLabel && actionPath && (
        <Link
          to={actionPath}
          className="mt-6 px-5 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;

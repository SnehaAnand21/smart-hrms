import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-card border border-transparent dark:border-forest-800">
          <UtensilsCrossed className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-forest-700 dark:text-emerald-400">
            Error 404
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">
            Table or Page Not Found
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
            The seat map or page you were looking for doesn't exist or may have been rearranged.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white font-semibold text-xs transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Smart HRMS Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

import React from 'react';

const statusConfig = {
  available: {
    label: 'Available',
    bg: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/60',
    dot: 'bg-emerald-500',
    pulse: true,
  },
  held: {
    label: 'Held',
    bg: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700/60',
    dot: 'bg-amber-500',
    pulse: false,
  },
  occupied: {
    label: 'Occupied',
    bg: 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-700/60',
    dot: 'bg-rose-500',
    pulse: false,
  },
  reserved: {
    label: 'Reserved',
    bg: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/60',
    dot: 'bg-indigo-500',
    pulse: false,
  },
};

export const TableBadge = ({ status = 'available', size = 'sm', showDot = true }) => {
  const config = statusConfig[status] || statusConfig.available;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full transition-colors ${
        isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${config.bg}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {config.pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
        </span>
      )}
      {config.label}
    </span>
  );
};

export default TableBadge;

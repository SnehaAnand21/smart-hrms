import React, { useState } from 'react';
import TableBadge from './TableBadge';
import { Users, Sparkles, Check, Clock, AlertCircle, Ban } from 'lucide-react';

export const FloorPlanMap = ({
  tables = [],
  selectedTable = null,
  onSelectTable = () => {},
  onJoinQueue = () => {},
  isAdmin = false,
  onAdminStatusChange = () => {},
  activeZone = 'all',
}) => {
  const [hoveredTable, setHoveredTable] = useState(null);

  const filteredTables =
    activeZone === 'all' ? tables : tables.filter((t) => t.floor === activeZone);

  const getTableColor = (status, isSelected) => {
    if (isSelected) {
      return 'bg-emerald-600 dark:bg-emerald-500 text-white ring-4 ring-emerald-300 dark:ring-emerald-700/60 shadow-xl border-emerald-700 dark:border-emerald-300 scale-105';
    }
    switch (status) {
      case 'available':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 border-emerald-400 dark:border-emerald-600/70 hover:border-emerald-600 dark:hover:border-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:shadow-card dark:hover:shadow-dark-glow cursor-pointer';
      case 'held':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-600/50 opacity-90 cursor-not-allowed';
      case 'occupied':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-600/50 opacity-80 cursor-not-allowed';
      case 'reserved':
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 border-indigo-300 dark:border-indigo-600/50 opacity-80 cursor-not-allowed';
      default:
        return 'bg-stone-100 dark:bg-dark-surface text-stone-800 dark:text-stone-300 border-stone-300 dark:border-dark-border';
    }
  };

  const getShapeClasses = (shape) => {
    switch (shape) {
      case 'round':
        return 'rounded-full';
      case 'rect':
        return 'rounded-2xl aspect-[1.8/1]';
      case 'square':
      default:
        return 'rounded-2xl aspect-square';
    }
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border shadow-soft dark:shadow-dark-card p-4 sm:p-6 transition-colors">
      {/* Floor Plan Header & Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-dark-border">
        <div>
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            Interactive Restaurant Floor Map
            <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
              Live Real-Time
            </span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {isAdmin
              ? 'Click any table to switch its live status or edit details.'
              : 'Select an available green table to proceed with instant reservation.'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" />
            <span className="text-stone-600 dark:text-stone-300 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600" />
            <span className="text-stone-600 dark:text-stone-300 font-medium">Held</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600" />
            <span className="text-stone-600 dark:text-stone-300 font-medium">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 border border-indigo-600" />
            <span className="text-stone-600 dark:text-stone-300 font-medium">Reserved</span>
          </div>
        </div>
      </div>

      {/* Visual Canvas Layout */}
      <div className="relative mt-6 min-h-[380px] sm:min-h-[460px] bg-[#FAF9F6] dark:bg-dark-base border-2 border-dashed border-stone-200 dark:border-dark-border rounded-2xl p-4 sm:p-6 overflow-hidden transition-colors">
        {/* Host Podium / Kitchen Wall markers */}
        <div className="w-full flex justify-between items-center pb-4 mb-4 border-b border-stone-200/80 dark:border-dark-border text-[11px] font-semibold tracking-wider uppercase text-stone-400 dark:text-stone-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-stone-300 dark:bg-stone-700" /> Kitchen & Service Pass
          </span>
          <span className="px-3 py-1 rounded bg-stone-200/60 dark:bg-dark-surface text-stone-600 dark:text-stone-300 border border-transparent dark:border-dark-border">
            Host Desk / Entrance
          </span>
          <span className="flex items-center gap-1">
            Window Bay Seating <span className="w-2 h-2 rounded bg-stone-300 dark:bg-stone-700" />
          </span>
        </div>

        {filteredTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertCircle className="w-8 h-8 text-stone-400 mb-2" />
            <p className="text-sm font-medium text-stone-600 dark:text-stone-300">No tables configured for this zone.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredTables.map((table) => {
              const isSelected = selectedTable?._id === table._id;
              const isAvailable = table.status === 'available';

              return (
                <div
                  key={table._id}
                  onMouseEnter={() => setHoveredTable(table)}
                  onMouseLeave={() => setHoveredTable(null)}
                  onClick={() => {
                    if (isAdmin) {
                      onSelectTable(table);
                    } else if (isAvailable) {
                      onSelectTable(table);
                    }
                  }}
                  className={`relative transition-all duration-200 border-2 p-4 flex flex-col items-center justify-center text-center select-none ${getTableColor(
                    table.status,
                    isSelected
                  )} ${getShapeClasses(table.position?.shape || 'square')}`}
                >
                  {/* Table Label */}
                  <span className="font-mono text-sm font-bold tracking-tight">
                    {table.tableNumber}
                  </span>

                  {/* Capacity indicator */}
                  <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
                    <Users className="w-3.5 h-3.5" />
                    <span>{table.capacity}p</span>
                  </div>

                  {/* Status chip */}
                  <div className="mt-2">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white text-emerald-900 font-bold'
                          : table.status === 'available'
                          ? 'bg-emerald-200/60 dark:bg-emerald-900/70 text-emerald-900 dark:text-emerald-200'
                          : table.status === 'held'
                          ? 'bg-amber-200/60 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200'
                          : table.status === 'occupied'
                          ? 'bg-rose-200/60 dark:bg-rose-900/70 text-rose-900 dark:text-rose-200'
                          : 'bg-indigo-200/60 dark:bg-indigo-900/70 text-indigo-900 dark:text-indigo-200'
                      }`}
                    >
                      {table.status}
                    </span>
                  </div>

                  {/* Floor zone badge */}
                  <span className="text-[9px] text-stone-400 dark:text-stone-400 mt-1 truncate max-w-[80px]">
                    {table.floor}
                  </span>

                  {/* Admin quick status toggle triggers */}
                  {isAdmin && (
                    <div className="mt-2 flex gap-1 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <button
                        title="Set Available"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdminStatusChange(table._id, 'available');
                        }}
                        className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center hover:scale-110 shadow-sm"
                      >
                        A
                      </button>
                      <button
                        title="Set Occupied"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdminStatusChange(table._id, 'occupied');
                        }}
                        className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center hover:scale-110 shadow-sm"
                      >
                        O
                      </button>
                      <button
                        title="Set Reserved"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdminStatusChange(table._id, 'reserved');
                        }}
                        className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center hover:scale-110 shadow-sm"
                      >
                        R
                      </button>
                    </div>
                  )}

                  {/* Non-available customer prompt helper */}
                  {!isAdmin && !isAvailable && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onJoinQueue(table.capacity);
                      }}
                      className="absolute inset-0 bg-stone-900/90 rounded-2xl text-white opacity-0 hover:opacity-100 flex flex-col items-center justify-center p-2 text-center transition-opacity cursor-pointer backdrop-blur-xs"
                    >
                      <span className="text-[11px] font-semibold text-emerald-400">Not Free</span>
                      <span className="text-[10px] text-stone-200 underline mt-1">
                        Join Queue for {table.capacity}p
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorPlanMap;

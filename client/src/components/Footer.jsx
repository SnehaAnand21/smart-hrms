import React from 'react';
import { UtensilsCrossed, Award, BookOpen, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-forest-950 dark:bg-dark-bg text-stone-300 border-t border-forest-900 dark:border-dark-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 dark:bg-dark-surface text-emerald-400 flex items-center justify-center border border-forest-700 dark:border-dark-border">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Smart <span className="text-emerald-400">HRMS</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              Smart Hospitality & Restaurant Management System for Real-Time Seat Availability.
              Providing genuine table-level visibility, double-booking prevention, and virtual queuing
              for diners and restaurateurs.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-forest-900 dark:bg-dark-surface text-emerald-300 border border-forest-800 dark:border-dark-border">
                MongoDB Atlas
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-forest-900 dark:bg-dark-surface text-emerald-300 border border-forest-800 dark:border-dark-border">
                Express.js
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-forest-900 dark:bg-dark-surface text-emerald-300 border border-forest-800 dark:border-dark-border">
                React + Vite
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-forest-900 dark:bg-dark-surface text-emerald-300 border border-forest-800 dark:border-dark-border">
                Node.js
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-forest-900 dark:bg-dark-surface text-emerald-300 border border-forest-800 dark:border-dark-border">
                Socket.IO
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-forest-900 dark:bg-dark-surface text-emerald-300 border border-forest-800 dark:border-dark-border">
                Tailwind CSS
              </span>
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Award className="w-4 h-4 text-gold-500" />
              Academic Review Credentials
            </div>
            <ul className="text-xs text-stone-400 space-y-2">
              <li>
                <span className="text-stone-300 font-medium">Developer:</span> Sneha.A
              </li>
              <li>
                <span className="text-stone-300 font-medium">Register No:</span> 310624205264
              </li>
              <li>
                <span className="text-stone-300 font-medium">Guide:</span> Ms Grandhi Sai Lakshmi
              </li>
              <li>
                <span className="text-stone-300 font-medium">Department:</span> Information Technology
              </li>
              <li>
                <span className="text-stone-300 font-medium">Institution:</span> Easwari Engineering College, Ramapuram, Chennai
              </li>
            </ul>
          </div>

          {/* Core System Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Key System Pillars
            </div>
            <ul className="text-xs text-stone-400 space-y-2">
              <li>• Real-Time Seat Availability Map</li>
              <li>• Atomic Double-Booking Prevention</li>
              <li>• Intelligent Virtual Queuing</li>
              <li>• Real-Time Socket.IO Synchronization</li>
              <li>• Role-Based Staff Floor Management</li>
              <li>• In-App Event Notifications</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest-900 dark:border-dark-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <p>© 2026 Smart HRMS. All rights reserved for academic demonstration.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> using the MERN Stack.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

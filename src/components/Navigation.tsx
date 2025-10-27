import React, { useState } from 'react';
import { View } from '../types';
import { Sword, Users, Shield, Map, Menu, X } from 'lucide-react';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'characters', label: 'Characters', icon: <Users size={20} /> },
    { view: 'weapons', label: 'Weapons', icon: <Sword size={20} /> },
    { view: 'artifacts', label: 'Artifacts', icon: <Shield size={20} /> },
    { view: 'map', label: 'Interactive Map', icon: <Map size={20} /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-transparent bg-clip-text">
              Genshin Impact Wiki
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onViewChange(item.view)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${currentView === item.view
                    ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
              className="p-2 rounded-md bg-slate-800 text-slate-200"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden ${mobileOpen ? 'block' : 'hidden'} px-4 pb-4`}>
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                onViewChange(item.view);
                setMobileOpen(false);
              }}
              className={`w-full text-left flex items-center space-x-3 px-4 py-2 rounded-lg font-medium transition-all duration-150 ${currentView === item.view
                  ? 'bg-amber-500 text-slate-900'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

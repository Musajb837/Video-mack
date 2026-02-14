
import React from 'react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const items = [
    { id: AppTab.HOME, icon: 'fa-house', label: 'Home' },
    { id: AppTab.EXPLORE, icon: 'fa-compass', label: 'Explore' },
    { id: AppTab.UPLOAD, icon: 'fa-plus', label: 'Create', isSpecial: true },
    { id: AppTab.LIVE, icon: 'fa-broadcast-tower', label: 'Live' },
    { id: AppTab.PROFILE, icon: 'fa-user-ninja', label: 'Profile' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-dark-light/95 backdrop-blur-xl border-t border-white/5 z-50 flex items-center justify-around px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex flex-col items-center justify-center transition-all relative ${
            item.isSpecial 
              ? 'bg-primary text-white w-14 h-14 rounded-full -mt-12 shadow-[0_8px_20px_rgba(255,55,95,0.4)] border-4 border-dark ring-2 ring-primary/20' 
              : activeTab === item.id ? 'text-primary scale-110' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <i className={`fas ${item.icon} ${item.isSpecial ? 'text-xl' : 'text-lg'}`}></i>
          {!item.isSpecial && <span className={`text-[9px] mt-1 font-black uppercase tracking-widest ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>}
          
          {activeTab === item.id && !item.isSpecial && (
            <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;

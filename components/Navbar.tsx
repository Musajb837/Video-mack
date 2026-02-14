
import React from 'react';
import { AppTab, User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onTabChange: (tab: AppTab) => void;
  activeTab: AppTab;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onOpenAuth, onTabChange, activeTab, searchQuery, onSearchChange }) => {
  const navItems = [
    { id: AppTab.HOME, label: 'Home', icon: 'fa-house' },
    { id: AppTab.EXPLORE, label: 'Explore', icon: 'fa-compass' },
    { id: AppTab.LIVE, label: 'Live', icon: 'fa-broadcast-tower' },
    { id: AppTab.LIBRARY, label: 'Library', icon: 'fa-layer-group' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-dark-light/80 backdrop-blur-xl border-b border-white/5 z-50 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div 
          className="text-2xl font-black bg-gradient-to-r from-primary via-pink-500 to-indigo-500 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
          onClick={() => onTabChange(AppTab.HOME)}
        >
          VIDEOMACK
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                activeTab === item.id ? 'text-primary scale-110' : 'text-gray-400 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="hidden md:flex items-center bg-dark/50 border border-white/5 rounded-full px-4 py-2 w-full max-w-sm mx-4 group focus-within:ring-2 ring-primary/30 transition-all">
        <i className="fas fa-search text-gray-500 mr-2 text-xs"></i>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search creators, trends..." 
          className="bg-transparent border-none outline-none text-white w-full text-xs font-medium placeholder:text-gray-600"
        />
        {searchQuery && (
          <button onClick={() => onSearchChange('')} className="text-gray-500 hover:text-white ml-2 transition-colors">
            <i className="fas fa-times-circle"></i>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <button 
            onClick={() => onTabChange(AppTab.CHAT)}
            className={`w-10 h-10 rounded-full bg-dark-lighter border border-white/5 flex items-center justify-center transition-all shadow-xl hover:text-primary ${activeTab === AppTab.CHAT ? 'text-primary' : 'text-white'}`}
          >
            <i className="fas fa-comment-dots"></i>
          </button>
        )}
        <button className="hidden sm:flex w-10 h-10 rounded-full bg-dark-lighter border border-white/5 items-center justify-center hover:text-primary transition-all shadow-xl">
          <i className="fas fa-bell"></i>
        </button>
        {user ? (
          <div 
            className="flex items-center gap-3 cursor-pointer group bg-dark-lighter/50 pl-1 pr-4 py-1 rounded-full border border-white/5 hover:border-primary/30 transition-all"
            onClick={() => onTabChange(AppTab.PROFILE)}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-xs border-2 border-transparent group-hover:border-primary transition-all overflow-hidden shadow-lg">
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.username.charAt(0).toUpperCase()}
            </div>
            <span className="hidden xl:inline text-xs font-black uppercase tracking-widest">{user.username}</span>
          </div>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="bg-primary hover:bg-primary-dark px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-primary/25 border-b-2 border-primary-dark"
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;

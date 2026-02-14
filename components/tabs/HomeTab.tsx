
import React, { useState } from 'react';
import { Video, User } from '../../types';

interface HomeTabProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
  user: User | null;
  onRefresh: () => void;
}

const TimeMachineModal: React.FC<{ isOpen: boolean; onClose: () => void; videos: Video[] }> = ({ isOpen, onClose, videos }) => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCat, setSelectedCat] = useState('Music');

  if (!isOpen) return null;

  const eras = ['2022', '2023', '2024'];
  const cats = ['Music', 'Comedy', 'Dance', 'Viral'];

  // Mock filtering for demo purposes
  const filtered = videos.filter(v => v.category === selectedCat || v.category === 'Music').slice(0, 3);

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-dark-light rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
          <div>
            <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <i className="fas fa-history text-primary"></i> Time Machine
            </h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Relive the trends that shaped the platform</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-dark-lighter flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Select Era</label>
              <div className="flex gap-2">
                {eras.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all border ${selectedYear === year ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-dark border-white/5 text-gray-500 hover:text-white'}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Category</label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {cats.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border whitespace-nowrap ${selectedCat === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-dark border-white/5 text-gray-500 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Top Trending in {selectedYear}</h3>
            <div className="grid grid-cols-1 gap-4">
              {filtered.map(v => (
                <div key={v.id} className="flex items-center gap-6 p-4 bg-dark/50 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="w-32 h-20 rounded-2xl overflow-hidden shrink-0">
                    <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm md:text-base truncate">{v.title}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{v.artist} • {v.views.toLocaleString()} views</p>
                  </div>
                  <button className="hidden md:flex px-6 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    Recreate Trend
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-dark border-t border-white/5 text-center">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center justify-center gap-2">
            <i className="fas fa-info-circle"></i> Historical data is synchronized with the Global Creative Index
          </p>
        </div>
      </div>
    </div>
  );
};

const HomeTab: React.FC<HomeTabProps> = ({ videos, onVideoClick, user }) => {
  const [isTimeMachineOpen, setIsTimeMachineOpen] = useState(false);
  const featured = videos.find(v => v.id === '1') || videos[0];
  const recentUploads = videos.slice(0, 4);

  const analytics = [
    { label: 'Earnings', value: '$4,215', trend: '+15%', icon: 'fa-wallet', gradient: 'from-purple-600/20 to-indigo-600/5', color: 'text-purple-400' },
    { label: 'Plays', value: '728K', trend: '+10%', icon: 'fa-play', gradient: 'from-pink-600/20 to-primary/5', color: 'text-primary' },
    { label: 'Followers', value: '1.3M', trend: '+12%', icon: 'fa-users', gradient: 'from-blue-600/20 to-cyan-600/5', color: 'text-blue-400' }
  ];

  const mockComments = [
    { id: 1, user: 'HyperVibe', text: 'This cyberpunk mix is absolute fire! the production quality is insane. 🔥', likes: '1.2K', time: '2h ago', avatar: 'H' },
    { id: 2, user: 'RetroWave', text: 'Visuals are stunning. Great work on the neon aesthetics.', likes: '840', time: '5h ago', avatar: 'R' }
  ];

  return (
    <div className="animate__animated animate__fadeIn space-y-10 pb-12 max-w-7xl mx-auto">
      
      {/* 1. Top Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
            Welcome back, <span className="bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {user?.fullName || 'Guest User'}
            </span>
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em] opacity-80">
            Monitor your creative empire's growth today
          </p>
        </div>
        
        {/* Time Machine Trigger Button */}
        <button 
          onClick={() => setIsTimeMachineOpen(true)}
          className="bg-dark-light border border-white/5 hover:border-primary/50 p-4 rounded-3xl flex items-center gap-4 group transition-all shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <i className="fas fa-history text-xl"></i>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase text-primary tracking-widest">Time Machine</p>
            <p className="text-[11px] font-bold text-gray-400">Explore past trends</p>
          </div>
          <i className="fas fa-chevron-right text-gray-700 ml-4 group-hover:translate-x-1 transition-transform"></i>
        </button>
      </section>

      {/* 2. Featured Video Card */}
      <section 
        className="relative w-full aspect-video md:aspect-[21/9] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
        onClick={() => onVideoClick(featured)}
      >
        <img 
          src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" 
          alt="Neon Nights" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-70" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent"></div>
        
        {/* Trending Badge */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10">
          <span className="bg-primary/20 backdrop-blur-xl text-primary text-[10px] font-black px-5 py-2 rounded-full border border-primary/40 tracking-[0.3em] uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(255,55,95,0.4)]">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span> Trending
          </span>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none drop-shadow-2xl">
              Neon Nights: Cyberpunk Beats
            </h2>
            <div className="flex items-center gap-6 text-white/60 font-bold uppercase tracking-widest text-[10px]">
              <span className="flex items-center gap-2">
                <i className="fas fa-user-circle text-primary"></i> Digital Echo
              </span>
              <span className="flex items-center gap-2">
                <i className="fas fa-eye"></i> 1,200,000 views
              </span>
            </div>
            <div className="pt-4">
              <button className="bg-white text-dark px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95 group/btn">
                WATCH NOW <i className="fas fa-play group-hover/btn:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Analytics Section (Strict Horizontal Row) */}
      <section className="grid grid-cols-3 gap-4 md:gap-8 px-2 overflow-x-auto no-scrollbar">
        {analytics.map((item, i) => (
          <div 
            key={i} 
            className={`min-w-[120px] bg-gradient-to-br ${item.gradient} p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-xl transition-all hover:scale-105 hover:border-white/10 group`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
              <div className={`w-10 h-10 md:w-12 md:h-12 bg-dark/50 rounded-2xl flex items-center justify-center ${item.color} shadow-inner`}>
                <i className={`fas ${item.icon} text-sm md:text-lg`}></i>
              </div>
              <span className="text-[9px] md:text-xs font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20 whitespace-nowrap">
                {item.trend}
              </span>
            </div>
            <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">{item.label}</p>
            <h3 className="text-lg md:text-3xl font-black tracking-tight text-white">{item.value}</h3>
          </div>
        ))}
      </section>

      {/* Main Grid: Uploads & Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-2">
        
        {/* 4. Recent Uploads Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(255,55,95,0.6)]"></div>
              Recent Uploads
            </h3>
            <button className="text-[10px] font-black uppercase text-gray-500 tracking-widest hover:text-primary transition-colors">View Library</button>
          </div>
          
          <div className="space-y-4">
            {recentUploads.map(video => (
              <div 
                key={video.id} 
                className="group flex items-center gap-4 md:gap-6 bg-dark-light/40 p-4 rounded-[2rem] border border-white/5 hover:border-primary/20 hover:bg-dark-light transition-all cursor-pointer shadow-lg"
                onClick={() => onVideoClick(video)}
              >
                <div className="relative w-28 h-18 md:w-44 md:h-28 rounded-2xl overflow-hidden shrink-0 border border-white/5 shadow-xl">
                  <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="thumb" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black text-white">{video.duration}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm md:text-xl truncate group-hover:text-primary transition-colors tracking-tight mb-1">{video.title}</h4>
                  <p className="text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">{video.artist} • {video.uploadedAt}</p>
                  <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <span><i className="fas fa-eye mr-1.5"></i> {Math.floor(video.views / 1000)}K</span>
                    <span><i className="fas fa-heart text-primary/60 mr-1.5"></i> {video.likesCount}</span>
                  </div>
                </div>
                <div className="hidden sm:block pr-2">
                  <div className="w-10 h-10 rounded-full bg-dark/40 flex items-center justify-center text-gray-600 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                    <i className="fas fa-chevron-right text-xs"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Comments Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
              Recent Comments
            </h3>
          </div>
          
          <div className="bg-dark-light/50 backdrop-blur-sm rounded-[2.5rem] border border-white/5 p-8 space-y-8 h-fit shadow-2xl">
            {mockComments.map(comment => (
              <div key={comment.id} className="group animate__animated animate__fadeIn">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-sm text-white shrink-0 shadow-lg shadow-indigo-500/20">
                    {comment.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-black text-[11px] truncate text-white uppercase tracking-wider">@{comment.user}</p>
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">{comment.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium mb-3 italic">"{comment.text}"</p>
                    <div className="flex items-center gap-5">
                      <button className="flex items-center gap-1.5 text-[9px] font-black text-gray-600 uppercase tracking-widest hover:text-primary transition-colors">
                        <i className="far fa-heart text-primary/40"></i> {comment.likes}
                      </button>
                      <button className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
                {comment.id !== mockComments[mockComments.length - 1].id && <div className="mt-8 border-b border-white/5"></div>}
              </div>
            ))}
            
            <button className="w-full py-4 mt-4 bg-dark-lighter/50 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-dark-lighter transition-all shadow-lg">
              View All Discussion
            </button>
          </div>
        </div>

      </div>

      <TimeMachineModal 
        isOpen={isTimeMachineOpen} 
        onClose={() => setIsTimeMachineOpen(false)} 
        videos={videos}
      />
    </div>
  );
};

export default HomeTab;

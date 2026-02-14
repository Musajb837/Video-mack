
import React, { useState, useMemo } from 'react';
import { User, Video } from '../../types';
import VideoCard from '../VideoCard';
import { deleteVideo } from '../../database';
import { ACHIEVEMENT_BADGES } from '../../constants';

interface ProfileTabProps {
  user: User;
  userVideos: Video[];
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
  refreshVideos: () => void;
  onBack?: () => void;
}

type ProfileSubView = 'profile' | 'edit' | 'settings' | 'dashboard';
type SettingsSubView = 'main' | 'account_info' | 'payment' | 'security' | 'verification' | 'monetization';

const ProfileTab: React.FC<ProfileTabProps> = ({ user, userVideos, onLogout, onUserUpdate, refreshVideos, onBack }) => {
  const [view, setView] = useState<ProfileSubView>('profile');
  const [settingsView, setSettingsView] = useState<SettingsSubView>('main');
  const [editForm, setEditForm] = useState({ ...user });

  const stats = useMemo(() => {
    const totalViews = userVideos.reduce((acc, v) => acc + (v.views || 0), 0);
    const watchHours = Math.round(totalViews * 0.15); 
    const engagement = userVideos.length ? "4.8%" : "0%";
    return { totalViews, watchHours, engagement };
  }, [userVideos]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUserUpdate(editForm);
    setView('profile');
  };

  const renderTickIcon = (type: 'blue' | 'gold' | 'gray' | null | undefined, size: string = 'text-xl') => {
    if (!type) return null;
    const colors = { blue: 'text-blue-500', gold: 'text-yellow-500', gray: 'text-gray-400' };
    return (
      <div className={`relative inline-flex items-center ${size}`}>
        <i className={`fas fa-certificate ${colors[type]} drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]`}></i>
        <i className="fas fa-check absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.4em] text-white"></i>
      </div>
    );
  };

  if (view === 'edit') {
    return (
      <div className="animate__animated animate__fadeIn max-w-2xl mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView('profile')} className="text-gray-500 hover:text-white"><i className="fas fa-arrow-left"></i></button>
          <h2 className="text-2xl font-black">Edit Identity</h2>
        </div>
        <form onSubmit={handleUpdateProfile} className="space-y-6 bg-dark-light p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center font-black text-2xl border-4 border-dark-lighter overflow-hidden">
                {editForm.avatar ? <img src={editForm.avatar} className="w-full h-full object-cover" /> : editForm.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <i className="fas fa-camera text-white"></i>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              value={editForm.fullName} 
              onChange={e => setEditForm({...editForm, fullName: e.target.value})}
              className="bg-dark border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-sm" 
              placeholder="Full Name" 
            />
            <input 
              value={editForm.username} 
              onChange={e => setEditForm({...editForm, username: e.target.value})}
              className="bg-dark border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-sm" 
              placeholder="Username" 
            />
          </div>
          <textarea 
            value={editForm.bio} 
            onChange={e => setEditForm({...editForm, bio: e.target.value})}
            className="w-full bg-dark border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all h-32 resize-none text-sm" 
            placeholder="Your story..."
          />
          <button type="submit" className="w-full bg-primary py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Save Changes</button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate__animated animate__fadeIn space-y-12 pb-12">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 md:h-64 rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-primary/30 relative">
          {user.coverPhoto && <img src={user.coverPhoto} className="w-full h-full object-cover opacity-60" />}
          <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
          {onBack && (
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-primary transition-all z-20"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row items-end gap-6 px-8 -mt-16 relative z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-dark-lighter border-8 border-dark flex items-center justify-center font-black text-5xl overflow-hidden shadow-2xl">
            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter">{user.fullName}</h1>
              {renderTickIcon(user.verificationType)}
            </div>
            <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">@{user.username} • {user.subscriberCount?.toLocaleString() || 0} Followers</p>
          </div>
          <div className="flex gap-3 pb-4">
            <button onClick={() => setView('edit')} className="bg-dark-light border border-white/5 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all shadow-xl">Edit</button>
            <button onClick={onLogout} className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl">Logout</button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {[
          { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: 'fa-eye' },
          { label: 'Watch Hours', value: stats.watchHours.toLocaleString(), icon: 'fa-clock' },
          { label: 'Engagement', value: stats.engagement, icon: 'fa-bolt' },
          { label: 'Wallet', value: `$${(user.walletBalance || 0).toFixed(2)}`, icon: 'fa-wallet' }
        ].map((s, i) => (
          <div key={i} className="bg-dark-light p-6 rounded-3xl border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <i className={`fas ${s.icon} text-primary text-xs`}></i>
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{s.label}</span>
            </div>
            <p className="text-2xl font-black tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      {user.badges && user.badges.length > 0 && (
        <section className="px-4">
           <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6">Achievements</h3>
           <div className="flex flex-wrap gap-4">
              {user.badges.map(badgeId => {
                const b = ACHIEVEMENT_BADGES.find(ab => ab.id === badgeId);
                if (!b) return null;
                return (
                  <div key={b.id} className="bg-dark-light/50 border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-3 group hover:border-primary/50 transition-all cursor-help" title={b.description}>
                     <i className={`fas ${b.icon} ${b.color}`}></i>
                     <span className="text-[10px] font-black uppercase tracking-widest">{b.name}</span>
                  </div>
                );
              })}
           </div>
        </section>
      )}

      {/* Your Content */}
      <section className="px-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-8">Your Broadcasts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {userVideos.length > 0 ? (
            userVideos.map(video => (
              <div key={video.id} className="relative group">
                <VideoCard video={video} onClick={() => {}} />
                <button 
                  onClick={() => { if(window.confirm('Delete video?')) { deleteVideo(video.id); refreshVideos(); } }}
                  className="absolute top-4 left-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white flex items-center justify-center"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-20 flex flex-col items-center">
              <i className="fas fa-video-slash text-5xl mb-4"></i>
              <p className="text-xs font-black uppercase tracking-widest">No broadcasts yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfileTab;


import React, { useState, useEffect } from 'react';
import { Video } from '../../types';

const BattleView: React.FC = () => {
  const [votesA, setVotesA] = useState(12400);
  const [votesB, setVotesB] = useState(11200);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [battleFinished, setBattleFinished] = useState(false);
  const [battleType, setBattleType] = useState('Dance');

  useEffect(() => {
    if (timeLeft > 0 && !battleFinished) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setBattleFinished(true);
    }
  }, [timeLeft, battleFinished]);

  const totalVotes = votesA + votesB;
  const percentA = (votesA / totalVotes) * 100;
  const percentB = (votesB / totalVotes) * 100;

  const handleVote = (side: 'A' | 'B') => {
    if (battleFinished) return;
    if (side === 'A') setVotesA(v => v + 50);
    else setVotesB(v => v + 50);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate__animated animate__fadeIn">
      {/* Battle Header */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20">Live Battle</span>
          <h4 className="text-xl font-black italic">{battleType} Arena</h4>
        </div>
        <div className="bg-dark-light px-6 py-2 rounded-2xl border border-white/10 font-black text-primary animate-pulse">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Split Screen Battle */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 relative aspect-[16/10] md:aspect-video rounded-[3rem] overflow-hidden border-4 border-dark-lighter shadow-2xl">
        {/* Creator A */}
        <div className="relative bg-dark-light group" onClick={() => handleVote('A')}>
          <img src="https://picsum.photos/seed/battleA/800/1200" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Creator A" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Creator A</p>
            <h5 className="text-lg font-black truncate">@SlayerX</h5>
          </div>
          {battleFinished && percentA > percentB && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm animate__animated animate__zoomIn">
              <div className="text-center">
                <i className="fas fa-crown text-5xl text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,1)]"></i>
                <h3 className="text-4xl font-black uppercase italic tracking-tighter">Winner</h3>
              </div>
            </div>
          )}
        </div>

        {/* Creator B */}
        <div className="relative bg-dark-light group" onClick={() => handleVote('B')}>
          <img src="https://picsum.photos/seed/battleB/800/1200" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Creator B" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 right-6 text-right">
            <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Creator B</p>
            <h5 className="text-lg font-black truncate">@VibeQueen</h5>
          </div>
          {battleFinished && percentB > percentA && (
            <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/20 backdrop-blur-sm animate__animated animate__zoomIn">
              <div className="text-center">
                <i className="fas fa-crown text-5xl text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,1)]"></i>
                <h3 className="text-4xl font-black uppercase italic tracking-tighter">Winner</h3>
              </div>
            </div>
          )}
        </div>

        {/* VS Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-dark rounded-full flex items-center justify-center border-4 border-dark-lighter shadow-2xl">
            <span className="text-2xl md:text-3xl font-black italic text-primary">VS</span>
          </div>
        </div>
      </div>

      {/* Vote Progress Bar */}
      <div className="px-4 space-y-4">
        <div className="flex justify-between items-end mb-2">
          <div className="text-left">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{votesA.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{votesB.toLocaleString()}</p>
          </div>
        </div>
        <div className="w-full h-6 bg-dark-lighter rounded-full overflow-hidden flex border border-white/5 shadow-inner">
          <div className="h-full bg-gradient-to-r from-primary to-pink-500 transition-all duration-300 shadow-[0_0_15px_rgba(255,55,95,0.5)]" style={{ width: `${percentA}%` }}></div>
          <div className="h-full bg-gradient-to-l from-indigo-600 to-blue-400 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${percentB}%` }}></div>
        </div>
      </div>

      {/* Interactions */}
      <div className="grid grid-cols-2 gap-4 px-4">
        <button onClick={() => handleVote('A')} className="bg-primary/10 border border-primary/30 hover:bg-primary transition-all py-4 rounded-2xl flex flex-col items-center gap-1 group">
          <i className="fas fa-hand-pointer group-hover:scale-110 transition-transform"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Support A</span>
        </button>
        <button onClick={() => handleVote('B')} className="bg-indigo-600/10 border border-indigo-600/30 hover:bg-indigo-600 transition-all py-4 rounded-2xl flex flex-col items-center gap-1 group">
          <i className="fas fa-gift group-hover:scale-110 transition-transform"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Send Gift B</span>
        </button>
      </div>

      {/* Battle Types & Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <div className="space-y-4">
          <h5 className="text-sm font-black uppercase tracking-widest text-gray-500">Battle Types</h5>
          <div className="flex flex-wrap gap-2">
            {['Dance', 'Rap', 'Comedy', 'Freestyle'].map(type => (
              <button
                key={type}
                onClick={() => setBattleType(type)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${battleType === type ? 'bg-white text-dark shadow-lg' : 'bg-dark-light border border-white/5 text-gray-500 hover:text-white'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="text-sm font-black uppercase tracking-widest text-gray-500">Arena Leaderboard</h5>
          <div className="bg-dark-light rounded-[2rem] border border-white/5 p-6 space-y-4">
            {[
              { name: 'SlayerX', wins: 154, rank: 1, avatar: 'S' },
              { name: 'VibeQueen', wins: 142, rank: 2, avatar: 'V' },
              { name: 'DriftKing', wins: 98, rank: 3, avatar: 'D' }
            ].map((hero, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-dark flex items-center justify-center font-black text-[10px] border border-white/5 group-hover:border-primary transition-all">
                    {hero.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-black truncate">@{hero.name}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{hero.wins} Wins</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/5 text-gray-600'}`}>
                  #{hero.rank}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LiveTab: React.FC<{ onVideoClick: (v: Video) => void; onBack?: () => void }> = ({ onVideoClick, onBack }) => {
  const [isGoingLive, setIsGoingLive] = useState(false);
  const [activeLiveTab, setActiveLiveTab] = useState<'broadcasts' | 'battles'>('broadcasts');

  const mockLiveVideos: Video[] = [
    {
      id: 'live-1',
      title: '🔴 24/7 Lo-Fi Chill Beats for Study',
      artist: 'Lofi Girl',
      userId: 'system',
      views: 15400,
      duration: 'LIVE',
      thumbnail: 'https://picsum.photos/seed/live1/400/225',
      category: 'Music',
      liked: false,
      uploadedAt: 'Started 2 hours ago',
      isLive: true,
      likesCount: 1240,
      repostsCount: 88,
      sharesCount: 156
    },
    {
      id: 'live-2',
      title: '🔴 Final Boss Fight: No Damage Run',
      artist: 'SlayerX',
      userId: 'system',
      views: 8200,
      duration: 'LIVE',
      thumbnail: 'https://picsum.photos/seed/live2/400/225',
      category: 'Gaming',
      liked: false,
      uploadedAt: 'Started 45 mins ago',
      isLive: true,
      likesCount: 890,
      repostsCount: 34,
      sharesCount: 72
    }
  ];

  if (isGoingLive) {
    return (
      <div className="animate__animated animate__fadeIn flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary text-4xl mb-6 animate-pulse">
          <i className="fas fa-video"></i>
        </div>
        <h2 className="text-3xl font-black mb-4">Going Live...</h2>
        <p className="text-gray-400 max-w-sm mb-8">Connecting to the high-fidelity streaming servers. Please ensure your camera and microphone permissions are enabled.</p>
        <button 
          onClick={() => setIsGoingLive(false)}
          className="bg-dark-lighter px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all"
        >
          Cancel Broadcast
        </button>
      </div>
    );
  }

  return (
    <div className="animate__animated animate__fadeIn space-y-10">
      {/* Header with Sub-tabs */}
      <div className="bg-dark-light p-6 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <button 
                onClick={onBack}
                className="w-10 h-10 bg-dark-lighter rounded-full flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-white/5"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
            )}
            <div>
              <h2 className="text-3xl font-black tracking-tighter">Live Arena</h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Connect and compete in real-time</p>
            </div>
          </div>
          <button 
            onClick={() => setIsGoingLive(true)}
            className="bg-primary hover:bg-primary-dark px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all flex items-center gap-2"
          >
            <i className="fas fa-plus"></i> START BROADCAST
          </button>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center gap-6 border-t border-white/5 pt-6">
          <button 
            onClick={() => setActiveLiveTab('broadcasts')}
            className={`text-[10px] font-black uppercase tracking-widest transition-all relative pb-2 ${activeLiveTab === 'broadcasts' ? 'text-primary' : 'text-gray-500 hover:text-white'}`}
          >
            Live Streams
            {activeLiveTab === 'broadcasts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveLiveTab('battles')}
            className={`text-[10px] font-black uppercase tracking-widest transition-all relative pb-2 ${activeLiveTab === 'battles' ? 'text-primary' : 'text-gray-500 hover:text-white'}`}
          >
            Creator Battles
            {activeLiveTab === 'battles' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>}
          </button>
        </div>
      </div>

      {activeLiveTab === 'broadcasts' ? (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockLiveVideos.map(video => (
              <div 
                key={video.id} 
                className="group cursor-pointer space-y-3"
                onClick={() => onVideoClick(video)}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={video.title} />
                  <div className="absolute top-3 left-3 bg-red-600 px-2 py-0.5 rounded text-[10px] font-black tracking-widest flex items-center gap-1.5 shadow-lg text-white">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md text-[10px] font-bold text-white">
                    {video.views.toLocaleString()} watching
                  </div>
                </div>
                <div className="flex gap-4 px-2">
                  <div className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center font-bold text-xs uppercase overflow-hidden border border-white/5 shadow-inner">
                    {video.artist.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors tracking-tight">{video.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-black tracking-widest">{video.artist}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <BattleView />
      )}
    </div>
  );
};

export default LiveTab;

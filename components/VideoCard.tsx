
import React from 'react';
import { Video } from '../types';
import { toggleLike, incrementRepost, incrementShare } from '../database';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  onUpdate?: () => void;
  user?: any;
}

const formatCount = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num;
};

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, onUpdate, user }) => {
  const handleAction = (e: React.MouseEvent, type: 'like' | 'repost' | 'share') => {
    e.stopPropagation();
    if (!user) {
      alert("Please log in to interact with videos.");
      return;
    }
    
    if (type === 'like') {
      toggleLike(user.id, video.id);
    } else if (type === 'repost') {
      incrementRepost(video.id);
    } else if (type === 'share') {
      incrementShare(video.id);
      if (navigator.share) {
        navigator.share({
          title: video.title,
          text: `Check out ${video.title} on VIDEOMACK!`,
          url: window.location.href,
        }).catch(() => {});
      }
    }
    if (onUpdate) onUpdate();
  };

  return (
    <div 
      className="group cursor-pointer flex flex-col gap-3 transition-all duration-300 hover:-translate-y-2"
      onClick={onClick}
    >
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-dark-lighter shadow-xl">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-white/5">
          {video.duration}
        </div>

        {/* Dynamic Action Bar Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center justify-around translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              onClick={(e) => handleAction(e, 'like')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${video.liked ? 'text-primary' : 'text-white hover:bg-white/10'}`}
            >
              <i className={`${video.liked ? 'fas' : 'far'} fa-heart text-xs`}></i>
              <span className="text-[10px] font-black">{formatCount(video.likesCount)}</span>
            </button>
            <div className="w-px h-3 bg-white/10"></div>
            <button 
              onClick={(e) => handleAction(e, 'repost')}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-white hover:bg-white/10 transition-all"
            >
              <i className="fas fa-retweet text-xs"></i>
              <span className="text-[10px] font-black">{formatCount(video.repostsCount)}</span>
            </button>
            <div className="w-px h-3 bg-white/10"></div>
            <button 
              onClick={(e) => handleAction(e, 'share')}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-white hover:bg-white/10 transition-all"
            >
              <i className="far fa-paper-plane text-xs"></i>
              <span className="text-[10px] font-black">{formatCount(video.sharesCount)}</span>
            </button>
          </div>
        </div>

        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
             <i className="fas fa-play text-white text-xl ml-1"></i>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 px-2">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-indigo-600 shrink-0 flex items-center justify-center font-black text-xs border-2 border-dark shadow-xl text-white">
          {video.artist.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="font-black text-[13px] line-clamp-2 leading-tight group-hover:text-primary transition-colors tracking-tight">
            {video.title}
          </h4>
          <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-widest">{video.artist} • {formatCount(video.views)} views</p>
          <p className="text-[9px] text-gray-600 mt-0.5 font-medium">{video.uploadedAt}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

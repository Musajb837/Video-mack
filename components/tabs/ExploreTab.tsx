
import React, { useState } from 'react';
import { CATEGORIES } from '../../constants';
import { Video } from '../../types';
import VideoCard from '../VideoCard';

interface ExploreTabProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
  onBack?: () => void;
}

const ExploreTab: React.FC<ExploreTabProps> = ({ videos, onVideoClick, onBack }) => {
  const [activeCat, setActiveCat] = useState('All');

  const filteredVideos = activeCat === 'All' 
    ? videos 
    : videos.filter(v => v.category === activeCat);

  return (
    <div className="animate__animated animate__fadeIn space-y-8">
      {/* Category Scroll with Back Button */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 sticky top-16 bg-dark/95 backdrop-blur-sm z-40 py-4 -mx-4 px-4 md:-mx-8 md:px-8">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 shrink-0 bg-dark-lighter rounded-full flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-xl"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        )}
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
              activeCat === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-dark-lighter text-gray-400 hover:bg-dark-lighter/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.length > 0 ? (
          filteredVideos.map(video => (
            <VideoCard key={`explore-${video.id}`} video={video} onClick={() => onVideoClick(video)} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500">
            <i className="fas fa-ghost text-4xl mb-4 opacity-20"></i>
            <p>No videos found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreTab;


import React, { useState, useEffect } from 'react';
import { Video, User } from '../../types';
import VideoCard from '../VideoCard';
import { getWatchLaterVideos } from '../../database';

interface LibraryTabProps {
  videos: Video[];
  user: User;
  onVideoClick: (video: Video) => void;
  onBack?: () => void;
}

const LibraryTab: React.FC<LibraryTabProps> = ({ videos, user, onVideoClick, onBack }) => {
  const [watchLater, setWatchLater] = useState<Video[]>([]);
  const [activeLibraryTab, setActiveLibraryTab] = useState<'uploads' | 'watch_later'>('uploads');

  useEffect(() => {
    if (user) {
      setWatchLater(getWatchLaterVideos(user.id));
    }
  }, [user]);

  const refreshWatchLater = () => {
    if (user) {
      setWatchLater(getWatchLaterVideos(user.id));
    }
  };

  return (
    <div className="animate__animated animate__fadeIn space-y-12 pb-12">
      {/* Library Tabs with Back Button */}
      <div className="flex items-center gap-8 border-b border-dark-lighter mb-8">
        {onBack && (
          <button 
            onClick={onBack}
            className="pb-4 text-gray-500 hover:text-primary transition-all scale-125"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        )}
        <button 
          onClick={() => setActiveLibraryTab('uploads')}
          className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeLibraryTab === 'uploads' ? 'text-primary' : 'text-gray-500 hover:text-white'}`}
        >
          Your Uploads
          {activeLibraryTab === 'uploads' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveLibraryTab('watch_later')}
          className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeLibraryTab === 'watch_later' ? 'text-primary' : 'text-gray-500 hover:text-white'}`}
        >
          Watch Later
          {activeLibraryTab === 'watch_later' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>}
        </button>
      </div>

      {activeLibraryTab === 'uploads' ? (
        <section className="animate__animated animate__fadeIn">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary text-xl">
                <i className="fas fa-cloud-upload-alt"></i>
             </div>
             <div>
                <h3 className="text-xl font-bold">Content created by you</h3>
                <p className="text-xs text-gray-500">{videos.length} videos published</p>
             </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.length > 0 ? (
              videos.map(video => (
                <VideoCard key={`library-upload-${video.id}`} video={video} onClick={() => onVideoClick(video)} />
              ))
            ) : (
              <div className="col-span-full py-20 border-2 border-dashed border-dark-lighter rounded-[2.5rem] text-center text-gray-500 flex flex-col items-center">
                <i className="fas fa-film text-4xl mb-4 opacity-20"></i>
                <p className="font-bold">No videos uploaded yet.</p>
                <p className="text-[10px] mt-1 uppercase tracking-widest">Share your first masterpiece with the world</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="animate__animated animate__fadeIn">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 text-xl">
                <i className="fas fa-clock"></i>
             </div>
             <div>
                <h3 className="text-xl font-bold">Watch Later</h3>
                <p className="text-xs text-gray-500">Videos you've saved to watch at another time</p>
             </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchLater.length > 0 ? (
              watchLater.map(video => (
                <VideoCard key={`library-later-${video.id}`} video={video} onClick={() => onVideoClick(video)} />
              ))
            ) : (
              <div className="col-span-full py-20 border-2 border-dashed border-dark-lighter rounded-[2.5rem] text-center text-gray-500 flex flex-col items-center">
                <i className="fas fa-history text-4xl mb-4 opacity-20"></i>
                <p className="font-bold">Your list is empty</p>
                <p className="text-[10px] mt-1 uppercase tracking-widest">Add videos using the 'Later' button in the player</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="bg-dark-light rounded-[2rem] p-8 border border-dark-lighter">
         <h3 className="text-lg font-bold mb-6">Playlists</h3>
         <div className="flex flex-col gap-2">
            {[
              { title: 'Liked Videos', count: videos.filter(v => v.liked).length, private: true, icon: 'fa-thumbs-up' },
              { title: 'Favorites', count: 0, private: true, icon: 'fa-heart' }
            ].map((pl, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-dark-lighter rounded-2xl transition-colors cursor-pointer group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-dark-lighter rounded-lg flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all">
                       <i className={`fas ${pl.icon}`}></i>
                    </div>
                    <div>
                       <h4 className="font-bold text-sm">{pl.title}</h4>
                       <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{pl.count} Videos {pl.private && '• Private'}</p>
                    </div>
                 </div>
                 <i className="fas fa-chevron-right text-gray-700"></i>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default LibraryTab;

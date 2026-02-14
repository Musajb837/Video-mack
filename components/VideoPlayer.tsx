
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Video, User, Comment } from '../types';
import { toggleLike, addComment, getComments, toggleSubscription, isSubscribed, incrementRepost, incrementShare } from '../database';

interface VideoPlayerProps {
  video: Video;
  allVideos: Video[];
  onClose: () => void;
  onRelatedVideoClick: (video: Video) => void;
  user: User | null;
  onRefresh: () => void;
  addToast?: (message: string, type?: 'success' | 'error') => void;
}

const formatCount = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num;
};

const VideoFeedItem: React.FC<{
  video: Video;
  user: User | null;
  isActive: boolean;
  onRefresh: () => void;
  addToast?: (message: string, type?: 'success' | 'error') => void;
}> = ({ video, user, isActive, onRefresh, addToast }) => {
  const [isLiked, setIsLiked] = useState(video.liked);
  const [subscribed, setSubscribed] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setIsPlaying(isActive);
    if (isActive) {
      setComments(getComments(video.id));
      if (user && video.userId) {
        setSubscribed(isSubscribed(user.id, video.userId));
      }
    }
  }, [isActive, video.id, user, video.userId]);

  const checkAuth = () => {
    if (!user) {
      if (addToast) addToast("Please log in to perform this action", "error");
      return false;
    }
    return true;
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!checkAuth()) return;
    toggleLike(user!.id, video.id);
    setIsLiked(!isLiked);
    onRefresh();
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!checkAuth()) return;
    incrementRepost(video.id);
    setIsReposted(!isReposted);
    onRefresh();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementShare(video.id);
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href,
      }).catch(() => {});
    }
    onRefresh();
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!checkAuth()) return;
    if (!video.userId) return;
    toggleSubscription(user!.id, video.userId);
    setSubscribed(!subscribed);
    onRefresh();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkAuth() || !commentText.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      videoId: video.id,
      userId: user!.id,
      username: user!.username,
      content: commentText,
      createdAt: new Date().toISOString()
    };
    addComment(newComment);
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  return (
    <div className="relative w-full h-full snap-start bg-black flex flex-col justify-center overflow-hidden">
      {/* Background Cinematic Blur */}
      <img src={video.thumbnail} className="absolute inset-0 w-full h-full object-cover blur-[80px] opacity-30 scale-125" alt="blur" />
      
      {/* Video Content Area */}
      <div 
        className="relative z-10 w-full h-full flex items-center justify-center cursor-pointer"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <img src={video.thumbnail} className="max-h-full max-w-full object-contain shadow-2xl" alt={video.title} />
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
              <i className="fas fa-play text-white text-3xl ml-1"></i>
            </div>
          </div>
        )}
      </div>

      {/* Overlay: Bottom Gradient */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

      {/* Interaction Icons (Right) */}
      <div className="absolute right-4 bottom-24 z-30 flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={handleLike} 
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all shadow-xl ${isLiked ? 'bg-primary text-white scale-110' : 'bg-black/40 backdrop-blur-md text-white hover:bg-white/20'}`}
          >
            <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i>
          </button>
          <span className="text-[10px] font-black uppercase text-white drop-shadow-md">{formatCount(video.likesCount)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsCommentsOpen(true); }}
            className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center text-xl hover:bg-white/20 transition-all shadow-xl"
          >
            <i className="far fa-comment-dots"></i>
          </button>
          <span className="text-[10px] font-black uppercase text-white drop-shadow-md">{formatCount(comments.length)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={handleRepost}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all shadow-xl ${isReposted ? 'bg-green-500 text-white' : 'bg-black/40 backdrop-blur-md text-white hover:bg-white/20'}`}
          >
            <i className="fas fa-retweet"></i>
          </button>
          <span className="text-[10px] font-black uppercase text-white drop-shadow-md">{formatCount(video.repostsCount)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center text-xl hover:bg-white/20 transition-all shadow-xl"
          >
            <i className="far fa-paper-plane"></i>
          </button>
          <span className="text-[10px] font-black uppercase text-white drop-shadow-md">{formatCount(video.sharesCount)}</span>
        </div>
      </div>

      {/* Meta Info (Bottom Left) */}
      <div className="absolute bottom-12 left-6 right-20 z-30 pointer-events-none">
        <div className="flex items-center gap-3 mb-4 pointer-events-auto">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center font-black text-lg border-2 border-white/20 overflow-hidden shrink-0">
            {video.artist.charAt(0)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-white drop-shadow-lg">{video.artist}</span>
              <button 
                onClick={handleFollow}
                className={`text-[8px] font-black uppercase px-4 py-1 rounded-full border border-white/20 transition-all ${subscribed ? 'bg-white/10 text-gray-400' : 'bg-primary text-white'}`}
              >
                {subscribed ? 'Following' : 'Follow'}
              </button>
            </div>
            <span className="text-[10px] text-gray-400 font-bold tracking-widest">@{video.artist.toLowerCase().replace(/\s/g, '')}</span>
          </div>
        </div>
        
        <div className="pointer-events-auto max-w-lg">
          <h3 className="text-lg font-black text-white mb-1 drop-shadow-md line-clamp-1">{video.title}</h3>
          <p className={`text-xs text-gray-300 leading-relaxed drop-shadow-md transition-all ${showFullDescription ? '' : 'line-clamp-2'}`}>
            {video.description || "No description provided for this high-fidelity broadcast."}
          </p>
          {video.description && video.description.length > 60 && (
            <button 
              onClick={(e) => { e.stopPropagation(); setShowFullDescription(!showFullDescription); }}
              className="text-primary text-[10px] font-black uppercase mt-1 tracking-widest hover:underline"
            >
              {showFullDescription ? 'Less' : 'More'}
            </button>
          )}
        </div>
      </div>

      {/* Comments Drawer */}
      {isCommentsOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end" onClick={(e) => e.stopPropagation()}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCommentsOpen(false)}></div>
          <div className="relative w-full h-[60vh] bg-dark-light rounded-t-[2.5rem] flex flex-col shadow-2xl animate__animated animate__slideInUp animate__faster border-t border-white/5">
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Comments ({comments.length})</h4>
              <button onClick={() => setIsCommentsOpen(false)} className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center text-gray-500">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {comments.map(c => (
                <div key={c.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-white/5">
                    {c.username.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white mb-1">@{c.username}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p className="text-center text-gray-600 text-xs py-10 italic">No comments yet.</p>}
            </div>
            <form onSubmit={handleCommentSubmit} className="p-4 bg-dark border-t border-white/5 flex items-center gap-3">
              <input 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Say something nice..."
                className="flex-1 bg-dark-lighter border border-white/5 rounded-2xl px-6 py-3 text-xs outline-none focus:border-primary/50 transition-all"
              />
              <button type="submit" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, allVideos, onClose, user, onRefresh, addToast }) => {
  const [activeId, setActiveId] = useState(video.id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Initial scroll to the selected video
    const el = document.getElementById(`feed-item-${video.id}`);
    if (el) el.scrollIntoView({ behavior: 'auto' });

    // Set up IntersectionObserver to detect active video
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const id = entry.target.getAttribute('data-video-id');
            if (id) setActiveId(id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const slides = document.querySelectorAll('.video-feed-slide');
    slides.forEach(s => observerRef.current?.observe(s));

    return () => observerRef.current?.disconnect();
  }, [video.id]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col animate__animated animate__fadeIn">
      {/* Top Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[210] p-6 flex items-center justify-between pointer-events-none">
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-primary transition-all shadow-xl"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="flex items-center gap-4 pointer-events-auto">
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white/50">VideoMack Feed</span>
        </div>
        <div className="w-12"></div>
      </div>

      {/* Scrolling Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {allVideos.map((v) => (
          <div 
            key={v.id} 
            id={`feed-item-${v.id}`}
            data-video-id={v.id}
            className="video-feed-slide w-full h-full snap-start"
          >
            <VideoFeedItem 
              video={v} 
              user={user} 
              isActive={activeId === v.id}
              onRefresh={onRefresh}
              addToast={addToast}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;

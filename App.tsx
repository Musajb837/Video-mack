
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppTab, User, AuthStage, Video } from './types';
import { SAMPLE_VIDEOS } from './constants';
import { initDB, getVideos, saveUser, getUser, incrementVideoViews } from './database';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import HomeTab from './components/tabs/HomeTab';
import ExploreTab from './components/tabs/ExploreTab';
import UploadTab from './components/tabs/UploadTab';
import LiveTab from './components/tabs/LiveTab';
import LibraryTab from './components/tabs/LibraryTab';
import ProfileTab from './components/tabs/ProfileTab';
import ChatTab from './components/tabs/ChatTab';
import AuthModal from './components/AuthModal';
import VideoPlayer from './components/VideoPlayer';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>(AuthStage.LOGIN);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [dbReady, setDbReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const handleBack = useCallback(() => {
    setActiveTab(AppTab.HOME);
  }, []);

  useEffect(() => {
    initDB().then(() => {
      setDbReady(true);
      const savedUser = localStorage.getItem('videomack_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const freshUser = getUser(parsed.id);
        setUser(freshUser || parsed);
      }
    });
  }, []);

  const refreshVideos = useCallback(() => {
    if (!dbReady) return;
    setUserVideos(getVideos(user?.id));
  }, [dbReady, user?.id]);

  useEffect(() => {
    refreshVideos();
  }, [refreshVideos, activeTab]);

  const handleAuthSuccess = useCallback((userData: User) => {
    setUser(userData);
    saveUser(userData);
    localStorage.setItem('videomack_user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    refreshVideos();
    addToast(`Welcome back, ${userData.fullName}!`);
  }, [refreshVideos, addToast]);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('videomack_user');
    setActiveTab(AppTab.HOME);
    addToast('Logged out successfully');
  }, [addToast]);

  const openAuth = (stage: AuthStage = AuthStage.LOGIN) => {
    setAuthStage(stage);
    setIsAuthModalOpen(true);
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    if (!video.isLive) {
      incrementVideoViews(video.id);
    }
    refreshVideos();
  };

  const allVideos = useMemo(() => {
    const combined = [...SAMPLE_VIDEOS, ...userVideos];
    if (!searchQuery) return combined;
    return combined.filter(v => 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [userVideos, searchQuery]);

  if (!dbReady) return <div className="min-h-screen bg-dark flex items-center justify-center text-primary font-bold">Initializing Database...</div>;

  const renderTab = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return <HomeTab videos={allVideos} onVideoClick={handleVideoSelect} user={user} onRefresh={refreshVideos} />;
      case AppTab.EXPLORE:
        return <ExploreTab videos={allVideos} onVideoClick={handleVideoSelect} onBack={handleBack} />;
      case AppTab.UPLOAD:
        return user?.isActivated ? <UploadTab user={user} onBack={handleBack} onUploadComplete={() => { setActiveTab(AppTab.PROFILE); refreshVideos(); addToast('Video published!'); }} /> : <div className="p-8 text-center">Please activate your account to upload.</div>;
      case AppTab.LIVE:
        return <LiveTab onVideoClick={handleVideoSelect} onBack={handleBack} />;
      case AppTab.LIBRARY:
        return user ? <LibraryTab user={user} videos={userVideos.filter(v => v.userId === user.id)} onVideoClick={handleVideoSelect} onBack={handleBack} /> : <div className="p-8 text-center">Please log in to view library.</div>;
      case AppTab.CHAT:
        return user ? <ChatTab currentUser={user} onBack={handleBack} /> : <div className="p-8 text-center">Please log in to message followers.</div>;
      case AppTab.PROFILE:
        return user ? <ProfileTab user={user} userVideos={userVideos.filter(v => v.userId === user.id)} onLogout={handleLogout} onUserUpdate={(u) => { setUser(u); saveUser(u); localStorage.setItem('videomack_user', JSON.stringify(u)); addToast('Profile updated'); }} refreshVideos={refreshVideos} onBack={handleBack} /> : <div className="p-8 text-center">Please log in to view profile.</div>;
      default:
        return <HomeTab videos={allVideos} onVideoClick={handleVideoSelect} user={user} onRefresh={refreshVideos} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white pt-16 pb-20 md:pb-8 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col min-h-[calc(100vh-4rem)] relative">
        <Navbar 
          user={user} 
          onOpenAuth={() => openAuth(AuthStage.LOGIN)} 
          onTabChange={setActiveTab} 
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="flex-1 w-full px-4 md:px-8 py-6">
          {renderTab()}
        </main>

        <BottomNav 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            if ([AppTab.UPLOAD, AppTab.LIBRARY, AppTab.PROFILE, AppTab.CHAT].includes(tab) && !user) {
              openAuth(AuthStage.LOGIN);
            } else {
              setActiveTab(tab);
            }
          }} 
        />

        {isAuthModalOpen && (
          <AuthModal 
            stage={authStage} 
            onClose={() => setIsAuthModalOpen(false)} 
            onSuccess={handleAuthSuccess}
            setStage={setAuthStage}
          />
        )}

        {selectedVideo && (
          <VideoPlayer 
            video={selectedVideo} 
            allVideos={allVideos}
            onClose={() => setSelectedVideo(null)} 
            onRelatedVideoClick={handleVideoSelect}
            user={user} 
            onRefresh={refreshVideos}
            addToast={addToast}
          />
        )}

        <div className="fixed top-20 right-4 z-[300] flex flex-col gap-2">
          {toasts.map(t => (
            <Toast key={t.id} message={t.message} type={t.type} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

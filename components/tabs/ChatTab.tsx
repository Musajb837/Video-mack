
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../../types';
import { getRecentChats, getMessages, sendMessage, getFollowers, getFollowing } from '../../database';

interface ChatTabProps {
  currentUser: User;
  onBack?: () => void;
}

const ChatTab: React.FC<ChatTabProps> = ({ currentUser, onBack }) => {
  const [chats, setChats] = useState<any[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chats' | 'explore'>('chats');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChats(getRecentChats(currentUser.id));
    setFollowers(getFollowers(currentUser.id));
    setFollowing(getFollowing(currentUser.id));
  }, [currentUser.id]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(getMessages(currentUser.id, selectedChat.id));
    }
  }, [selectedChat, currentUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedChat) return;
    sendMessage(currentUser.id, selectedChat.id, input);
    setMessages(getMessages(currentUser.id, selectedChat.id));
    setInput('');
    // Refresh sidebar if it's a new chat
    setChats(getRecentChats(currentUser.id));
  };

  const startChat = (user: User) => {
    setSelectedChat(user);
    setActiveSidebarTab('chats');
  };

  return (
    <div className="animate__animated animate__fadeIn flex h-[calc(100vh-10rem)] bg-dark-light border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="w-full md:w-80 border-r border-dark-lighter flex flex-col bg-dark/30">
        <div className="p-6 border-b border-dark-lighter">
           <div className="flex items-center gap-3 mb-4">
             {onBack && (
                <button 
                  onClick={onBack}
                  className="text-gray-500 hover:text-primary transition-all scale-110"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
             )}
             <h2 className="text-xl font-black flex items-center gap-2">
               <i className="fas fa-comment-dots text-primary"></i> Messages
             </h2>
           </div>
           <div className="flex p-1 bg-dark rounded-xl border border-white/5">
              <button 
                onClick={() => setActiveSidebarTab('chats')}
                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${activeSidebarTab === 'chats' ? 'bg-primary text-white' : 'text-gray-500 hover:text-white'}`}
              >
                Chats
              </button>
              <button 
                onClick={() => setActiveSidebarTab('explore')}
                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${activeSidebarTab === 'explore' ? 'bg-primary text-white' : 'text-gray-500 hover:text-white'}`}
              >
                Followers
              </button>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {activeSidebarTab === 'chats' ? (
            chats.length > 0 ? (
              chats.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4 ${selectedChat?.id === chat.id ? 'bg-primary/10 border-primary' : 'hover:bg-dark-lighter border-transparent'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-black overflow-hidden shrink-0 shadow-lg">
                    {chat.avatar ? <img src={chat.avatar} className="w-full h-full object-cover" /> : chat.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{chat.fullName || chat.username}</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest truncate">@{chat.username}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center opacity-20">
                 <p className="text-xs font-black uppercase tracking-widest">No recent chats</p>
              </div>
            )
          ) : (
            <div className="p-4 space-y-2">
              <p className="px-2 text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">People who follow you</p>
              {followers.length > 0 ? (
                followers.map(f => (
                  <div key={f.id} onClick={() => startChat(f)} className="flex items-center gap-3 p-3 rounded-2xl bg-dark/50 hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center font-bold text-xs overflow-hidden group-hover:shadow-[0_0_10px_rgba(255,55,95,0.3)] transition-all">
                      {f.avatar ? <img src={f.avatar} className="w-full h-full object-cover" /> : f.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{f.fullName}</p>
                      <p className="text-[9px] text-gray-500 font-black tracking-widest">@{f.username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-gray-600 italic px-2">Your fan list is empty. Start creating!</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative bg-dark">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-dark-lighter bg-dark-light/50 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-black overflow-hidden border border-white/10 shadow-lg">
                    {selectedChat.avatar ? <img src={selectedChat.avatar} className="w-full h-full object-cover" /> : selectedChat.username.charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <h3 className="font-bold text-sm">{selectedChat.fullName || selectedChat.username}</h3>
                    <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Secure Broadcast</p>
                 </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
              {messages.length > 0 ? (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-4 rounded-3xl text-sm shadow-xl transition-all hover:scale-[1.02] ${
                      msg.senderId === currentUser.id 
                        ? 'bg-primary text-white rounded-br-none shadow-primary/20' 
                        : 'bg-dark-lighter text-gray-200 rounded-bl-none shadow-black/40'
                    }`}>
                      {msg.content}
                      <p className={`text-[8px] mt-1 font-black opacity-40 uppercase ${msg.senderId === currentUser.id ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                   <i className="fas fa-shield-halved text-9xl mb-4"></i>
                   <p className="text-xl font-black uppercase tracking-[1em]">ENCRYPTED</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-dark border-t border-dark-lighter">
              <form onSubmit={handleSend} className="flex items-center gap-4 bg-dark-lighter rounded-2xl px-6 py-1 border border-white/5 focus-within:ring-2 ring-primary/30 transition-all">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Express your vision..."
                  className="w-full bg-transparent border-none outline-none py-3 text-sm font-medium"
                />
                <button type="submit" className={`transition-all ${input.trim() ? 'text-primary scale-125' : 'text-gray-600 cursor-not-allowed'}`}>
                  <i className="fas fa-bolt"></i>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30">
             <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center text-primary text-6xl mb-8 animate-pulse">
                <i className="fas fa-paper-plane"></i>
             </div>
             <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Direct Connection</h3>
             <p className="text-sm max-w-sm font-medium leading-relaxed">Select a follower from the sidebar to initiate a high-fidelity private session.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTab;

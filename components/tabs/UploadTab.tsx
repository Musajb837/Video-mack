
import React, { useState } from 'react';
import { User, Video } from '../../types';
import { saveVideo } from '../../database';
import { GoogleGenAI } from "@google/genai";

interface UploadTabProps {
  user: User;
  onUploadComplete: () => void;
  onBack?: () => void;
}

const UploadTab: React.FC<UploadTabProps> = ({ user, onUploadComplete, onBack }) => {
  const [step, setStep] = useState<'upload' | 'edit'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({
    title: '',
    category: 'Music',
    description: '',
    thumbnail: 'https://picsum.photos/seed/' + Math.random() + '/400/225',
    filter: 'none'
  });

  const generateAiDescription = async () => {
    setIsAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a viral, high-energy YouTube-style description for a video titled "${form.title}" in the ${form.category} category. Include some emojis and relevant hashtags. Keep it concise but punchy.`,
      });
      // Extracting text output from GenerateContentResponse
      setForm(prev => ({ ...prev, description: response.text || '' }));
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleInitialUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setStep('edit');
        }, 500);
      }
    }, 50);
  };

  const handlePublish = () => {
    const newVideo: Video = {
      id: 'v-' + Date.now(),
      title: form.title,
      artist: user.fullName,
      userId: user.id,
      views: 0,
      duration: '3:45',
      thumbnail: form.thumbnail,
      category: form.category,
      uploadedAt: 'Just now',
      liked: false,
      description: form.description,
      // Adding missing mandatory fields
      likesCount: 0,
      repostsCount: 0,
      sharesCount: 0
    };
    saveVideo(newVideo);
    onUploadComplete();
  };

  if (step === 'edit') {
    return (
      <div className="animate__animated animate__fadeIn max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black">Magic Editor</h2>
          <button onClick={handlePublish} className="bg-primary px-10 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Publish</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Window */}
          <div className="space-y-6">
            <div className={`aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-dark-lighter relative group ${form.filter === 'noir' ? 'grayscale' : ''} ${form.filter === 'vibrant' ? 'contrast-125 saturate-150' : ''} ${form.filter === 'dream' ? 'blur-[1px] sepia-[0.3]' : ''}`}>
              <img src={form.thumbnail} className="w-full h-full object-cover" alt="Preview" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-play text-4xl text-white"></i>
              </div>
            </div>
            
            <div className="bg-dark-light p-6 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">Neural Filters</p>
              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {['none', 'noir', 'vibrant', 'dream', 'cinematic'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setForm({...form, filter: f})}
                    className={`shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${form.filter === f ? 'bg-primary border-primary text-white' : 'bg-dark border-white/5 text-gray-400 hover:border-primary/50'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Tools */}
          <div className="space-y-6">
            <div className="bg-dark-light p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">AI Content Suite</p>
                <button 
                  onClick={generateAiDescription}
                  disabled={isAiGenerating}
                  className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                >
                  {isAiGenerating ? 'Analyzing...' : 'Auto-Generate Info'}
                </button>
              </div>

              <div className="space-y-4">
                <input 
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full bg-dark border border-white/5 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none"
                  placeholder="Video Title"
                />
                <textarea 
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  rows={6}
                  className="w-full bg-dark border border-white/5 rounded-xl px-4 py-3 text-xs leading-relaxed focus:border-primary outline-none resize-none"
                  placeholder="Video Description..."
                />
              </div>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
                 <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                    <i className="fas fa-wand-magic-sparkles"></i>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-white tracking-widest">AI Suggestion</p>
                    <p className="text-[9px] text-gray-400">Add tech hashtags to boost visibility in the Tech category.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate__animated animate__fadeIn max-w-2xl mx-auto py-12">
      <div className="flex items-center gap-4 mb-8">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-dark-lighter rounded-full flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-xl"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        )}
        <h2 className="text-3xl font-black">Creator Studio</h2>
      </div>
      
      <form onSubmit={handleInitialUpload} className="bg-dark-light border border-dark-lighter rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-6">
         {!isUploading ? (
           <div className="flex flex-col items-center justify-center border-2 border-dashed border-dark-lighter rounded-3xl p-10 hover:border-primary/50 transition-all cursor-pointer bg-dark/30 group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl text-primary mb-4 group-hover:scale-110 transition-transform">
                 <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <p className="text-sm font-bold text-gray-400">Select source for your high-fidelity broadcast</p>
           </div>
         ) : (
           <div className="space-y-4 py-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Ingesting frames...</span>
                <span className="text-xs font-black text-white">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-dark-lighter h-3 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-primary shadow-[0_0_15px_#FF375F] transition-all duration-75"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
           </div>
         )}

         <div className="space-y-4">
            <div>
               <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">Video Title</label>
               <input 
                 value={form.title}
                 onChange={e => setForm({...form, title: e.target.value})}
                 placeholder="Enter a catchy title..."
                 disabled={isUploading}
                 className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 focus:border-primary outline-none disabled:opacity-50 transition-all text-sm"
               />
            </div>
            <div>
               <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">Category</label>
               <select 
                 value={form.category}
                 onChange={e => setForm({...form, category: e.target.value})}
                 disabled={isUploading}
                 className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 focus:border-primary outline-none disabled:opacity-50 transition-all text-sm"
               >
                  {['Music', 'Gaming', 'Tech', 'Learning', 'Entertainment'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
               </select>
            </div>
         </div>

         <button 
           type="submit" 
           disabled={isUploading || !form.title}
           className="w-full bg-primary hover:bg-primary-dark py-4 rounded-xl font-black tracking-widest shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
         >
            {isUploading ? 'INGESTING...' : 'CONTINUE TO EDITOR'}
         </button>
      </form>
    </div>
  );
};

export default UploadTab;

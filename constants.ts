
import { Video, Badge } from './types';

export const CATEGORIES = [
  'All', 'Music', 'Gaming', 'Tech', 'Podcasts', 'Shorts', 'Learning', 'Live'
];

export const ACHIEVEMENT_BADGES: Badge[] = [
  { id: 'rising_star', name: 'Rising Star', icon: 'fa-star', color: 'text-yellow-400', description: 'Gained over 1,000 views in a single week.' },
  { id: 'content_king', name: 'Content King', icon: 'fa-crown', color: 'text-primary', description: 'Uploaded more than 10 high-quality broadcasts.' },
  { id: 'verified_pro', name: 'Verified Pro', icon: 'fa-check-double', color: 'text-blue-400', description: 'Account identity fully verified by VideoMack.' },
  { id: 'vibe_master', name: 'Vibe Master', icon: 'fa-headphones', color: 'text-purple-400', description: 'Your Music videos reached the top charts.' },
  { id: 'engagement_guru', name: 'Guru', icon: 'fa-fire', color: 'text-orange-500', description: 'Consistently high comment-to-view ratio.' }
];

export const SAMPLE_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Neon Nights: Cyberpunk Beats',
    artist: 'Digital Echo',
    userId: 'system',
    views: 1200000,
    duration: '10:45',
    thumbnail: 'https://picsum.photos/seed/v1/400/225',
    category: 'Music',
    liked: false,
    uploadedAt: '2 days ago',
    description: 'Immerse yourself in the glowing atmosphere of the future with this high-energy cyberpunk mix.',
    // Adding missing mandatory fields
    likesCount: 12500,
    repostsCount: 450,
    sharesCount: 1200
  },
  {
    id: '2',
    title: 'Building a React App with Gemini AI',
    artist: 'Code Master',
    userId: 'system',
    views: 450000,
    duration: '22:15',
    thumbnail: 'https://picsum.photos/seed/v2/400/225',
    category: 'Tech',
    liked: true,
    uploadedAt: '5 hours ago',
    description: 'Learn how to integrate the latest Google Gemini API into your React projects.',
    // Adding missing mandatory fields
    likesCount: 32000,
    repostsCount: 890,
    sharesCount: 2500
  }
];

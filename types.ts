
export enum AppTab {
  HOME = 'home',
  EXPLORE = 'explore',
  UPLOAD = 'upload',
  LIVE = 'live',
  LIBRARY = 'library',
  PROFILE = 'profile',
  CHAT = 'chat'
}

export enum AuthStage {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot_password',
  VERIFY_OTP = 'verify_otp',
  RESET_PASSWORD = 'reset_password',
  ACTIVATION_PENDING = 'activation_pending'
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  country: string;
  countryCode: string;
  bio: string;
  isAuthenticated: boolean;
  isActivated: boolean;
  isVerified?: boolean;
  verificationType?: 'blue' | 'gold' | 'gray' | null;
  avatar?: string;
  coverPhoto?: string;
  subscriberCount?: number;
  followingCount?: number;
  walletBalance?: number;
  isTwoFactorEnabled?: boolean;
  badges?: string[]; // IDs of earned badges
}

export interface Video {
  id: string;
  title: string;
  artist: string;
  userId: string;
  views: number;
  duration: string;
  thumbnail: string;
  category: string;
  liked: boolean;
  uploadedAt: string;
  description?: string;
  isLive?: boolean;
  aiTags?: string[];
  likesCount: number;
  repostsCount: number;
  sharesCount: number;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  parentId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface Country {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

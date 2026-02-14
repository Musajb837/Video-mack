
import { User, Video, Comment, Message } from './types';

let db: any = null;

export const initDB = async () => {
  if (db) return db;
  
  const SQL = await (window as any).initSqlJs({
    locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
  });

  const savedDb = localStorage.getItem('videomack_db');
  if (savedDb) {
    const u8 = new Uint8Array(JSON.parse(savedDb));
    db = new SQL.Database(u8);
  } else {
    db = new SQL.Database();
  }

  // Initialize/Upgrade schema
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      fullName TEXT,
      username TEXT,
      email TEXT,
      phoneNumber TEXT,
      country TEXT,
      countryCode TEXT,
      bio TEXT,
      isAuthenticated INTEGER,
      isActivated INTEGER,
      isVerified INTEGER,
      verificationType TEXT,
      avatar TEXT,
      coverPhoto TEXT,
      subscriberCount INTEGER DEFAULT 0,
      followingCount INTEGER DEFAULT 0,
      walletBalance REAL DEFAULT 0.0,
      isTwoFactorEnabled INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT,
      artist TEXT,
      userId TEXT,
      views INTEGER,
      duration TEXT,
      thumbnail TEXT,
      category TEXT,
      liked INTEGER,
      uploadedAt TEXT,
      description TEXT,
      isLive INTEGER DEFAULT 0,
      likesCount INTEGER DEFAULT 0,
      repostsCount INTEGER DEFAULT 0,
      sharesCount INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      videoId TEXT,
      userId TEXT,
      username TEXT,
      content TEXT,
      createdAt TEXT,
      parentId TEXT
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      senderId TEXT,
      receiverId TEXT,
      content TEXT,
      timestamp TEXT
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      userId TEXT,
      subscriberId TEXT,
      PRIMARY KEY (userId, subscriberId)
    );

    CREATE TABLE IF NOT EXISTS watch_later (
      userId TEXT,
      videoId TEXT,
      PRIMARY KEY (userId, videoId)
    );
  `);

  persistDB();
  return db;
};

const persistDB = () => {
  if (db) {
    const data = db.export();
    localStorage.setItem('videomack_db', JSON.stringify(Array.from(data)));
  }
};

export const saveUser = (user: User) => {
  db.run(`INSERT OR REPLACE INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    user.id, user.fullName, user.username, user.email, user.phoneNumber, 
    user.country, user.countryCode, user.bio, 
    user.isAuthenticated ? 1 : 0, user.isActivated ? 1 : 0, 
    user.isVerified ? 1 : 0, user.verificationType || null, user.avatar || '',
    user.coverPhoto || '',
    user.subscriberCount || 0, user.followingCount || 0,
    user.walletBalance || 0.0, user.isTwoFactorEnabled ? 1 : 0
  ]);
  persistDB();
};

export const getUser = (id: string): User | null => {
  const res = db.exec(`SELECT * FROM users WHERE id = '${id}'`);
  if (res.length > 0) {
    const row = res[0].values[0];
    return {
      id: row[0], fullName: row[1], username: row[2], email: row[3],
      phoneNumber: row[4], country: row[5], countryCode: row[6], bio: row[7],
      isAuthenticated: !!row[8], isActivated: !!row[9], isVerified: !!row[10],
      verificationType: row[11], avatar: row[12], coverPhoto: row[13],
      subscriberCount: row[14], followingCount: row[15], walletBalance: row[16],
      isTwoFactorEnabled: !!row[17]
    };
  }
  return null;
};

export const saveVideo = (video: Video) => {
  db.run(`INSERT OR REPLACE INTO videos (id, title, artist, userId, views, duration, thumbnail, category, liked, uploadedAt, description, isLive, likesCount, repostsCount, sharesCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    video.id, video.title, video.artist, video.userId, video.views, 
    video.duration, video.thumbnail, video.category, 
    video.liked ? 1 : 0, video.uploadedAt, video.description || '', 
    video.isLive ? 1 : 0, video.likesCount || 0, video.repostsCount || 0, video.sharesCount || 0
  ]);
  persistDB();
};

export const deleteVideo = (id: string) => {
  db.run(`DELETE FROM videos WHERE id = ?`, [id]);
  persistDB();
};

export const getVideos = (userId?: string): Video[] => {
  let query = `SELECT * FROM videos`;
  if (userId) query += ` WHERE userId = '${userId}'`;
  const res = db.exec(query);
  if (res.length > 0) {
    return res[0].values.map((row: any) => ({
      id: row[0], title: row[1], artist: row[2], userId: row[3],
      views: row[4], duration: row[5], thumbnail: row[6], category: row[7],
      liked: !!row[8], uploadedAt: row[9], description: row[10], isLive: !!row[11],
      likesCount: row[12] || 0, repostsCount: row[13] || 0, sharesCount: row[14] || 0
    }));
  }
  return [];
};

export const incrementVideoViews = (id: string) => {
  db.run(`UPDATE videos SET views = views + 1 WHERE id = ?`, [id]);
  persistDB();
};

export const toggleLike = (userId: string, videoId: string) => {
  db.run(`UPDATE videos SET 
    liked = CASE WHEN liked = 1 THEN 0 ELSE 1 END,
    likesCount = CASE WHEN liked = 1 THEN likesCount - 1 ELSE likesCount + 1 END
    WHERE id = ?`, [videoId]);
  persistDB();
};

export const incrementRepost = (videoId: string) => {
  db.run(`UPDATE videos SET repostsCount = repostsCount + 1 WHERE id = ?`, [videoId]);
  persistDB();
};

export const incrementShare = (videoId: string) => {
  db.run(`UPDATE videos SET sharesCount = sharesCount + 1 WHERE id = ?`, [videoId]);
  persistDB();
};

export const addComment = (comment: Comment) => {
  db.run(`INSERT INTO comments VALUES (?, ?, ?, ?, ?, ?, ?)`, [
    comment.id, comment.videoId, comment.userId, comment.username, 
    comment.content, comment.createdAt, comment.parentId || null
  ]);
  persistDB();
};

export const getComments = (videoId: string): Comment[] => {
  const res = db.exec(`SELECT * FROM comments WHERE videoId = '${videoId}' ORDER BY createdAt DESC`);
  if (res.length > 0) {
    return res[0].values.map((row: any) => ({
      id: row[0], videoId: row[1], userId: row[2], username: row[3],
      content: row[4], createdAt: row[5], parentId: row[6]
    }));
  }
  return [];
};

export const toggleSubscription = (subscriberId: string, userId: string) => {
  const exists = db.exec(`SELECT 1 FROM subscriptions WHERE subscriberId = '${subscriberId}' AND userId = '${userId}'`);
  if (exists.length > 0) {
    db.run(`DELETE FROM subscriptions WHERE subscriberId = ? AND userId = ?`, [subscriberId, userId]);
  } else {
    db.run(`INSERT INTO subscriptions VALUES (?, ?)`, [userId, subscriberId]);
  }
  persistDB();
};

export const isSubscribed = (subscriberId: string, userId: string): boolean => {
  const res = db.exec(`SELECT 1 FROM subscriptions WHERE subscriberId = '${subscriberId}' AND userId = '${userId}'`);
  return res.length > 0;
};

export const getFollowers = (userId: string): User[] => {
  const res = db.exec(`
    SELECT u.* FROM users u 
    JOIN subscriptions s ON u.id = s.subscriberId 
    WHERE s.userId = '${userId}'
  `);
  if (res.length > 0) {
    return res[0].values.map((row: any) => ({
      id: row[0], fullName: row[1], username: row[2], email: row[3],
      phoneNumber: row[4], country: row[5], countryCode: row[6], bio: row[7],
      isAuthenticated: !!row[8], isActivated: !!row[9], isVerified: !!row[10],
      verificationType: row[11], avatar: row[12], coverPhoto: row[13],
      subscriberCount: row[14], followingCount: row[15], walletBalance: row[16],
      isTwoFactorEnabled: !!row[17]
    }));
  }
  return [];
};

export const getFollowing = (userId: string): User[] => {
  const res = db.exec(`
    SELECT u.* FROM users u 
    JOIN subscriptions s ON u.id = s.userId 
    WHERE s.subscriberId = '${userId}'
  `);
  if (res.length > 0) {
    return res[0].values.map((row: any) => ({
      id: row[0], fullName: row[1], username: row[2], email: row[3],
      phoneNumber: row[4], country: row[5], countryCode: row[6], bio: row[7],
      isAuthenticated: !!row[8], isActivated: !!row[9], isVerified: !!row[10],
      verificationType: row[11], avatar: row[12], coverPhoto: row[13],
      subscriberCount: row[14], followingCount: row[15], walletBalance: row[16],
      isTwoFactorEnabled: !!row[17]
    }));
  }
  return [];
};

export const toggleWatchLater = (userId: string, video: Video) => {
  const exists = db.exec(`SELECT 1 FROM watch_later WHERE userId = '${userId}' AND videoId = '${video.id}'`);
  if (exists.length > 0) {
    db.run(`DELETE FROM watch_later WHERE userId = ? AND videoId = ?`, [userId, video.id]);
  } else {
    db.run(`INSERT INTO watch_later VALUES (?, ?)`, [userId, video.id]);
    saveVideo(video); // Ensure video info is saved
  }
  persistDB();
};

export const isInWatchLater = (userId: string, videoId: string): boolean => {
  const res = db.exec(`SELECT 1 FROM watch_later WHERE userId = '${userId}' AND videoId = '${videoId}'`);
  return res.length > 0;
};

export const getWatchLaterVideos = (userId: string): Video[] => {
  const res = db.exec(`
    SELECT v.* FROM videos v 
    JOIN watch_later wl ON v.id = wl.videoId 
    WHERE wl.userId = '${userId}'
  `);
  if (res.length > 0) {
    return res[0].values.map((row: any) => ({
      id: row[0], title: row[1], artist: row[2], userId: row[3],
      views: row[4], duration: row[5], thumbnail: row[6], category: row[7],
      liked: !!row[8], uploadedAt: row[9], description: row[10], isLive: !!row[11],
      likesCount: row[12] || 0, repostsCount: row[13] || 0, sharesCount: row[14] || 0
    }));
  }
  return [];
};

export const updateVideoTitle = (id: string, title: string) => {
  db.run(`UPDATE videos SET title = ? WHERE id = ?`, [title, id]);
  persistDB();
};

// Messaging
export const sendMessage = (senderId: string, receiverId: string, content: string) => {
  const id = Math.random().toString(36).substring(2, 9);
  const timestamp = new Date().toISOString();
  db.run(`INSERT INTO messages VALUES (?, ?, ?, ?, ?)`, [id, senderId, receiverId, content, timestamp]);
  persistDB();
};

export const getMessages = (userId1: string, userId2: string): Message[] => {
  const res = db.exec(`
    SELECT * FROM messages 
    WHERE (senderId = '${userId1}' AND receiverId = '${userId2}')
       OR (senderId = '${userId2}' AND receiverId = '${userId1}')
    ORDER BY timestamp ASC
  `);
  if (res.length > 0) {
    return res[0].values.map((row: any) => ({
      id: row[0], senderId: row[1], receiverId: row[2], content: row[3], timestamp: row[4]
    }));
  }
  return [];
};

export const getRecentChats = (userId: string): any[] => {
  const res = db.exec(`
    SELECT DISTINCT 
      CASE WHEN senderId = '${userId}' THEN receiverId ELSE senderId END as peerId 
    FROM messages 
    WHERE senderId = '${userId}' OR receiverId = '${userId}'
  `);
  if (res.length > 0) {
    return res[0].values.map((row: any) => {
      const peer = getUser(row[0]);
      return peer || { id: row[0], username: 'Unknown User' };
    });
  }
  return [];
};

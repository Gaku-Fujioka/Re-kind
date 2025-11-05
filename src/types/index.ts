// ユーザー
export interface User {
  id: string;
  name: string;
  avatar?: string;
  createdAt: number;
}

// 投稿
export interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: number;
  isPrivate?: boolean;
}

// 励ましメッセージ
export interface Encouragement {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: number;
  thanked?: boolean; // 投稿者がありがとうチェック済みか
}

// KindCoin取引
export interface KindCoinTransaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  type: 'encouragement' | 'flower' | 'donation';
  relatedId?: string; // 関連する投稿IDや励ましID
  createdAt: number;
}

// Thank You Bloom（花の記録）
export interface ThankYouBloom {
  id: string;
  userId: string; // 花が咲いたユーザー
  fromUserId: string; // 花を贈ったユーザー
  postId?: string;
  encouragementId?: string;
  createdAt: number;
}

// 共感カレンダーエントリ
export interface EmpathyCalendarEntry {
  date: string; // YYYY-MM-DD
  userId: string;
  count: number; // その日の優しさの数
}

// Kind Mission
export interface KindMission {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  description: string;
  completed: boolean;
  createdAt: number;
}

// アプリケーション全体の状態
export interface AppState {
  users: User[];
  posts: Post[];
  encouragements: Encouragement[];
  transactions: KindCoinTransaction[];
  blooms: ThankYouBloom[];
  calendarEntries: EmpathyCalendarEntry[];
  missions: KindMission[];
  currentUserId: string | null;
}


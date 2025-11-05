// 型エイリアス
export type UserId = string;
export type PostId = string;
export type MessageId = string;
export type CoinId = string;
export type DateISO = string;

export type BloomKind = 'empathy' | 'courage' | 'rescue' | 'bouquet';

export interface Bloom {
  id: string;
  fromUserId: UserId; // 励ました人
  toUserId: UserId; // 感謝を送った人のプロフィールに咲く
  kind: BloomKind;
  createdAt: DateISO;
}

export interface KindCoin {
  id: CoinId;
  ownerId: UserId;
  sourceMessageId: MessageId;
  createdAt: DateISO;
  spentAt?: DateISO;
  spentTo?: 'donation' | 'gift';
  amount: number; // MVPは常に1
}

export interface Encouragement {
  id: MessageId;
  postId: PostId;
  fromUserId: UserId;
  toUserId: UserId; // Post author
  text: string;
  createdAt: DateISO;
  thanked: boolean; // ありがとうチェック済み
  coinIssued?: CoinId; // 発行されたKindCoinのID
}

export type CalendarFlower =
  | 'daisy' // 共感
  | 'tulip' // 励まし
  | 'sunflower' // 寄付/コイン使用
  | 'lotus' // ありがとう
  | 'blossom'; // 連続記録

export interface EmpathyCalendar {
  byDate: Record<string, CalendarFlower[]>; // 'YYYY-MM-DD' -> flowers
  streak: number;
  lastActionDate?: DateISO;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  action: 'send_encouragement' | 'send_empathy' | 'spend_coin' | 'thank';
  daily: boolean;
  rewardCoins: number; // 1
}

export interface MissionProgress {
  today: DateISO;
  completedIds: string[];
}

export interface User {
  id: UserId;
  name: string; // 匿名可。初期は"やさしい手 #1234"等
  bio?: string; // 自己紹介（任意）
  avatarSeed?: string; // ジェネレーティブアイコン用シード
  garden: Bloom[]; // ありがとう記録（花）
  wallet: KindCoin[]; // 所有コイン
  missions: MissionProgress;
  calendar?: EmpathyCalendar; // 共感カレンダー
  connectedUsers?: UserId[]; // 光でつながったユーザー（相互リンク）
}

export interface Post {
  id: PostId;
  authorId: UserId;
  text: string;
  createdAt: DateISO;
  encouragements: Encouragement[]; // 励まし
  isResolved?: boolean;
}

export interface LocalDBSchema {
  users: User[];
  posts: Post[];
}

// アプリケーション全体の状態（後方互換性のため）
export interface AppState {
  users: User[];
  posts: Post[];
  currentUserId: UserId | null;
}


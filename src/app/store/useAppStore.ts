import { create } from 'zustand';
import type {
  User,
  Post,
  Encouragement,
  KindCoin,
  Bloom,
  BloomKind,
  UserId,
  PostId,
  MessageId,
  CalendarFlower,
} from '../../lib/types';
import { localDB } from '../../lib/storage/LocalDB';
import { getTodayString } from '../../lib/utils/date';
import { seedDemoData } from '../../lib/seed';

interface AppStore {
  // State
  currentUserId: UserId | null;
  feed: Post[];
  selectedPostId: PostId | null;

  // Actions - 初期化
  initialize: () => void;
  setCurrentUser: (userId: UserId | null) => void;
  setSelectedPost: (postId: PostId | null) => void;
  refreshFeed: () => void;

  // User actions
  getCurrentUser: () => User | undefined;
  getUser: (userId: UserId) => User | undefined;
  createUser: (data: { name: string; bio?: string }) => User;

  // Post actions
  createPost: (text: string) => Post;
  getPost: (postId: PostId) => Post | undefined;
  getFeed: () => Post[];

  // Encouragement actions
  sendEncouragement: (
    postId: PostId,
    text: string
  ) => Encouragement | null;
  getUserEncouragements: (userId: UserId) => Encouragement[];

  // Thank & Coin actions
  thankAndIssueCoin: (
    postId: PostId,
    messageId: MessageId
  ) => { coin: KindCoin; bloom: Bloom } | null;

  // Coin actions
  getUserCoins: (userId: UserId) => KindCoin[];
  getUserBalance: (userId: UserId) => number;
  issueCoin: (userId: UserId, sourceMessageId: MessageId) => KindCoin;
  spendCoin: (
    coinId: string,
    spentTo: 'donation' | 'gift'
  ) => boolean;

  // Bloom actions
  addBloom: (userId: UserId, bloom: Omit<Bloom, 'id' | 'createdAt'>) => Bloom;

  // User actions
  getAllUsers: () => User[];
  connectWithUser: (targetUserId: UserId) => void; // 光でつながる
  isConnectedWithUser: (userId1: UserId, userId2: UserId) => boolean; // つながり確認

  // Mission actions
  completeMission: (missionId: string) => void;

  // Calendar actions
  logCalendarAction: (flower: CalendarFlower) => void;
}

// Bloom種別の判定（暫定：メッセージ長で判定）
const determineBloomKind = (messageLength: number): BloomKind => {
  if (messageLength < 20) return 'empathy';
  if (messageLength < 50) return 'courage';
  if (messageLength < 100) return 'rescue';
  return 'bouquet';
};

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  currentUserId: null,
  feed: [],
  selectedPostId: null,

  // 初期化
  initialize: () => {
    // データベースをシード（デモデータ）
    seedDemoData();

    // フィードを更新
    get().refreshFeed();

    // デフォルトユーザーを設定（最初のユーザー）
    const users = localDB.getAllUsers();
    if (users.length > 0 && !localStorage.getItem('rekind_current_user')) {
      set({ currentUserId: users[0].id });
      localStorage.setItem('rekind_current_user', users[0].id);
    } else {
      const savedUserId = localStorage.getItem('rekind_current_user');
      if (savedUserId) {
        set({ currentUserId: savedUserId });
      }
    }
  },

  setCurrentUser: (userId) => {
    set({ currentUserId: userId });
    if (userId) {
      localStorage.setItem('rekind_current_user', userId);
      // ニックネームも保存（簡易匿名ログイン）
      const user = localDB.getUser(userId);
      if (user) {
        localStorage.setItem('rekind_nickname', user.name);
      }
    } else {
      localStorage.removeItem('rekind_current_user');
      localStorage.removeItem('rekind_nickname');
    }
  },

  setSelectedPost: (postId) => {
    set({ selectedPostId: postId });
  },

  refreshFeed: () => {
    const posts = localDB.getAllPosts();
    // 作成日時でソート（新しい順）
    const sortedPosts = [...posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    set({ feed: sortedPosts });
  },

  // User actions
  getCurrentUser: () => {
    const { currentUserId } = get();
    if (!currentUserId) return undefined;
    return localDB.getUser(currentUserId);
  },

  getUser: (userId) => {
    return localDB.getUser(userId);
  },

  createUser: (data) => {
    const userId = localDB.generateUserId();
    const today = getTodayString();
    const user: User = {
      id: userId,
      name: data.name,
      bio: data.bio || '',
      avatarSeed: `seed_${Date.now()}`,
      garden: [],
      wallet: [],
      missions: {
        today,
        completedIds: [],
      },
      calendar: {
        byDate: {},
        streak: 0,
      },
    };
    localDB.saveUser(user);
    return user;
  },

  // Post actions
  createPost: (text) => {
    const { currentUserId } = get();
    if (!currentUserId) {
      throw new Error('User must be logged in to create a post');
    }

    const post: Post = {
      id: localDB.generatePostId(),
      authorId: currentUserId,
      text,
      createdAt: new Date().toISOString(),
      encouragements: [],
      isResolved: false,
    };

    localDB.savePost(post);
    get().refreshFeed();

    // カレンダーにdaisyを記録
    get().logCalendarAction('daisy');

    return post;
  },

  getPost: (postId) => {
    return localDB.getPost(postId);
  },

  getFeed: () => {
    return get().feed;
  },

  // Encouragement actions
  sendEncouragement: (postId, text) => {
    const { currentUserId } = get();
    if (!currentUserId) {
      console.error('User must be logged in to send encouragement');
      return null;
    }

    const post = localDB.getPost(postId);
    if (!post) {
      console.error(`Post ${postId} not found`);
      return null;
    }

    const encouragement: Encouragement = {
      id: localDB.generateMessageId(),
      postId,
      fromUserId: currentUserId,
      toUserId: post.authorId,
      text,
      createdAt: new Date().toISOString(),
      thanked: false,
    };

    localDB.saveEncouragement(postId, encouragement);
    get().refreshFeed();

    // カレンダーにtulipを記録
    get().logCalendarAction('tulip');

    return encouragement;
  },

  getUserEncouragements: (userId) => {
    return localDB.getUserEncouragements(userId);
  },

  // Thank & Coin actions
  thankAndIssueCoin: (postId, messageId) => {
    const { currentUserId } = get();
    if (!currentUserId) {
      console.error('User must be logged in to thank');
      return null;
    }

    const post = localDB.getPost(postId);
    if (!post) {
      console.error(`Post ${postId} not found`);
      return null;
    }

    const encouragement = post.encouragements.find((e) => e.id === messageId);
    if (!encouragement) {
      console.error(`Encouragement ${messageId} not found`);
      return null;
    }

    // 投稿者以外は感謝できない
    if (post.authorId !== currentUserId) {
      console.error('Only post author can thank');
      return null;
    }

    // 既に感謝済み
    if (encouragement.thanked) {
      console.error('Already thanked');
      return null;
    }

    // 励ました人に感謝を送る
    const fromUserId = encouragement.fromUserId;

    // 1. 励ましに感謝済みマーク
    encouragement.thanked = true;

    // 2. Bloomを判定（メッセージ長で暫定判定）
    const bloomKind = determineBloomKind(encouragement.text.length);

    // 3. Bloomを作成して相手のプロフィールに追加
    const bloom: Bloom = {
      id: localDB.generateBloomId(),
      fromUserId: currentUserId, // 感謝を送った人（投稿者）
      toUserId: fromUserId, // 励ました人
      kind: bloomKind,
      createdAt: new Date().toISOString(),
    };

    localDB.addBloom(fromUserId, bloom);

    // 4. KindCoinを発行
    const coin = localDB.issueCoin(
      fromUserId,
      messageId,
      localDB.generateCoinId()
    );

    // 5. 励ましにコインIDを紐付け
    encouragement.coinIssued = coin.id;

    // 6. 励ましを保存
    localDB.saveEncouragement(postId, encouragement);

    // 7. カレンダーにlotusを記録（感謝を送った人側）
    get().logCalendarAction('lotus');

    // 8. フィードを更新
    get().refreshFeed();

    return { coin, bloom };
  },

  // Coin actions
  getUserCoins: (userId) => {
    return localDB.getUserCoins(userId);
  },

  getUserBalance: (userId) => {
    const coins = localDB.getUserCoins(userId);
    return coins.filter((c) => !c.spentAt).length;
  },

  issueCoin: (userId, sourceMessageId) => {
    return localDB.issueCoin(userId, sourceMessageId);
  },

  spendCoin: (coinId, spentTo) => {
    const { currentUserId } = get();
    if (!currentUserId) {
      return false;
    }

    const success = localDB.spendCoin(currentUserId, coinId, spentTo);
    if (success) {
      // カレンダーにsunflowerを記録
      get().logCalendarAction('sunflower');
    }

    return success;
  },

  // Bloom actions
  addBloom: (userId, bloomData) => {
    const bloom: Bloom = {
      id: localDB.generateBloomId(),
      fromUserId: bloomData.fromUserId,
      toUserId: bloomData.toUserId,
      kind: bloomData.kind,
      createdAt: new Date().toISOString(),
    };
    localDB.addBloom(userId, bloom);
    return bloom;
  },

  // User actions
  getAllUsers: () => {
    return localDB.getAllUsers();
  },

  connectWithUser: (targetUserId) => {
    const { currentUserId } = get();
    if (!currentUserId) {
      console.error('User must be logged in to connect');
      return;
    }

    if (currentUserId === targetUserId) {
      console.error('Cannot connect with yourself');
      return;
    }

    const currentUser = localDB.getUser(currentUserId);
    const targetUser = localDB.getUser(targetUserId);

    if (!currentUser || !targetUser) {
      console.error('User not found');
      return;
    }

    // 現在のユーザーのconnectedUsersを初期化
    if (!currentUser.connectedUsers) {
      currentUser.connectedUsers = [];
    }

    // まだつながっていない場合のみ追加
    if (!currentUser.connectedUsers.includes(targetUserId)) {
      currentUser.connectedUsers.push(targetUserId);
      localDB.saveUser(currentUser);
    }

    // 相手側も相互リンク（軽い関係性）
    if (!targetUser.connectedUsers) {
      targetUser.connectedUsers = [];
    }

    if (!targetUser.connectedUsers.includes(currentUserId)) {
      targetUser.connectedUsers.push(currentUserId);
      localDB.saveUser(targetUser);
    }
  },

  isConnectedWithUser: (userId1, userId2) => {
    const user1 = localDB.getUser(userId1);
    if (!user1 || !user1.connectedUsers) {
      return false;
    }
    return user1.connectedUsers.includes(userId2);
  },

  // Mission actions
  completeMission: (missionId) => {
    const { currentUserId } = get();
    if (!currentUserId) {
      return;
    }

    const user = localDB.getUser(currentUserId);
    if (!user) {
      return;
    }

    const today = getTodayString();
    if (user.missions.today !== today) {
      // 新しい日になったらリセット
      user.missions = {
        today,
        completedIds: [],
      };
    }

    if (!user.missions.completedIds.includes(missionId)) {
      user.missions.completedIds.push(missionId);
      localDB.saveUser(user);
    }
  },

  // Calendar actions
  logCalendarAction: (flower) => {
    const { currentUserId } = get();
    if (!currentUserId) {
      return;
    }

    localDB.logCalendarAction(currentUserId, flower);
  },
}));

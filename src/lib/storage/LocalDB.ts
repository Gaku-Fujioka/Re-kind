import type {
  LocalDBSchema,
  User,
  Post,
  Encouragement,
  KindCoin,
  Bloom,
  BloomKind,
  UserId,
  PostId,
  MessageId,
  CoinId,
  DateISO,
} from '../types';
import { getTodayString } from '../utils/date';

const STORAGE_KEY = 'rekind_db';

// ID生成
const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ストレージ層の抽象化インターフェース
export interface StorageAdapter {
  get(): LocalDBSchema;
  set(data: LocalDBSchema): void;
  clear(): void;
}

// localStorage実装
export class LocalDB implements StorageAdapter {
  private getDefaultSchema(): LocalDBSchema {
    return {
      users: [],
      posts: [],
    };
  }

  get(): LocalDBSchema {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return this.getDefaultSchema();
      }
      const parsed = JSON.parse(stored);
      return {
        users: parsed.users || [],
        posts: parsed.posts || [],
      };
    } catch (error) {
      console.error('Failed to load data:', error);
      return this.getDefaultSchema();
    }
  }

  set(data: LocalDBSchema): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  // ID発行
  generateUserId(): UserId {
    return generateId('user');
  }

  generatePostId(): PostId {
    return generateId('post');
  }

  generateMessageId(): MessageId {
    return generateId('msg');
  }

  generateCoinId(): CoinId {
    return generateId('coin');
  }

  generateBloomId(): string {
    return generateId('bloom');
  }

  // User操作
  saveUser(user: User): void {
    const data = this.get();
    const index = data.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      data.users[index] = user;
    } else {
      data.users.push(user);
    }
    this.set(data);
  }

  getUser(userId: UserId): User | undefined {
    const data = this.get();
    return data.users.find((u) => u.id === userId);
  }

  getAllUsers(): User[] {
    return this.get().users;
  }

  // Post操作
  savePost(post: Post): void {
    const data = this.get();
    const index = data.posts.findIndex((p) => p.id === post.id);
    if (index >= 0) {
      data.posts[index] = post;
    } else {
      data.posts.push(post);
    }
    this.set(data);
  }

  getPost(postId: PostId): Post | undefined {
    const data = this.get();
    return data.posts.find((p) => p.id === postId);
  }

  getAllPosts(): Post[] {
    return this.get().posts;
  }

  getUserPosts(userId: UserId): Post[] {
    const data = this.get();
    return data.posts.filter((p) => p.authorId === userId);
  }

  // Encouragement操作
  saveEncouragement(postId: PostId, encouragement: Encouragement): void {
    const post = this.getPost(postId);
    if (!post) {
      console.error(`Post ${postId} not found`);
      return;
    }

    const index = post.encouragements.findIndex((e) => e.id === encouragement.id);
    if (index >= 0) {
      post.encouragements[index] = encouragement;
    } else {
      post.encouragements.push(encouragement);
    }

    this.savePost(post);
  }

  getEncouragement(postId: PostId, messageId: MessageId): Encouragement | undefined {
    const post = this.getPost(postId);
    return post?.encouragements.find((e) => e.id === messageId);
  }

  // ユーザーが送った励ましを取得
  getUserEncouragements(userId: UserId): Encouragement[] {
    const posts = this.getAllPosts();
    const encouragements: Encouragement[] = [];
    
    for (const post of posts) {
      for (const enc of post.encouragements) {
        if (enc.fromUserId === userId) {
          encouragements.push(enc);
        }
      }
    }
    
    // 作成日時でソート（新しい順）
    return encouragements.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // KindCoin操作
  issueCoin(
    ownerId: UserId,
    sourceMessageId: MessageId,
    coinId?: CoinId
  ): KindCoin {
    const coin: KindCoin = {
      id: coinId || this.generateCoinId(),
      ownerId,
      sourceMessageId,
      createdAt: new Date().toISOString(),
      amount: 1,
    };

    const user = this.getUser(ownerId);
    if (!user) {
      console.error(`User ${ownerId} not found`);
      throw new Error(`User ${ownerId} not found`);
    }

    user.wallet.push(coin);
    this.saveUser(user);

    return coin;
  }

  spendCoin(
    userId: UserId,
    coinId: CoinId,
    spentTo: 'donation' | 'gift'
  ): boolean {
    const user = this.getUser(userId);
    if (!user) {
      return false;
    }

    const coinIndex = user.wallet.findIndex(
      (c) => c.id === coinId && !c.spentAt
    );
    if (coinIndex < 0) {
      return false;
    }

    user.wallet[coinIndex] = {
      ...user.wallet[coinIndex],
      spentAt: new Date().toISOString(),
      spentTo,
    };

    this.saveUser(user);
    return true;
  }

  getUserCoins(userId: UserId): KindCoin[] {
    const user = this.getUser(userId);
    return user?.wallet || [];
  }

  getUserAvailableCoins(userId: UserId): KindCoin[] {
    const coins = this.getUserCoins(userId);
    return coins.filter((c) => !c.spentAt);
  }

  // Bloom操作
  addBloom(userId: UserId, bloom: Bloom): void {
    const user = this.getUser(userId);
    if (!user) {
      console.error(`User ${userId} not found`);
      return;
    }

    // 既に同じIDの花がないかチェック
    const existingIndex = user.garden.findIndex((b) => b.id === bloom.id);
    if (existingIndex >= 0) {
      user.garden[existingIndex] = bloom;
    } else {
      user.garden.push(bloom);
    }
    this.saveUser(user);
  }

  getUserBlooms(userId: UserId): Bloom[] {
    const user = this.getUser(userId);
    return user?.garden || [];
  }

  // カレンダー操作
  logCalendarAction(
    userId: UserId,
    flower: 'daisy' | 'tulip' | 'sunflower' | 'lotus' | 'blossom'
  ): void {
    const user = this.getUser(userId);
    if (!user) {
      console.error(`User ${userId} not found`);
      return;
    }

    const today = getTodayString();

    // カレンダーを初期化（存在しない場合）
    if (!user.calendar) {
      user.calendar = {
        byDate: {},
        streak: 0,
      };
    }

    // 今日の花を追加
    if (!user.calendar.byDate[today]) {
      user.calendar.byDate[today] = [];
    }
    user.calendar.byDate[today].push(flower);

    // 連続記録を更新
    const lastActionDate = user.calendar.lastActionDate;
    if (lastActionDate) {
      const lastDate = new Date(lastActionDate).toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      if (lastDate === yesterday || lastDate === today) {
        user.calendar.streak = (user.calendar.streak || 0) + 1;
      } else {
        user.calendar.streak = 1;
      }
    } else {
      user.calendar.streak = 1;
    }

    user.calendar.lastActionDate = new Date().toISOString();

    this.saveUser(user);
  }

  // 初期データ投入
  seed(): void {
    const data = this.get();
    if (data.users.length > 0 || data.posts.length > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    const now = new Date().toISOString();
    const db = this;

    // ユーザーを作成
    const user1Id = db.generateUserId();
    const user2Id = db.generateUserId();
    const user3Id = db.generateUserId();
    const user4Id = db.generateUserId();

    const users: User[] = [
      {
        id: user1Id,
        name: 'やさしい手 #1234',
        avatarSeed: 'seed1',
        garden: [],
        wallet: [],
        missions: {
          today: getTodayString(),
          completedIds: [],
        },
        calendar: {
          byDate: {},
          streak: 0,
        },
      },
      {
        id: user2Id,
        name: 'やさしい手 #5678',
        avatarSeed: 'seed2',
        garden: [],
        wallet: [],
        missions: {
          today: getTodayString(),
          completedIds: [],
        },
        calendar: {
          byDate: {},
          streak: 0,
        },
      },
      {
        id: user3Id,
        name: 'やさしい手 #9012',
        avatarSeed: 'seed3',
        garden: [],
        wallet: [],
        missions: {
          today: getTodayString(),
          completedIds: [],
        },
        calendar: {
          byDate: {},
          streak: 0,
        },
      },
      {
        id: user4Id,
        name: 'やさしい手 #3456',
        avatarSeed: 'seed4',
        garden: [],
        wallet: [],
        missions: {
          today: getTodayString(),
          completedIds: [],
        },
        calendar: {
          byDate: {},
          streak: 0,
        },
      },
    ];

    users.forEach((user) => db.saveUser(user));

    // 投稿を作成
    const post1Id = db.generatePostId();
    const post2Id = db.generatePostId();
    const post3Id = db.generatePostId();

    const posts: Post[] = [
      {
        id: post1Id,
        authorId: user1Id,
        text: '今日は少し疲れました。でも、頑張って前向きにいきたいです。\n応援してくれる人がいると思うと、心が温かくなります。',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        encouragements: [],
        isResolved: false,
      },
      {
        id: post2Id,
        authorId: user2Id,
        text: '最近、新しいことに挑戦しています。\n最初は不安でしたが、少しずつ楽しくなってきました。\n同じように頑張っている人とつながれたら嬉しいです。',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        encouragements: [],
        isResolved: false,
      },
      {
        id: post3Id,
        authorId: user3Id,
        text: '誰かに優しくしてもらったことを思い出しました。\nその優しさが、今の私の支えになっています。\nありがとう、という言葉は本当に大切ですね。',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        encouragements: [],
        isResolved: false,
      },
    ];

    posts.forEach((post) => db.savePost(post));

    console.log('✅ Database seeded successfully');
  }
}

// ストレージインスタンス（将来的にAPIに差し替え可能）
export const localDB = new LocalDB();

import type {
  User,
  Post,
  Encouragement,
  KindCoinTransaction,
  ThankYouBloom,
  EmpathyCalendarEntry,
  KindMission,
  AppState,
} from '../types';
import { storage } from './storage';

// リポジトリパターンでデータアクセスを抽象化
export class Repository {
  private state: AppState;

  constructor() {
    this.state = storage.load();
  }

  private save(): void {
    storage.save(this.state);
  }

  // User
  getUsers(): User[] {
    return [...this.state.users];
  }

  getUser(id: string): User | undefined {
    return this.state.users.find((u) => u.id === id);
  }

  getCurrentUser(): User | undefined {
    if (!this.state.currentUserId) return undefined;
    return this.getUser(this.state.currentUserId);
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    this.state.users.push(newUser);
    this.save();
    return newUser;
  }

  setCurrentUser(userId: string | null): void {
    this.state.currentUserId = userId;
    this.save();
  }

  // Post
  getPosts(): Post[] {
    return [...this.state.posts].sort((a, b) => b.createdAt - a.createdAt);
  }

  getPost(id: string): Post | undefined {
    return this.state.posts.find((p) => p.id === id);
  }

  getUserPosts(userId: string): Post[] {
    return this.state.posts
      .filter((p) => p.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  createPost(post: Omit<Post, 'id' | 'createdAt'>): Post {
    const newPost: Post = {
      ...post,
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    this.state.posts.push(newPost);
    this.save();
    return newPost;
  }

  // Encouragement
  getEncouragements(): Encouragement[] {
    return [...this.state.encouragements];
  }

  getPostEncouragements(postId: string): Encouragement[] {
    return this.state.encouragements
      .filter((e) => e.postId === postId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  createEncouragement(
    encouragement: Omit<Encouragement, 'id' | 'createdAt' | 'thanked'>
  ): Encouragement {
    const newEncouragement: Encouragement = {
      ...encouragement,
      id: `enc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      thanked: false,
    };
    this.state.encouragements.push(newEncouragement);
    this.save();
    return newEncouragement;
  }

  thankEncouragement(encouragementId: string): void {
    const enc = this.state.encouragements.find((e) => e.id === encouragementId);
    if (enc) {
      enc.thanked = true;
      this.save();
    }
  }

  // KindCoin
  getUserBalance(userId: string): number {
    const received = this.state.transactions
      .filter((t) => t.toUserId === userId)
      .reduce((sum, t) => sum + t.amount, 0);
    const sent = this.state.transactions
      .filter((t) => t.fromUserId === userId)
      .reduce((sum, t) => sum + t.amount, 0);
    return received - sent;
  }

  getTransactions(): KindCoinTransaction[] {
    return [...this.state.transactions].sort(
      (a, b) => b.createdAt - a.createdAt
    );
  }

  getUserTransactions(userId: string): KindCoinTransaction[] {
    return this.state.transactions
      .filter((t) => t.fromUserId === userId || t.toUserId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  createTransaction(
    transaction: Omit<KindCoinTransaction, 'id' | 'createdAt'>
  ): KindCoinTransaction {
    const newTransaction: KindCoinTransaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    this.state.transactions.push(newTransaction);
    this.save();
    return newTransaction;
  }

  // Thank You Bloom
  getBlooms(): ThankYouBloom[] {
    return [...this.state.blooms];
  }

  getUserBlooms(userId: string): ThankYouBloom[] {
    return this.state.blooms
      .filter((b) => b.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  createBloom(bloom: Omit<ThankYouBloom, 'id' | 'createdAt'>): ThankYouBloom {
    const newBloom: ThankYouBloom = {
      ...bloom,
      id: `bloom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    this.state.blooms.push(newBloom);
    this.save();
    return newBloom;
  }

  // Empathy Calendar
  getCalendarEntries(): EmpathyCalendarEntry[] {
    return [...this.state.calendarEntries];
  }

  getUserCalendarEntries(userId: string): EmpathyCalendarEntry[] {
    return this.state.calendarEntries.filter((e) => e.userId === userId);
  }

  getCalendarEntry(userId: string, date: string): EmpathyCalendarEntry | undefined {
    return this.state.calendarEntries.find(
      (e) => e.userId === userId && e.date === date
    );
  }

  incrementCalendarEntry(userId: string, date: string): void {
    const existing = this.getCalendarEntry(userId, date);
    if (existing) {
      existing.count += 1;
    } else {
      this.state.calendarEntries.push({
        userId,
        date,
        count: 1,
      });
    }
    this.save();
  }

  // Kind Mission
  getMissions(): KindMission[] {
    return [...this.state.missions];
  }

  getUserMissions(userId: string): KindMission[] {
    return this.state.missions
      .filter((m) => m.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  getTodayMissions(userId: string): KindMission[] {
    const today = new Date().toISOString().split('T')[0];
    return this.state.missions.filter(
      (m) => m.userId === userId && m.date === today
    );
  }

  createMission(mission: Omit<KindMission, 'id' | 'createdAt'>): KindMission {
    const newMission: KindMission = {
      ...mission,
      id: `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    this.state.missions.push(newMission);
    this.save();
    return newMission;
  }

  completeMission(missionId: string): void {
    const mission = this.state.missions.find((m) => m.id === missionId);
    if (mission) {
      mission.completed = true;
      this.save();
    }
  }
}

// シングルトンインスタンス
export const repository = new Repository();


import type { AppState } from '../types';

const STORAGE_KEY = 'rekind_app_state';
const DEFAULT_STATE: AppState = {
  users: [],
  posts: [],
  encouragements: [],
  transactions: [],
  blooms: [],
  calendarEntries: [],
  missions: [],
  currentUserId: null,
};

// ストレージ層の抽象化インターフェース
export interface StorageAdapter {
  load(): AppState;
  save(state: AppState): void;
  clear(): void;
}

// localStorage実装
export class LocalStorageAdapter implements StorageAdapter {
  load(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { ...DEFAULT_STATE };
      }
      const parsed = JSON.parse(stored);
      // デフォルト値とマージして、新しいフィールドが追加された場合に対応
      return {
        ...DEFAULT_STATE,
        ...parsed,
        users: parsed.users || DEFAULT_STATE.users,
        posts: parsed.posts || DEFAULT_STATE.posts,
        encouragements: parsed.encouragements || DEFAULT_STATE.encouragements,
        transactions: parsed.transactions || DEFAULT_STATE.transactions,
        blooms: parsed.blooms || DEFAULT_STATE.blooms,
        calendarEntries:
          parsed.calendarEntries || DEFAULT_STATE.calendarEntries,
        missions: parsed.missions || DEFAULT_STATE.missions,
        currentUserId: parsed.currentUserId || DEFAULT_STATE.currentUserId,
      };
    } catch (error) {
      console.error('Failed to load state:', error);
      return { ...DEFAULT_STATE };
    }
  }

  save(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear state:', error);
    }
  }
}

// ストレージインスタンス（将来的にAPIに差し替え可能）
export const storage: StorageAdapter = new LocalStorageAdapter();


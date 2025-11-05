import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageAdapter } from '../storage/storage';
import type { AppState } from '../types';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    adapter = new LocalStorageAdapter();
    localStorage.clear();
  });

  it('should load default state when storage is empty', () => {
    const state = adapter.load();
    expect(state.users).toEqual([]);
    expect(state.posts).toEqual([]);
    expect(state.currentUserId).toBeNull();
  });

  it('should save and load state', () => {
    const state: AppState = {
      users: [{ id: '1', name: 'Test', createdAt: Date.now() }],
      posts: [],
      encouragements: [],
      transactions: [],
      blooms: [],
      calendarEntries: [],
      missions: [],
      currentUserId: '1',
    };

    adapter.save(state);
    const loaded = adapter.load();

    expect(loaded.users).toHaveLength(1);
    expect(loaded.users[0].name).toBe('Test');
    expect(loaded.currentUserId).toBe('1');
  });

  it('should clear state', () => {
    const state: AppState = {
      users: [{ id: '1', name: 'Test', createdAt: Date.now() }],
      posts: [],
      encouragements: [],
      transactions: [],
      blooms: [],
      calendarEntries: [],
      missions: [],
      currentUserId: '1',
    };

    adapter.save(state);
    adapter.clear();
    const loaded = adapter.load();

    expect(loaded.users).toEqual([]);
    expect(loaded.currentUserId).toBeNull();
  });
});


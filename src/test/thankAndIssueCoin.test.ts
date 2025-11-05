import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../app/store/useAppStore';
import { localDB } from '../lib/storage/LocalDB';
import type { User, Post, Encouragement } from '../lib/types';

describe('thankAndIssueCoin', () => {
  beforeEach(() => {
    // テスト前にデータをクリア
    localDB.clear();
    
    // テスト用ユーザーを作成
    const userA: User = {
      id: 'user_a',
      name: 'ユーザーA',
      garden: [],
      wallet: [],
      missions: {
        today: '2024-01-01',
        completedIds: [],
      },
      calendar: {
        byDate: {},
        streak: 0,
      },
    };

    const userB: User = {
      id: 'user_b',
      name: 'ユーザーB',
      garden: [],
      wallet: [],
      missions: {
        today: '2024-01-01',
        completedIds: [],
      },
      calendar: {
        byDate: {},
        streak: 0,
      },
    };

    localDB.saveUser(userA);
    localDB.saveUser(userB);

    // テスト用投稿を作成
    const post: Post = {
      id: 'post_1',
      authorId: 'user_a',
      text: 'テスト投稿',
      createdAt: new Date().toISOString(),
      encouragements: [],
      isResolved: false,
    };

    localDB.savePost(post);

    // テスト用励ましを作成
    const encouragement: Encouragement = {
      id: 'enc_1',
      postId: 'post_1',
      fromUserId: 'user_b',
      toUserId: 'user_a',
      text: 'テスト励ましメッセージ',
      createdAt: new Date().toISOString(),
      thanked: false,
    };

    localDB.saveEncouragement('post_1', encouragement);

    // ストアを初期化
    useAppStore.getState().initialize();
    useAppStore.getState().setCurrentUser('user_a');
  });

  it('正常にコインと花を発行できる', () => {
    const store = useAppStore.getState();
    
    const result = store.thankAndIssueCoin('post_1', 'enc_1');

    expect(result).not.toBeNull();
    expect(result?.coin).toBeDefined();
    expect(result?.bloom).toBeDefined();
    expect(result?.coin.ownerId).toBe('user_b');
    expect(result?.bloom.toUserId).toBe('user_b');
    expect(result?.bloom.fromUserId).toBe('user_a');
  });

  it('励ましに感謝済みマークがつく', () => {
    const store = useAppStore.getState();
    
    store.thankAndIssueCoin('post_1', 'enc_1');

    const post = localDB.getPost('post_1');
    const encouragement = post?.encouragements.find((e) => e.id === 'enc_1');
    
    expect(encouragement?.thanked).toBe(true);
    expect(encouragement?.coinIssued).toBeDefined();
  });

  it('ユーザーBのウォレットにコインが追加される', () => {
    const store = useAppStore.getState();
    
    const beforeCoins = store.getUserCoins('user_b').length;
    
    store.thankAndIssueCoin('post_1', 'enc_1');

    const afterCoins = store.getUserCoins('user_b').length;
    
    expect(afterCoins).toBe(beforeCoins + 1);
  });

  it('ユーザーBのプロフィールに花が追加される', () => {
    const store = useAppStore.getState();
    
    const userB = localDB.getUser('user_b');
    const beforeBlooms = userB?.garden.length || 0;
    
    store.thankAndIssueCoin('post_1', 'enc_1');

    const userBAfter = localDB.getUser('user_b');
    const afterBlooms = userBAfter?.garden.length || 0;
    
    expect(afterBlooms).toBe(beforeBlooms + 1);
  });

  it('ログインしていない場合はnullを返す', () => {
    const store = useAppStore.getState();
    store.setCurrentUser(null);

    const result = store.thankAndIssueCoin('post_1', 'enc_1');

    expect(result).toBeNull();
  });

  it('投稿が存在しない場合はnullを返す', () => {
    const store = useAppStore.getState();

    const result = store.thankAndIssueCoin('nonexistent_post', 'enc_1');

    expect(result).toBeNull();
  });

  it('励ましが存在しない場合はnullを返す', () => {
    const store = useAppStore.getState();

    const result = store.thankAndIssueCoin('post_1', 'nonexistent_enc');

    expect(result).toBeNull();
  });

  it('投稿者以外は感謝できない', () => {
    const store = useAppStore.getState();
    store.setCurrentUser('user_b'); // 投稿者ではないユーザー

    const result = store.thankAndIssueCoin('post_1', 'enc_1');

    expect(result).toBeNull();
  });

  it('既に感謝済みの場合はnullを返す', () => {
    const store = useAppStore.getState();
    
    // 一度感謝する
    store.thankAndIssueCoin('post_1', 'enc_1');
    
    // 再度感謝しようとする
    const result = store.thankAndIssueCoin('post_1', 'enc_1');

    expect(result).toBeNull();
  });

  it('カレンダーにlotusが記録される', () => {
    const store = useAppStore.getState();
    const today = new Date().toISOString().split('T')[0];
    
    store.thankAndIssueCoin('post_1', 'enc_1');

    const userAAfter = localDB.getUser('user_a');
    const flowers = userAAfter?.calendar?.byDate[today] || [];
    
    expect(flowers).toContain('lotus');
  });
});


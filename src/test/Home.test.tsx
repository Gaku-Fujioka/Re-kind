import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '../pages/Home';
import { useAppStore } from '../app/store/useAppStore';
import { localDB } from '../lib/storage/LocalDB';
import type { User, Post } from '../lib/types';

// テスト用ラッパー
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('Home Component', () => {
  beforeEach(() => {
    localDB.clear();
    
    // テスト用ユーザーを作成
    const user: User = {
      id: 'test_user',
      name: 'テストユーザー',
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

    localDB.saveUser(user);

    // テスト用投稿を作成
    const post: Post = {
      id: 'test_post',
      authorId: 'test_user',
      text: 'テスト投稿内容',
      createdAt: new Date().toISOString(),
      encouragements: [],
      isResolved: false,
    };

    localDB.savePost(post);

    // ストアを初期化
    useAppStore.getState().initialize();
    useAppStore.getState().setCurrentUser('test_user');
  });

  it('正常にレンダリングされる', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // タイトルが表示される
    expect(screen.getByText('花壇Feed')).toBeInTheDocument();
  });

  it('投稿フォームが表示される', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // 投稿フォームが表示される
    const textarea = screen.getByPlaceholderText(/今の気持ちや悩みを共有してください/i);
    expect(textarea).toBeInTheDocument();
  });

  it('投稿が表示される', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // 投稿内容が表示される
    expect(screen.getByText('テスト投稿内容')).toBeInTheDocument();
  });

  it('投稿がない場合はメッセージが表示される', () => {
    localDB.clear();
    useAppStore.getState().initialize();
    
    const user: User = {
      id: 'test_user',
      name: 'テストユーザー',
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

    localDB.saveUser(user);
    useAppStore.getState().setCurrentUser('test_user');

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText(/まだ投稿がありません/i)).toBeInTheDocument();
  });
});


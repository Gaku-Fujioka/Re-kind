import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Calendar } from '../pages/Calendar';
import { useAppStore } from '../app/store/useAppStore';
import { localDB } from '../lib/storage/LocalDB';
import type { User } from '../lib/types';

// テスト用ラッパー
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('Calendar Component', () => {
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

    // ストアを初期化
    useAppStore.getState().initialize();
    useAppStore.getState().setCurrentUser('test_user');
  });

  it('正常にレンダリングされる', () => {
    render(
      <TestWrapper>
        <Calendar />
      </TestWrapper>
    );

    // タイトルが表示される
    expect(screen.getByText('共感カレンダー')).toBeInTheDocument();
  });

  it('ストリークが表示される', () => {
    render(
      <TestWrapper>
        <Calendar />
      </TestWrapper>
    );

    // ストリークセクションが表示される
    expect(screen.getByText(/あなたの優しさストリーク/i)).toBeInTheDocument();
  });

  it('カレンダーグリッドが表示される', () => {
    render(
      <TestWrapper>
        <Calendar />
      </TestWrapper>
    );

    // 曜日ヘッダーが表示される
    expect(screen.getByText('日')).toBeInTheDocument();
    expect(screen.getByText('月')).toBeInTheDocument();
  });

  it('ログインしていない場合はメッセージが表示される', () => {
    useAppStore.getState().setCurrentUser(null);

    render(
      <TestWrapper>
        <Calendar />
      </TestWrapper>
    );

    expect(screen.getByText(/ログインしてください/i)).toBeInTheDocument();
  });
});


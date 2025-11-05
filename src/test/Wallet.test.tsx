import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Wallet } from '../pages/Wallet';
import { useAppStore } from '../app/store/useAppStore';
import { localDB } from '../lib/storage/LocalDB';
import type { User, KindCoin } from '../lib/types';

// テスト用ラッパー
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('Wallet Component', () => {
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
        <Wallet />
      </TestWrapper>
    );

    // タイトルが表示される
    expect(screen.getByText('ウォレット')).toBeInTheDocument();
  });

  it('保有KindCoinが表示される', () => {
    render(
      <TestWrapper>
        <Wallet />
      </TestWrapper>
    );

    // 保有KindCoinセクションが表示される
    expect(screen.getByText(/保有KindCoin/i)).toBeInTheDocument();
  });

  it('コインがない場合は0枚と表示される', () => {
    render(
      <TestWrapper>
        <Wallet />
      </TestWrapper>
    );

    // 0枚と表示される
    expect(screen.getByText(/0枚/i)).toBeInTheDocument();
  });

  it('コインがある場合は枚数が表示される', () => {
    // コインを追加
    const coin: KindCoin = {
      id: 'coin_1',
      ownerId: 'test_user',
      sourceMessageId: 'msg_1',
      createdAt: new Date().toISOString(),
      amount: 1,
    };

    const user = localDB.getUser('test_user');
    if (user) {
      user.wallet.push(coin);
      localDB.saveUser(user);
    }

    render(
      <TestWrapper>
        <Wallet />
      </TestWrapper>
    );

    // 1枚と表示される
    expect(screen.getByText(/1枚/i)).toBeInTheDocument();
  });

  it('ログインしていない場合はメッセージが表示される', () => {
    useAppStore.getState().setCurrentUser(null);

    render(
      <TestWrapper>
        <Wallet />
      </TestWrapper>
    );

    expect(screen.getByText(/ログインしてください/i)).toBeInTheDocument();
  });
});


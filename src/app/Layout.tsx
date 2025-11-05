import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { applyTheme, getThemeMode } from '../lib/theme';

export const Layout = () => {
  const initialize = useAppStore((state) => state.initialize);

  useEffect(() => {
    try {
      // テーマを初期化
      applyTheme(getThemeMode());

      // アプリを初期化（デモデータの投入とユーザー設定）
      initialize();
    } catch (error) {
      console.error('Layout initialization error:', error);
    }
  }, [initialize]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl pt-16 pb-20 md:pb-6">
        <Outlet />
      </main>
      <Navigation />
      <Footer />
    </div>
  );
};


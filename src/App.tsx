import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { repository } from './storage/repository';
import { useCurrentUser } from './hooks/useRepository';
import './styles/theme.css';
import './styles/components.css';

type Page = 'home' | 'profile';

function App() {
  const { user: currentUser, refresh } = useCurrentUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    // 初回起動時にデモユーザーがない場合は作成
    if (!currentUser) {
      const users = repository.getUsers();
      if (users.length === 0) {
        // デモユーザーを作成
        const demoUser = repository.createUser({ name: 'デモユーザー' });
        repository.setCurrentUser(demoUser.id);
        refresh();
      }
    }
  }, [currentUser, refresh]);

  const handleLogin = (name: string) => {
    const user = repository.createUser({ name });
    repository.setCurrentUser(user.id);
    refresh();
  };

  return (
    <div>
      <Header onLogin={() => setShowLoginModal(true)} />
      <nav
        style={{
          backgroundColor: 'var(--color-background)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--spacing-sm) 0',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <div className="container">
          <div className="flex gap-md">
            <button
              onClick={() => setCurrentPage('home')}
              className="btn-text"
              aria-current={currentPage === 'home' ? 'page' : undefined}
            >
              ホーム
            </button>
            <button
              onClick={() => setCurrentPage('profile')}
              className="btn-text"
              aria-current={currentPage === 'profile' ? 'page' : undefined}
            >
              プロフィール
            </button>
          </div>
        </div>
      </nav>
      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'profile' && <ProfilePage />}
      </main>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;


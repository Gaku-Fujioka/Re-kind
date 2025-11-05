import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../app/store/useAppStore';
import { Button } from '../ui/Button';
import { FlowerIcon } from '../icons/FlowerIcon';
import { Modal } from '../ui/Modal';
import { LoginForm } from '../auth/LoginForm';
import { ThemeToggle } from '../ui/ThemeToggle';
import { FontSizeControl } from '../ui/FontSizeControl';
import { useState } from 'react';
import { cn } from '../../lib/theme';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/compose', label: 'Compose' },
  { path: '/calendar', label: 'Calendar' },
  { path: '/wallet', label: 'Wallet' },
];

export const Header = () => {
  const location = useLocation();
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const getUserCoins = useAppStore((state) => state.getUserCoins);
  const balance = currentUser
    ? getUserCoins(currentUser.id).filter((c) => !c.spentAt).length
    : 0;
  const [showLoginModal, setShowLoginModal] = useState(false);

  const getProfilePath = () => {
    return currentUser ? `/profile/${currentUser.id}` : '/';
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <FlowerIcon size={32} color="#FFB347" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Re:kind</h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  優しさを再点火するSNS
                </p>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary bg-accent'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            {currentUser && (
              <Link
                to={getProfilePath()}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname.startsWith('/profile')
                    ? 'text-primary bg-accent'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                )}
                aria-current={location.pathname.startsWith('/profile') ? 'page' : undefined}
              >
                Profile
              </Link>
            )}
          </nav>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <FontSizeControl />
            {currentUser ? (
              <>
                <div className="hidden lg:block text-sm text-neutral">
                  <span className="sr-only">ユーザー名: </span>
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-full text-sm font-medium">
                  <FlowerIcon size={16} color="#ffffff" />
                  <span className="hidden sm:inline">KindCoin: </span>
                  <span>{balance}</span>
                </div>
              </>
            ) : (
              <Button onClick={() => setShowLoginModal(true)}>ログイン</Button>
            )}
          </nav>
        </div>
      </div>
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="ログイン"
      >
        <LoginForm onSuccess={() => setShowLoginModal(false)} />
      </Modal>
    </header>
  );
};


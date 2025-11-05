import React from 'react';
import { useCurrentUser, useUserBalance } from '../hooks/useRepository';
import { KindCoinDisplay } from './KindCoinDisplay';
import { Button } from './Button';
import { FlowerIcon } from './FlowerIcon';

interface HeaderProps {
  onLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogin }) => {
  const { user, refresh } = useCurrentUser();
  const { balance } = useUserBalance(user?.id || '');

  return (
    <header
      style={{
        backgroundColor: 'var(--color-background)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-md) 0',
        marginBottom: 'var(--spacing-lg)',
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-md">
            <FlowerIcon size={32} color="#FFB347" />
            <h1
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'bold',
                color: 'var(--color-primary)',
              }}
            >
              Re:kind
            </h1>
            <span className="text-sm text-light">優しさを再点火するSNS</span>
          </div>
          <nav className="flex items-center gap-md">
            {user ? (
              <>
                <div className="text-sm">
                  <span className="sr-only">ユーザー名: </span>
                  {user.name}
                </div>
                <KindCoinDisplay balance={balance} />
              </>
            ) : (
              onLogin && <Button onClick={onLogin}>ログイン</Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};


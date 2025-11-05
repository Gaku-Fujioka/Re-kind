import React from 'react';
import { Card } from './Card';
import { useUserBlooms, useUserCalendar } from '../hooks/useRepository';
import { ThankYouBloomItem } from './ThankYouBloom';
import { EmpathyCalendar } from './EmpathyCalendar';
import type { User } from '../types';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const { blooms } = useUserBlooms(user.id);
  const { entries } = useUserCalendar(user.id);

  return (
    <div className="grid grid-2 gap-lg">
      <Card>
        <h2 className="mb-md" style={{ fontSize: 'var(--font-size-xl)' }}>
          プロフィール
        </h2>
        <div className="mb-md">
          <div
            className="flex items-center justify-center mb-md"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-secondary)',
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'bold',
              margin: '0 auto',
            }}
            aria-label={`${user.name}のアバター`}
          >
            {user.name[0]}
          </div>
          <div className="text-center">
            <h3 style={{ fontSize: 'var(--font-size-xl)' }}>{user.name}</h3>
            <div className="text-sm text-light">
              感謝の花: {blooms.length}個
            </div>
          </div>
        </div>
      </Card>

      <EmpathyCalendar entries={entries} userId={user.id} />

      <Card style={{ gridColumn: '1 / -1' }}>
        <h2 className="mb-md" style={{ fontSize: 'var(--font-size-xl)' }}>
          Thank You Bloom
        </h2>
        {blooms.length === 0 ? (
          <div className="text-center text-light py-lg">
            まだ花は咲いていません
          </div>
        ) : (
          <div className="grid gap-sm">
            {blooms.slice(0, 10).map((bloom) => (
              <ThankYouBloomItem key={bloom.id} bloom={bloom} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};


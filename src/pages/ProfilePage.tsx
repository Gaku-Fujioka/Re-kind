import React, { useState } from 'react';
import { useCurrentUser } from '../hooks/useRepository';
import { Profile } from '../components/Profile';
import { FlowerGift } from '../components/FlowerGift';
import { Button } from '../components/Button';
import { FlowerIcon } from '../components/FlowerIcon';

export const ProfilePage: React.FC = () => {
  const { user: currentUser } = useCurrentUser();
  const [showFlowerGift, setShowFlowerGift] = useState(false);

  if (!currentUser) {
    return (
      <div className="container">
        <div className="text-center py-2xl">
          <p className="text-light">ログインしてください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-lg flex justify-between items-center">
        <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>プロフィール</h1>
        <Button
          variant="outline"
          onClick={() => setShowFlowerGift(true)}
          aria-label="花を贈る"
        >
          <FlowerIcon size={20} /> 花を贈る
        </Button>
      </div>
      <Profile user={currentUser} />
      {showFlowerGift && (
        <FlowerGift
          targetUserId={currentUser.id}
          onClose={() => setShowFlowerGift(false)}
        />
      )}
    </div>
  );
};


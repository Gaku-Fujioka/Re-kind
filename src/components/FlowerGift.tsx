import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { FlowerIcon } from './FlowerIcon';
import { useCurrentUser, useUserBalance } from '../hooks/useRepository';
import { sendFlower } from '../services/kindService';
import { repository } from '../storage/repository';

interface FlowerGiftProps {
  targetUserId: string;
  onClose: () => void;
}

export const FlowerGift: React.FC<FlowerGiftProps> = ({
  targetUserId,
  onClose,
}) => {
  const { user: currentUser, refresh } = useCurrentUser();
  const { balance, refresh: refreshBalance } = useUserBalance(
    currentUser?.id || ''
  );
  const [amount, setAmount] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetUser = repository.getUser(targetUserId);

  if (!currentUser || currentUser.id === targetUserId) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || amount > balance || amount <= 0) return;

    setIsSubmitting(true);
    try {
      const success = sendFlower(currentUser.id, targetUserId, amount);
      if (success) {
        refresh();
        refreshBalance();
        onClose();
      } else {
        alert('残高が不足しています');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="flower-gift-title"
    >
      <Card
        style={{ maxWidth: '400px', width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="flower-gift-title" className="mb-md">
          <FlowerIcon size={24} color="#FFB347" /> 花を贈る
        </h2>
        <div className="mb-md text-sm">
          {targetUser?.name || 'ユーザー'}さんにKindCoinで花を贈ります
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            label="贈るKindCoin"
            type="number"
            min="1"
            max={balance}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            aria-describedby="flower-gift-help"
          />
          <div id="flower-gift-help" className="text-sm text-light mb-md mt-sm">
            現在の残高: {balance} KindCoin
          </div>
          <div className="flex gap-sm">
            <Button
              type="submit"
              disabled={isSubmitting || amount > balance || amount <= 0}
            >
              贈る
            </Button>
            <Button type="button" variant="text" onClick={onClose}>
              キャンセル
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};


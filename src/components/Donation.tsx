import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { FlowerIcon } from './FlowerIcon';
import { useCurrentUser, useUserBalance } from '../hooks/useRepository';
import { donate } from '../services/kindService';

export const Donation: React.FC = () => {
  const { user: currentUser, refresh } = useCurrentUser();
  const { balance, refresh: refreshBalance } = useUserBalance(
    currentUser?.id || ''
  );
  const [amount, setAmount] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || amount > balance || amount <= 0) return;

    setIsSubmitting(true);
    try {
      const success = donate(currentUser.id, amount);
      if (success) {
        refresh();
        refreshBalance();
        alert('寄付が完了しました。ありがとうございます！');
        setAmount(10);
      } else {
        alert('残高が不足しています');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-md" style={{ fontSize: 'var(--font-size-xl)' }}>
        <FlowerIcon size={24} color="#FFB347" /> 寄付（デモ）
      </h2>
      <div className="text-sm text-light mb-md">
        KindCoinを寄付して、優しさの循環を広げましょう
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          label="寄付するKindCoin"
          type="number"
          min="1"
          max={balance}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          aria-describedby="donation-help"
        />
        <div id="donation-help" className="text-sm text-light mb-md mt-sm">
          現在の残高: {balance} KindCoin
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || amount > balance || amount <= 0}
        >
          寄付する
        </Button>
      </form>
    </Card>
  );
};


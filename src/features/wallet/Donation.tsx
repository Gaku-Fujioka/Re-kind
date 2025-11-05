import { useState } from 'react';
import { useAppStore } from '../../app/store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FlowerIcon } from '../../components/icons/FlowerIcon';
import { donate } from '../../lib/services/kindService';

export const Donation = () => {
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const balance = useAppStore((state) =>
    currentUser ? state.getUserBalance(currentUser.id) : 0
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
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FlowerIcon size={24} color="#FFB347" /> 寄付（デモ）
      </h2>
      <div className="text-sm text-gray-500 mb-4">
        KindCoinを寄付して、優しさの循環を広げましょう
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div id="donation-help" className="text-sm text-gray-500">
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


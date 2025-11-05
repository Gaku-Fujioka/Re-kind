import React from 'react';
import { Badge } from './Badge';
import { FlowerIcon } from './FlowerIcon';

interface KindCoinDisplayProps {
  balance: number;
  className?: string;
}

export const KindCoinDisplay: React.FC<KindCoinDisplayProps> = ({
  balance,
  className = '',
}) => {
  return (
    <Badge variant="primary" className={className}>
      <FlowerIcon size={16} color="#ffffff" />
      <span>KindCoin: {balance}</span>
    </Badge>
  );
};


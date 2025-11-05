import React from 'react';
import { FlowerIcon } from './FlowerIcon';
import { formatRelativeTime } from '../utils/date';
import { repository } from '../storage/repository';
import type { ThankYouBloom } from '../types';

interface ThankYouBloomProps {
  bloom: ThankYouBloom;
}

export const ThankYouBloomItem: React.FC<ThankYouBloomProps> = ({ bloom }) => {
  const fromUser = repository.getUser(bloom.fromUserId);

  return (
    <div
      className="flex items-center gap-md p-sm"
      style={{
        backgroundColor: 'var(--color-background-light)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <FlowerIcon size={24} color="#FFB347" />
      <div className="flex-1">
        <div className="text-sm">
          <strong>{fromUser?.name || '匿名'}</strong>さんから花が贈られました
        </div>
        <div className="text-xs text-light">
          {formatRelativeTime(bloom.createdAt)}
        </div>
      </div>
    </div>
  );
};


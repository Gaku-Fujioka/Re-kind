import React from 'react';
import { useAppStore } from '../../app/store/useAppStore';
import { Flower } from '../../components/ui/Flower';
import { cn } from '../../lib/theme';
import type { UserId, Bloom } from '../../lib/types';
import { formatRelativeTime } from '../../lib/utils/date';

interface BloomWallProps {
  userId: UserId;
  className?: string;
}

export const BloomWall: React.FC<BloomWallProps> = ({ userId, className }) => {
  const user = useAppStore((state) => state.getUser(userId));
  const blooms = user?.garden || [];

  if (blooms.length === 0) {
    return (
      <div
        className={cn(
          'p-8 text-center text-gray-400 rounded-lg border-2 border-dashed border-gray-200',
          className
        )}
      >
        <p className="text-sm">まだ花は咲いていません</p>
        <p className="text-xs mt-1">励ましや感謝が届くと、ここに花が咲きます</p>
      </div>
    );
  }

  // 花を種類ごとにグループ化して、4個以上はbouquetとして表示
  const processedBlooms = blooms.map((bloom) => {
    // 同じ種類の花が4個以上あるかチェック
    const sameKindCount = blooms.filter((b) => b.kind === bloom.kind).length;
    const displayKind = sameKindCount >= 4 ? 'bouquet' : bloom.kind;
    return { ...bloom, displayKind };
  });

  return (
    <div
      className={cn(
        'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 p-4 bg-gradient-to-br from-accent/30 to-secondary/20 rounded-xl border border-primary/20',
        className
      )}
      role="region"
      aria-label="花壇"
    >
      {processedBlooms.map((bloom) => {
        const fromUser = useAppStore.getState().getUser(bloom.fromUserId);
        const post = bloom.postId
          ? useAppStore.getState().getPost(bloom.postId)
          : null;

        // 同じ種類の花の数をカウント
        const sameKindCount = blooms.filter((b) => b.kind === bloom.kind).length;

        // スクリーンリーダー用のテキスト
        const srText = `${
          fromUser?.name || '匿名'
        }さんから${formatRelativeTime(bloom.createdAt)}${
          post ? `、「${post.text.slice(0, 30)}${post.text.length > 30 ? '...' : ''}」への支えとして` : ''
        }贈られた${getBloomKindLabel(bloom.displayKind)}`;

        return (
          <div
            key={bloom.id}
            className="relative group"
            role="img"
            aria-label={srText}
            tabIndex={0}
          >
            <div className="relative">
              <Flower
                kind={bloom.displayKind}
                size={32}
                className="transition-transform duration-200 hover:scale-110 focus-within:scale-110 cursor-pointer"
                aria-label={srText}
              />
              {sameKindCount >= 4 && bloom.displayKind === 'bouquet' && (
                <div
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  aria-label={`${sameKindCount}個の花`}
                >
                  {sameKindCount}
                </div>
              )}
            </div>
            {/* ホバー/フォーカス時の詳細表示 */}
            <div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-neutral text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-10"
              role="tooltip"
              aria-hidden="true"
            >
              <div className="font-medium">{fromUser?.name || '匿名'}</div>
              <div className="text-xs opacity-90">
                {formatRelativeTime(bloom.createdAt)}
              </div>
              {post && (
                <div className="text-xs opacity-75 mt-1 max-w-xs truncate">
                  {post.text.slice(0, 50)}
                  {post.text.length > 50 ? '...' : ''}
                </div>
              )}
              {/* 矢印 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutral"></div>
            </div>
            {/* スクリーンリーダー用テキスト */}
            <span className="sr-only">{srText}</span>
          </div>
        );
      })}
    </div>
  );
};

// 花の種類のラベルを取得
const getBloomKindLabel = (kind: string): string => {
  const labels: Record<string, string> = {
    empathy: '共感の花',
    courage: '勇気の花',
    rescue: '救いの花',
    bouquet: '花束',
  };
  return labels[kind] || '花';
};


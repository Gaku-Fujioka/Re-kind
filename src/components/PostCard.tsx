import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { FlowerIcon } from './FlowerIcon';
import { formatRelativeTime } from '../utils/date';
import { usePostEncouragements, useCurrentUser } from '../hooks/useRepository';
import { repository } from '../storage/repository';
import { thankEncouragement } from '../services/kindService';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
  onEncouragementAdded?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onEncouragementAdded,
}) => {
  const { encouragements, refresh } = usePostEncouragements(post.id);
  const { user: currentUser } = useCurrentUser();
  const [showEncouragementForm, setShowEncouragementForm] = useState(false);
  const [encouragementText, setEncouragementText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postUser = repository.getUser(post.userId);
  const isOwnPost = currentUser?.id === post.userId;

  const handleSubmitEncouragement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !encouragementText.trim()) return;

    setIsSubmitting(true);
    try {
      repository.createEncouragement({
        postId: post.id,
        userId: currentUser.id,
        content: encouragementText.trim(),
      });
      setEncouragementText('');
      setShowEncouragementForm(false);
      refresh();
      onEncouragementAdded?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThank = (encouragementId: string) => {
    if (!currentUser) return;
    thankEncouragement(encouragementId, post.id);
    refresh();
  };

  return (
    <Card className="mb-lg">
      <div className="flex items-center gap-md mb-md">
        <div
          className="flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-secondary)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'bold',
          }}
          aria-label={`${postUser?.name || 'ユーザー'}のアバター`}
        >
          {postUser?.name?.[0] || '?'}
        </div>
        <div>
          <div style={{ fontWeight: 500 }}>{postUser?.name || '匿名'}</div>
          <div className="text-sm text-light">
            {formatRelativeTime(post.createdAt)}
          </div>
        </div>
      </div>

      <div className="mb-md" style={{ whiteSpace: 'pre-wrap' }}>
        {post.content}
      </div>

      <div className="mb-md">
        <div className="text-sm text-light mb-sm">
          励まし ({encouragements.length})
        </div>
        {encouragements.map((enc) => {
          const encUser = repository.getUser(enc.userId);
          const isOwnEncouragement = enc.userId === currentUser?.id;
          const canThank = isOwnPost && !enc.thanked && !isOwnEncouragement;

          return (
            <div
              key={enc.id}
              className="mb-sm p-sm"
              style={{
                backgroundColor: 'var(--color-background-light)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div className="flex items-center justify-between mb-xs">
                <div className="text-sm" style={{ fontWeight: 500 }}>
                  {encUser?.name || '匿名'}
                </div>
                {canThank && (
                  <Button
                    variant="text"
                    onClick={() => handleThank(enc.id)}
                    className="text-xs"
                    aria-label="ありがとうチェック"
                  >
                    <FlowerIcon size={16} /> ありがとう
                  </Button>
                )}
                {enc.thanked && (
                  <span className="text-xs text-light flex items-center gap-xs">
                    <FlowerIcon size={14} color="#FFB347" /> 感謝済み
                  </span>
                )}
              </div>
              <div className="text-sm">{enc.content}</div>
            </div>
          );
        })}
      </div>

      {currentUser && !isOwnPost && (
        <div>
          {!showEncouragementForm ? (
            <Button
              variant="outline"
              onClick={() => setShowEncouragementForm(true)}
            >
              励ましを送る
            </Button>
          ) : (
            <form onSubmit={handleSubmitEncouragement}>
              <textarea
                value={encouragementText}
                onChange={(e) => setEncouragementText(e.target.value)}
                placeholder="励ましのメッセージを入力..."
                className="textarea mb-sm"
                rows={3}
                required
                aria-label="励ましメッセージ"
              />
              <div className="flex gap-sm">
                <Button
                  type="submit"
                  disabled={isSubmitting || !encouragementText.trim()}
                >
                  送信
                </Button>
                <Button
                  type="button"
                  variant="text"
                  onClick={() => {
                    setShowEncouragementForm(false);
                    setEncouragementText('');
                  }}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Card>
  );
};


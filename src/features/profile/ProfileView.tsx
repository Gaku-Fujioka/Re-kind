import React from 'react';
import { useAppStore } from '../../app/store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloomWall } from '../gratitude/BloomWall';
import { formatRelativeTime } from '../../lib/utils/date';
import type { UserId } from '../../lib/types';

interface ProfileViewProps {
  userId: UserId;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userId }) => {
  const user = useAppStore((state) => state.getUser(userId));
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const getUserEncouragements = useAppStore((state) => state.getUserEncouragements);
  const connectWithUser = useAppStore((state) => state.connectWithUser);
  const isConnectedWithUser = useAppStore((state) => state.isConnectedWithUser);
  const getPost = useAppStore((state) => state.getPost);

  if (!user) return null;

  const encouragements = getUserEncouragements(userId);
  const isOwnProfile = currentUser?.id === userId;
  const isConnected = currentUser
    ? isConnectedWithUser(currentUser.id, userId)
    : false;

  const handleConnect = () => {
    if (currentUser && !isOwnProfile) {
      connectWithUser(userId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-neutral mb-6">
        <span className="sr-only">プロフィール</span>
        プロフィール
      </h1>

      {/* プロフィール情報 */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* アバター */}
          <div
            className="flex items-center justify-center w-20 h-20 rounded-full bg-secondary text-3xl font-bold mx-auto sm:mx-0 flex-shrink-0"
            aria-label={`${user.name}のアバター`}
          >
            {user.name[0]}
          </div>

          {/* 基本情報 */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-neutral mb-2">
              {user.name}
              <span className="sr-only">さんのプロフィール</span>
            </h2>
            {user.bio && (
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                {user.bio}
              </p>
            )}
            <div className="text-sm text-gray-500">
              花壇の花: {user.garden?.length || 0}個
            </div>
          </div>

          {/* 光でつながるボタン */}
          {!isOwnProfile && currentUser && (
            <div className="w-full sm:w-auto">
              <Button
                variant={isConnected ? 'outline' : 'primary'}
                onClick={handleConnect}
                className="w-full sm:w-auto"
                aria-label={
                  isConnected
                    ? `${user.name}さんとは既につながっています`
                    : `${user.name}さんと光でつながる`
                }
              >
                {isConnected ? (
                  <>
                    <span className="sr-only">既につながっています</span>
                    ✨ つながっています
                  </>
                ) : (
                  <>
                    <span className="sr-only">光でつながる</span>
                    ✨ 光でつながる
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* 花壇 */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">
          花壇
          <span className="sr-only">：受け取った感謝の花が咲きます</span>
        </h2>
        <BloomWall userId={userId} />
      </Card>

      {/* 最近の励まし一覧 */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">
          最近の励まし
          <span className="sr-only">
            ：{encouragements.length}件の励ましメッセージ
          </span>
        </h2>
        {encouragements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>まだ励ましを送っていません</p>
            <p className="text-sm mt-2">
              誰かの投稿に励ましを送ると、ここに表示されます
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {encouragements.slice(0, 10).map((enc) => {
              const post = getPost(enc.postId);
              const toUser = useAppStore.getState().getUser(enc.toUserId);

              return (
                <div
                  key={enc.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        {toUser?.name || 'やさしい手'}さんへの励まし
                      </div>
                      {post && (
                        <div className="text-xs text-gray-500 mb-2">
                          投稿: {post.text.slice(0, 50)}
                          {post.text.length > 50 ? '...' : ''}
                        </div>
                      )}
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {enc.text}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <time
                      dateTime={enc.createdAt}
                      className="text-xs text-gray-500"
                      aria-label={`送信日時: ${formatRelativeTime(enc.createdAt)}`}
                    >
                      {formatRelativeTime(enc.createdAt)}
                    </time>
                    {enc.thanked && (
                      <span className="text-xs text-primary font-medium flex items-center gap-1">
                        <span className="sr-only">感謝済み</span>
                        ✓ 感謝済み
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {encouragements.length > 10 && (
          <div className="text-center mt-4 text-sm text-gray-500">
            他 {encouragements.length - 10}件の励まし
          </div>
        )}
      </Card>
    </div>
  );
};

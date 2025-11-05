import { useState } from 'react';
import { useAppStore } from '../../app/store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { FlowerIcon } from '../../components/icons/FlowerIcon';
import { formatRelativeTime } from '../../lib/utils/date';
import { softenText } from '../moderation/soften';
import { thankEncouragement } from '../../lib/services/kindService';

type SendMode = 'as-is' | 'soften';

interface PostCardProps {
  postId: string;
}

export const PostCard: React.FC<PostCardProps> = ({ postId }) => {
  const post = useAppStore((state) => state.getPost(postId));
  const encouragements = useAppStore((state) =>
    state.getPostEncouragements(postId)
  );
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const createEncouragement = useAppStore(
    (state) => state.createEncouragement
  );

  const [showEncouragementForm, setShowEncouragementForm] = useState(false);
  const [encouragementText, setEncouragementText] = useState('');
  const [sendMode, setSendMode] = useState<SendMode>('as-is');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!post) return null;

  const postUser = useAppStore((state) => state.getUser(post.userId));
  const isOwnPost = currentUser?.id === post.userId;

  const handleSubmitEncouragement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !encouragementText.trim()) return;

    setIsSubmitting(true);
    try {
      const finalText = sendMode === 'soften' ? softenText(encouragementText.trim()) : encouragementText.trim();
      createEncouragement({
        postId: post.id,
        userId: currentUser.id,
        content: finalText,
      });
      setEncouragementText('');
      setSendMode('as-is'); // リセット
      setShowEncouragementForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const softenedPreview = encouragementText.trim() ? softenText(encouragementText.trim()) : '';
  const showSoftenedPreview = sendMode === 'soften' && softenedPreview !== encouragementText.trim();

  const handleThank = (encouragementId: string) => {
    if (!currentUser) return;
    thankEncouragement(encouragementId, post.id);
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-lg font-bold"
          aria-label={`${postUser?.name || 'ユーザー'}のアバター`}
        >
          {postUser?.name?.[0] || '?'}
        </div>
        <div>
          <div className="font-medium">{postUser?.name || '匿名'}</div>
          <div className="text-sm text-gray-500">
            {formatRelativeTime(post.createdAt)}
          </div>
        </div>
      </div>

      <div className="mb-4 whitespace-pre-wrap">{post.content}</div>

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-2">
          励まし ({encouragements.length})
        </div>
        {encouragements.map((enc) => {
          const encUser = useAppStore((state) => state.getUser(enc.userId));
          const isOwnEncouragement = enc.userId === currentUser?.id;
          const canThank = isOwnPost && !enc.thanked && !isOwnEncouragement;

          return (
            <div
              key={enc.id}
              className="mb-2 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">
                  {encUser?.name || '匿名'}
                </div>
                {canThank && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleThank(enc.id)}
                    className="text-xs"
                    aria-label="ありがとうチェック"
                  >
                    <FlowerIcon size={16} /> ありがとう
                  </Button>
                )}
                {enc.thanked && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
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
            <form onSubmit={handleSubmitEncouragement} className="space-y-3">
              <Textarea
                value={encouragementText}
                onChange={(e) => setEncouragementText(e.target.value)}
                placeholder="励ましのメッセージを入力..."
                rows={3}
                required
                aria-label="励ましメッセージ"
              />

              {/* 送信モード選択 */}
              {encouragementText.trim() && (
                <div className="flex gap-4 items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">送信方法：</span>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`postcard-send-mode-${postId}`}
                        value="as-is"
                        checked={sendMode === 'as-is'}
                        onChange={(e) => setSendMode(e.target.value as SendMode)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                        aria-label="そのまま送る"
                      />
                      <span className="text-sm text-gray-700">そのまま送る</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`postcard-send-mode-${postId}`}
                        value="soften"
                        checked={sendMode === 'soften'}
                        onChange={(e) => setSendMode(e.target.value as SendMode)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                        aria-label="少しやわらげる"
                      />
                      <span className="text-sm text-gray-700">少しやわらげる</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 柔らかくしたプレビュー */}
              {showSoftenedPreview && (
                <div
                  className="p-3 bg-accent/50 rounded-lg border border-primary/20"
                  role="alert"
                  aria-live="polite"
                >
                  <p className="text-sm font-medium text-neutral mb-2">
                    やわらかくした文章：
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {softenedPreview}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !encouragementText.trim()}
                >
                  送信
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowEncouragementForm(false);
                    setEncouragementText('');
                    setSendMode('as-is');
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


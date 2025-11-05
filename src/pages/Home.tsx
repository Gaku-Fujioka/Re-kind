import { useState } from 'react';
import { useAppStore } from '../app/store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { Toast } from '../components/ui/Toast';
import { Glow } from '../components/ui/Glow';
import { PostForm } from '../features/post/PostForm';
import { KindMission } from '../features/mission/KindMission';
import { Donation } from '../features/wallet/Donation';
import { FlowerIcon } from '../components/icons/FlowerIcon';
import { formatRelativeTime } from '../lib/utils/date';
import { softenText } from '../features/moderation/soften';
import { t } from '../lib/i18n';
import type { PostId } from '../lib/types';

type SendMode = 'as-is' | 'soften';

export const Home = () => {
  const feed = useAppStore((state) => state.getFeed());
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const sendEncouragement = useAppStore((state) => state.sendEncouragement);
  const thankAndIssueCoin = useAppStore((state) => state.thankAndIssueCoin);

  const [selectedPostId, setSelectedPostId] = useState<PostId | null>(null);
  const [encouragementText, setEncouragementText] = useState('');
  const [sendMode, setSendMode] = useState<SendMode>('as-is');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  const selectedPost = selectedPostId
    ? useAppStore.getState().getPost(selectedPostId)
    : null;

  const handleSendEncouragement = async () => {
    if (!selectedPostId || !encouragementText.trim()) return;

    setIsSubmitting(true);
    try {
      const finalText = sendMode === 'soften' ? softenText(encouragementText.trim()) : encouragementText.trim();
      const encouragement = sendEncouragement(selectedPostId, finalText);
      if (encouragement) {
        setEncouragementText('');
        setSendMode('as-is'); // リセット
        setSelectedPostId(null);
        // 光の演出
        setShowGlow(true);
        setTimeout(() => setShowGlow(false), 1000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const softenedPreview = encouragementText.trim() ? softenText(encouragementText.trim()) : '';
  const showSoftenedPreview = sendMode === 'soften' && softenedPreview !== encouragementText.trim();

  const handleThank = async (postId: PostId, messageId: string) => {
    const result = thankAndIssueCoin(postId, messageId);
    if (result) {
      const message = t('bloom.thankYouCoin');
      setToastMessage(message);
      setNotificationMessage(`${t('bloom.flowerBloomed')}。${t('bloom.coinIssued')}。`);
      
      // 通知をクリア（5秒後）
      setTimeout(() => setNotificationMessage(''), 5000);
    }
  };

  const getUserName = (userId: string) => {
    const user = useAppStore.getState().getUser(userId);
    return user?.name || 'やさしい手';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* aria-live通知エリア */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {notificationMessage}
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FlowerIcon size={24} color="#FFB347" />
          <h1 className="text-2xl font-bold text-neutral">花壇Feed</h1>
        </div>

      {showGlow && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <Glow intensity="strong" color="primary">
            <div className="text-6xl">✨</div>
          </Glow>
        </div>
      )}

      <Toast
        message={toastMessage || ''}
        isOpen={!!toastMessage}
        onClose={() => setToastMessage(null)}
      />

        {currentUser && <PostForm />}
        {feed.length === 0 ? (
          <Card>
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg mb-2">まだ投稿がありません</p>
              <p className="text-sm">最初の投稿をしてみましょう！</p>
            </div>
          </Card>
        ) : (
          feed.map((post) => {
          const author = useAppStore.getState().getUser(post.authorId);
          const isOwnPost = currentUser?.id === post.authorId;
          const encouragements = post.encouragements || [];

          return (
            <Card key={post.id} className="space-y-4">
              {/* 投稿ヘッダー */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg font-bold"
                  aria-label={`${author?.name || '匿名'}のアバター`}
                >
                  {(author?.name || '?')[0]}
                </div>
                <div>
                  <div className="font-medium text-neutral">
                    {author?.name || 'やさしい手'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatRelativeTime(new Date(post.createdAt).getTime())}
                  </div>
                </div>
              </div>

              {/* 投稿テキスト */}
              <div className="text-neutral whitespace-pre-wrap">{post.text}</div>

              {/* 励まし一覧 */}
              {encouragements.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    励まし ({encouragements.length})
                  </div>
                  {encouragements.map((enc) => {
                    const encUser = useAppStore.getState().getUser(enc.fromUserId);
                    const canThank = isOwnPost && !enc.thanked;

                    return (
                      <div
                        key={enc.id}
                        className="p-3 bg-gray-50 rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            {encUser?.name || 'やさしい手'}
                          </div>
                          {enc.thanked && (
                            <span className="text-xs text-primary">✓ 感謝済み</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700">{enc.text}</div>
                        {canThank && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleThank(post.id, enc.id)}
                            className="mt-2"
                            aria-label="ありがとうを送る"
                          >
                            ありがとう 🌸
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* アクションボタン */}
              {!isOwnPost && currentUser && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPostId(post.id)}
                    aria-label="励ましを送る"
                  >
                    励ます 🌸
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // 共感機能（将来的に実装）
                      setToastMessage('共感を送りました 💫');
                    }}
                    aria-label="共感を送る"
                  >
                    共感 💫
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // 1対1相談機能（将来的に実装）
                      setToastMessage('1対1相談を申し出ました');
                    }}
                    aria-label="1対1相談を申し出る"
                  >
                    1対1相談を申し出る
                  </Button>
                </div>
              )}
            </Card>
          );
        })
        )}
      </div>
      <div className="space-y-6">
        {currentUser && (
          <>
            <KindMission />
            <Donation />
          </>
        )}
      </div>

      {/* 励まし送信モーダル */}
      <Modal
        isOpen={!!selectedPostId}
        onClose={() => {
          setSelectedPostId(null);
          setEncouragementText('');
          setSendMode('as-is');
        }}
        title="励ましを送る"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral mb-2">
              メッセージ
            </label>
            <Textarea
              value={encouragementText}
              onChange={(e) => setEncouragementText(e.target.value)}
              placeholder="励ましのメッセージを入力してください..."
              rows={5}
              required
              aria-label="励ましメッセージ"
              className="w-full"
            />
          </div>

          {/* 送信モード選択 */}
          {encouragementText.trim() && (
            <div className="flex gap-4 items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">送信方法：</span>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="encouragement-send-mode"
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
                    name="encouragement-send-mode"
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

          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedPostId(null);
                setEncouragementText('');
                setSendMode('as-is');
              }}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSendEncouragement}
              disabled={isSubmitting || !encouragementText.trim()}
              aria-label="励ましを送信"
            >
              {isSubmitting ? '送信中...' : '送信'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

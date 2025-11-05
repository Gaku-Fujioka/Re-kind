import { useState } from 'react';
import { useAppStore } from '../../app/store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { softenText } from '../moderation/soften';

type SendMode = 'as-is' | 'soften';

export const PostForm = () => {
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const createPost = useAppStore((state) => state.createPost);
  const refreshFeed = useAppStore((state) => state.refreshFeed);
  const [text, setText] = useState('');
  const [sendMode, setSendMode] = useState<SendMode>('as-is');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      const finalText = sendMode === 'soften' ? softenText(text.trim()) : text.trim();
      createPost(finalText);
      setText('');
      setSendMode('as-is'); // リセット
      refreshFeed();
    } finally {
      setIsSubmitting(false);
    }
  };

  const softenedPreview = text.trim() ? softenText(text.trim()) : '';
  const showSoftenedPreview = sendMode === 'soften' && softenedPreview !== text.trim();

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          label="今の気持ちや悩みを共有してください"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例: 最近、仕事で悩みがあります..."
          rows={4}
          required
          maxLength={1000}
          aria-describedby="post-form-help"
        />
        <div id="post-form-help" className="text-sm text-gray-500">
          最大1000文字
        </div>

        {/* 送信モード選択 */}
        {text.trim() && (
          <div className="flex gap-4 items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">送信方法：</span>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="send-mode"
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
                  name="send-mode"
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

        <Button type="submit" disabled={isSubmitting || !text.trim()}>
          投稿する
        </Button>
      </form>
    </Card>
  );
};


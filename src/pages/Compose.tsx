import { useState } from 'react';
import { useAppStore } from '../app/store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { PetalAnimation } from '../components/ui/PetalAnimation';
import { FlowerIcon } from '../components/icons/FlowerIcon';
import { softenText } from '../features/moderation/soften';
import { useNavigate } from 'react-router-dom';

export const Compose = () => {
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const createPost = useAppStore((state) => state.createPost);
  const refreshFeed = useAppStore((state) => state.refreshFeed);
  
  const [text, setText] = useState('');
  const [softenedText, setSoftenedText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPetals, setShowPetals] = useState(false);
  const [showSoftened, setShowSoftened] = useState(false);

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ログインしてください</p>
      </div>
    );
  }

  const handleTextChange = (value: string) => {
    setText(value);
    // リアルタイムで柔らか変換
    const softened = softenText(value);
    setSoftenedText(softened);
    setShowSoftened(softened !== value && softened.trim() !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      // 柔らか変換されたテキストを使用
      const finalText = softenedText || text;
      createPost(finalText.trim());
      
      // 花びらアニメーション
      setShowPetals(true);
      
      // リセット
      setText('');
      setSoftenedText('');
      setShowSoftened(false);
      
      // フィードを更新
      refreshFeed();
      
      // 少し待ってからホームに遷移
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FlowerIcon size={28} color="#FFB347" />
        <h1 className="text-2xl font-bold text-neutral">新しい投稿</h1>
      </div>

      <PetalAnimation isActive={showPetals} />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              label="あなたの気持ちを言葉の花に"
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="あなたの気持ちを言葉の花に"
              rows={8}
              required
              maxLength={1000}
              aria-describedby="compose-help"
              className="text-lg"
            />
            <div id="compose-help" className="text-sm text-gray-500 mt-1">
              最大1000文字
            </div>
          </div>

          {showSoftened && (
            <div
              className="p-3 bg-accent/50 rounded-lg border border-primary/20"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start gap-2">
                <FlowerIcon size={20} color="#FFB347" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral mb-1">
                    優しい言葉に変換しました
                  </p>
                  <p className="text-sm text-gray-600">{softenedText}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setText('');
                setSoftenedText('');
                setShowSoftened(false);
              }}
              disabled={isSubmitting || !text.trim()}
            >
              クリア
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              aria-label="投稿を公開"
            >
              {isSubmitting ? '投稿中...' : '🌸 言葉の花を咲かせる'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="bg-accent/30">
        <div className="flex items-start gap-3">
          <FlowerIcon size={24} color="#FFB347" />
          <div className="flex-1">
            <h3 className="font-medium text-neutral mb-2">優しい言葉の輪</h3>
            <p className="text-sm text-gray-600">
              あなたの気持ちを言葉にすることで、誰かの心に寄り添うことができます。
              ネガティブな表現も、自動的に優しい言葉に変換されます。
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

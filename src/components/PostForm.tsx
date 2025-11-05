import React, { useState } from 'react';
import { Card } from './Card';
import { Textarea } from './Textarea';
import { Button } from './Button';
import { useCurrentUser } from '../hooks/useRepository';
import { repository } from '../storage/repository';

interface PostFormProps {
  onPostCreated?: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({
  onPostCreated,
}) => {
  const { user: currentUser, refresh } = useCurrentUser();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      repository.createPost({
        userId: currentUser.id,
        content: content.trim(),
      });
      setContent('');
      refresh();
      onPostCreated?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-lg">
      <form onSubmit={handleSubmit}>
        <Textarea
          label="今の気持ちや悩みを共有してください"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="例: 最近、仕事で悩みがあります..."
          rows={4}
          required
          maxLength={1000}
          aria-describedby="post-form-help"
        />
        <div id="post-form-help" className="text-sm text-light mb-md">
          最大1000文字
        </div>
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          投稿する
        </Button>
      </form>
    </Card>
  );
};


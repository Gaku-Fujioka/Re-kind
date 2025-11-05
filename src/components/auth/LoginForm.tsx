import { useState } from 'react';
import { useAppStore } from '../../app/store/useAppStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const createUser = useAppStore((state) => state.createUser);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const user = createUser({ name: name.trim() });
    setCurrentUser(user.id);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="お名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例: 田中太郎"
        required
        autoFocus
        aria-describedby="login-help"
      />
      <div id="login-help" className="text-sm text-gray-500">
        ニックネームを入力して始めましょう（匿名でログインします）
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={!name.trim()} className="flex-1">
          ログイン
        </Button>
      </div>
    </form>
  );
};


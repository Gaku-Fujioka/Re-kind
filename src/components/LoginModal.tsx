import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (name: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <Card
        style={{ maxWidth: '400px', width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="login-title" className="mb-md">
          ログイン
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="お名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 田中太郎"
            required
            autoFocus
            aria-describedby="login-help"
          />
          <div id="login-help" className="text-sm text-light mb-md mt-sm">
            名前を入力して始めましょう
          </div>
          <div className="flex gap-sm">
            <Button type="submit" disabled={!name.trim()}>
              ログイン
            </Button>
            <Button type="button" variant="text" onClick={onClose}>
              キャンセル
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};


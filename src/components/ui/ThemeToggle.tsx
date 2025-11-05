import { useState, useEffect } from 'react';
import { getThemeMode, setThemeMode, applyTheme, type ThemeMode } from '../../lib/theme';
import { Button } from './Button';
import { cn } from '../../lib/theme';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>(getThemeMode());

  useEffect(() => {
    applyTheme(theme);
    setThemeMode(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return '☀️';
    if (theme === 'dark') return '🌙';
    return '💻';
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'ライト';
    if (theme === 'dark') return 'ダーク';
    return 'システム';
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className={cn('flex items-center gap-2')}
      aria-label={`テーマを${getThemeLabel()}に切り替え`}
      title={`現在: ${getThemeLabel()}モード（クリックで切り替え）`}
    >
      <span className="text-lg" aria-hidden="true">
        {getThemeIcon()}
      </span>
      <span className="hidden sm:inline text-sm">{getThemeLabel()}</span>
    </Button>
  );
};


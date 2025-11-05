import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// テーマカラー（ライトモード）
export const lightTheme = {
  colors: {
    primary: '#FFB347',
    secondary: '#C5E1A5',
    accent: '#FDF1C2',
    neutral: '#2F3E46',
    background: '#FAF5E9',
  },
} as const;

// テーマカラー（ダークモード）
export const darkTheme = {
  colors: {
    primary: '#FFB347', // オレンジは光として映える
    secondary: '#8BC34A', // より明るいグリーン
    accent: '#FFE082', // より明るいゴールド
    neutral: '#E0E0E0', // 明るい文字色
    background: '#1A1A1A', // 濃い背景（夜の雰囲気）
  },
} as const;

export const theme = lightTheme;

// テーマモードの型
export type ThemeMode = 'light' | 'dark' | 'system';

// テーマ管理
export const getThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem('rekind_theme');
  return (saved as ThemeMode) || 'system';
};

export const setThemeMode = (mode: ThemeMode) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('rekind_theme', mode);
  applyTheme(mode);
};

export const applyTheme = (mode: ThemeMode) => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDark) {
    root.classList.add('dark');
    root.style.setProperty('--color-primary', darkTheme.colors.primary);
    root.style.setProperty('--color-secondary', darkTheme.colors.secondary);
    root.style.setProperty('--color-accent', darkTheme.colors.accent);
    root.style.setProperty('--color-neutral', darkTheme.colors.neutral);
    root.style.setProperty('--color-background', darkTheme.colors.background);
  } else {
    root.classList.remove('dark');
    root.style.setProperty('--color-primary', lightTheme.colors.primary);
    root.style.setProperty('--color-secondary', lightTheme.colors.secondary);
    root.style.setProperty('--color-accent', lightTheme.colors.accent);
    root.style.setProperty('--color-neutral', lightTheme.colors.neutral);
    root.style.setProperty('--color-background', lightTheme.colors.background);
  }
};

// 初期化時にテーマを適用
if (typeof window !== 'undefined') {
  applyTheme(getThemeMode());
  // システムのテーマ変更を監視
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemeMode() === 'system') {
      applyTheme('system');
    }
  });
}

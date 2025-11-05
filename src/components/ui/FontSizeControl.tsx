import { useState, useEffect } from 'react';
import { Button } from './Button';

type FontSize = 'small' | 'medium' | 'large';

const fontSizeMap: Record<FontSize, { label: string; size: string }> = {
  small: { label: '小', size: '0.875rem' },
  medium: { label: '中', size: '1rem' },
  large: { label: '大', size: '1.125rem' },
};

export const FontSizeControl = () => {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    if (typeof window === 'undefined') return 'medium';
    const saved = localStorage.getItem('rekind_font_size') as FontSize;
    return saved || 'medium';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('rekind_font_size', fontSize);
    const root = document.documentElement;
    root.style.setProperty('--font-size-base', fontSizeMap[fontSize].size);
  }, [fontSize]);

  const increaseFontSize = () => {
    const sizes: FontSize[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes: FontSize[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={decreaseFontSize}
        variant="ghost"
        size="sm"
        aria-label="文字サイズを小さく"
        disabled={fontSize === 'small'}
      >
        <span className="text-sm">A</span>
      </Button>
      <span className="text-sm text-neutral min-w-[2rem] text-center" aria-label={`現在の文字サイズ: ${fontSizeMap[fontSize].label}`}>
        {fontSizeMap[fontSize].label}
      </span>
      <Button
        onClick={increaseFontSize}
        variant="ghost"
        size="sm"
        aria-label="文字サイズを大きく"
        disabled={fontSize === 'large'}
      >
        <span className="text-base font-bold">A</span>
      </Button>
    </div>
  );
};


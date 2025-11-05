import React from 'react';
import { cn } from '../../lib/theme';

interface GlowProps {
  children: React.ReactNode;
  intensity?: 'soft' | 'medium' | 'strong';
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const Glow: React.FC<GlowProps> = ({
  children,
  intensity = 'medium',
  color = 'primary',
  className,
}) => {
  const intensityClasses = {
    soft: 'opacity-40 blur-sm',
    medium: 'opacity-60 blur-md',
    strong: 'opacity-80 blur-lg',
  };

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      {/* 光の演出レイヤー */}
      <div
        className={cn(
          'absolute inset-0 rounded-full',
          colorClasses[color],
          intensityClasses[intensity],
          'animate-pulse'
        )}
        aria-hidden="true"
      />
      {/* コンテンツ */}
      <div className="relative">{children}</div>
    </div>
  );
};


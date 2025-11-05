import React from 'react';
import { cn } from '../../lib/theme';

interface LightParticleProps {
  size?: number;
  glow?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const LightParticle: React.FC<LightParticleProps> = ({
  size = 16,
  glow = true,
  className,
  'aria-label': ariaLabel = 'KindCoin',
}) => {
  return (
    <div
      className={cn('relative inline-block', className)}
      aria-label={ariaLabel}
      role="img"
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-primary opacity-40 blur-sm animate-pulse"
          aria-hidden="true"
        />
      )}
      <div
        className="relative rounded-full bg-primary"
        style={{
          width: size,
          height: size,
          boxShadow: '0 0 8px rgba(255, 179, 71, 0.6)',
        }}
        aria-hidden="true"
      />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};


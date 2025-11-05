import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/theme';

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

interface PetalAnimationProps {
  isActive: boolean;
  petalCount?: number;
  className?: string;
}

export const PetalAnimation: React.FC<PetalAnimationProps> = ({
  isActive,
  petalCount = 15,
  className,
}) => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPetals: Petal[] = Array.from({ length: petalCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
      }));
      setPetals(newPetals);

      // アニメーション終了後にクリーンアップ
      const timer = setTimeout(() => {
        setPetals([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, petalCount]);

  if (!isActive || petals.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none z-50 overflow-hidden',
        className
      )}
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute top-0 text-2xl animate-petal-fall"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
};


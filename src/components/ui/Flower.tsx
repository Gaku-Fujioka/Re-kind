import React from 'react';
import { cn } from '../../lib/theme';
import type { BloomKind } from '../../lib/types';

interface FlowerProps {
  kind: BloomKind;
  size?: number;
  className?: string;
  'aria-label'?: string;
}

const flowerColors: Record<BloomKind, string> = {
  empathy: '#FFB347', // オレンジ
  courage: '#C5E1A5', // ライトグリーン
  rescue: '#FDF1C2', // ホワイトゴールド
  bouquet: '#FF6B9D', // ピンク
};

const flowerSVG: Record<BloomKind, React.ReactNode> = {
  empathy: (
    <>
      {/* デイジー風 */}
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <circle cx="6" cy="8" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="18" cy="8" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="6" cy="16" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="18" cy="16" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="12" cy="5" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" opacity="0.6" />
    </>
  ),
  courage: (
    <>
      {/* チューリップ風 */}
      <path
        d="M12 8 L10 14 L12 20 L14 14 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="12" cy="8" r="2.5" fill="currentColor" />
      <ellipse cx="10" cy="12" rx="1.5" ry="2" fill="currentColor" opacity="0.7" />
      <ellipse cx="14" cy="12" rx="1.5" ry="2" fill="currentColor" opacity="0.7" />
    </>
  ),
  rescue: (
    <>
      {/* 桜風 */}
      <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.8" />
      <circle cx="8" cy="10" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="16" cy="10" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="10" cy="15" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="14" cy="15" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="9" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="15" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
    </>
  ),
  bouquet: (
    <>
      {/* 花束風 */}
      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
      <circle cx="8" cy="12" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="16" cy="12" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="10" cy="8" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="14" cy="8" r="1.5" fill="currentColor" opacity="0.7" />
      <path
        d="M12 14 L12 20 M10 16 L12 20 L14 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </>
  ),
};

export const Flower: React.FC<FlowerProps> = ({
  kind,
  size = 24,
  className,
  'aria-label': ariaLabel,
}) => {
  const color = flowerColors[kind];
  const kindLabels: Record<BloomKind, string> = {
    empathy: '共感の花',
    courage: '勇気の花',
    rescue: '救いの花',
    bouquet: '花束',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block', className)}
      aria-label={ariaLabel || kindLabels[kind]}
      role="img"
      focusable="true"
    >
      <g fill={color} stroke={color}>
        {flowerSVG[kind]}
      </g>
    </svg>
  );
};


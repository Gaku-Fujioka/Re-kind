import React from 'react';
import { Icon } from '../ui/Icon';

interface CoinIconProps {
  size?: number;
  color?: string;
  className?: string;
  'aria-label'?: string;
}

export const CoinIcon: React.FC<CoinIconProps> = ({
  size = 24,
  color = '#FFB347',
  className,
  'aria-label': ariaLabel = 'KindCoin',
}) => {
  return (
    <Icon
      size={size}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <circle cx="12" cy="12" r="10" fill={color} />
      <circle cx="12" cy="12" r="7" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" />
      <path
        d="M12 5 L12 19 M5 12 L19 12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        opacity="0.9"
      >
        K
      </text>
    </Icon>
  );
};


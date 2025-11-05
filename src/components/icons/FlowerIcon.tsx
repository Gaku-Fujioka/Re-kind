import React from 'react';
import { Icon } from '../ui/Icon';

interface FlowerIconProps {
  size?: number;
  color?: string;
  className?: string;
  'aria-label'?: string;
}

export const FlowerIcon: React.FC<FlowerIconProps> = ({
  size = 24,
  color = '#FFB347',
  className,
  'aria-label': ariaLabel = '花',
}) => {
  return (
    <Icon
      size={size}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <circle cx="12" cy="12" r="3" fill={color} />
      <circle cx="6" cy="8" r="2" fill={color} opacity="0.7" />
      <circle cx="18" cy="8" r="2" fill={color} opacity="0.7" />
      <circle cx="6" cy="16" r="2" fill={color} opacity="0.7" />
      <circle cx="18" cy="16" r="2" fill={color} opacity="0.7" />
      <circle cx="12" cy="5" r="1.5" fill={color} opacity="0.6" />
      <circle cx="12" cy="19" r="1.5" fill={color} opacity="0.6" />
    </Icon>
  );
};


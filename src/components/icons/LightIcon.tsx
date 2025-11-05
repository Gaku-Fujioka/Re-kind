import React from 'react';
import { Icon } from '../ui/Icon';

interface LightIconProps {
  size?: number;
  color?: string;
  className?: string;
  'aria-label'?: string;
}

export const LightIcon: React.FC<LightIconProps> = ({
  size = 24,
  color = '#FFB347',
  className,
  'aria-label': ariaLabel = '光',
}) => {
  return (
    <Icon
      size={size}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <circle cx="12" cy="12" r="8" fill={color} opacity="0.3" />
      <circle cx="12" cy="12" r="4" fill={color} />
      <path
        d="M12 2L12 6M12 18L12 22M2 12L6 12M18 12L22 12M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
};


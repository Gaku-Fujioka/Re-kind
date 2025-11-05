import React from 'react';

interface LightIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const LightIcon: React.FC<LightIconProps> = ({
  size = 24,
  color = '#FFB347',
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" fill={color} opacity="0.3" />
      <circle cx="12" cy="12" r="4" fill={color} />
      <path
        d="M12 2L12 6M12 18L12 22M2 12L6 12M18 12L22 12M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};


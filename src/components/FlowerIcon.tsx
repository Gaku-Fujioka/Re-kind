import React from 'react';

interface FlowerIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const FlowerIcon: React.FC<FlowerIconProps> = ({
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
      <circle cx="12" cy="12" r="3" fill={color} />
      <circle cx="6" cy="8" r="2" fill={color} opacity="0.7" />
      <circle cx="18" cy="8" r="2" fill={color} opacity="0.7" />
      <circle cx="6" cy="16" r="2" fill={color} opacity="0.7" />
      <circle cx="18" cy="16" r="2" fill={color} opacity="0.7" />
      <circle cx="12" cy="5" r="1.5" fill={color} opacity="0.6" />
      <circle cx="12" cy="19" r="1.5" fill={color} opacity="0.6" />
    </svg>
  );
};


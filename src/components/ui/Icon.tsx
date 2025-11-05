import React from 'react';
import { cn } from '../../lib/theme';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode;
  size?: number;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

export const Icon: React.FC<IconProps> = ({
  children,
  size = 24,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block', className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
      focusable={!ariaHidden}
      role={ariaHidden ? undefined : 'img'}
      {...props}
    >
      {children}
    </svg>
  );
};


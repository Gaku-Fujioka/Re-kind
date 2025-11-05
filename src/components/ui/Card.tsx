import React from 'react';
import { cn } from '../../lib/theme';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick();
      }
    };

    const baseClasses =
      'bg-white rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md';

    if (onClick) {
      return (
        <div
          ref={ref}
          className={cn(
            baseClasses,
            'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            className
          )}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={props['aria-label'] || 'クリック可能なカード'}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn(baseClasses, className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';


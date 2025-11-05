import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/theme';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-md',
        secondary:
          'bg-secondary text-neutral hover:bg-secondary/90 hover:-translate-y-0.5 hover:shadow-md',
        outline:
          'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
        ghost: 'text-primary hover:bg-accent',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm min-h-[36px]',
        md: 'px-4 py-2 min-h-[44px]',
        lg: 'px-6 py-3 text-lg min-h-[52px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';


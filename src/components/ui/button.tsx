import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'playful' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'transform lg:hover:scale-105 active:scale-95',
          variant === 'default' && 'bg-primary text-primary-foreground lg:hover:bg-primary/90 shadow-soft',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground lg:hover:bg-secondary/90 shadow-soft',
          variant === 'outline' && 'border-2 border-primary bg-background text-primary lg:hover:bg-primary lg:hover:text-primary-foreground',
          variant === 'ghost' && 'lg:hover:bg-accent lg:hover:text-accent-foreground',
          variant === 'link' && 'text-primary underline-offset-4 lg:hover:underline',
          variant === 'playful' && 'bg-gradient-to-r from-primary to-secondary text-white lg:hover:from-primary/90 lg:hover:to-secondary/90 shadow-soft animate-bounce-gentle',
          size === 'default' && 'h-12 px-6 py-3',
          size === 'sm' && 'h-10 px-4 py-2 text-sm',
          size === 'lg' && 'h-14 px-8 py-4 text-lg',
          size === 'icon' && 'h-12 w-12',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
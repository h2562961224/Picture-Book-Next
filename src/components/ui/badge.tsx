import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        className={cn(
          'inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
          'transform lg:hover:scale-105 active:scale-95 cursor-pointer',
          variant === 'default' && 'bg-primary text-primary-foreground shadow-soft',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground shadow-soft',
          variant === 'outline' && 'border-2 border-primary bg-background text-primary',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
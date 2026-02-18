import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-sand-200 text-charcoal-700",
        success: "bg-sage-100 text-sage-700",
        warning: "bg-amber-50 text-amber-700",
        danger: "bg-red-50 text-red-700",
        info: "bg-blue-50 text-blue-700",
        accent: "bg-terracotta-100 text-terracotta-700",
        outline: "border border-sand-300 text-charcoal-600 bg-transparent",
      },
      size: {
        sm: "px-2 py-0.5 text-[0.6875rem]",
        md: "px-2.5 py-0.5 text-body-xs",
        lg: "px-3 py-1 text-body-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              variant === "success" && "bg-sage-500",
              variant === "warning" && "bg-amber-500",
              variant === "danger" && "bg-red-500",
              variant === "info" && "bg-blue-500",
              variant === "accent" && "bg-terracotta-500",
              (!variant || variant === "default") && "bg-charcoal-400",
              variant === "outline" && "bg-charcoal-400"
            )}
          />
        )}
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };

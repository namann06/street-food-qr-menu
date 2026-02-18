import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-sage-600 text-white shadow-soft-sm hover:bg-sage-700 active:bg-sage-800 hover:shadow-soft-md",
        secondary:
          "bg-white text-charcoal-800 border border-sand-300 shadow-soft-xs hover:bg-sand-50 hover:border-sand-400",
        outline:
          "border border-sand-300 bg-transparent text-charcoal-700 hover:bg-sand-100 hover:border-sand-400",
        ghost:
          "text-charcoal-600 hover:bg-sand-200/60 hover:text-charcoal-900",
        danger:
          "bg-red-50 text-red-700 border border-red-200/60 hover:bg-red-100",
        success:
          "bg-sage-50 text-sage-700 border border-sage-200/60 hover:bg-sage-100",
        warm:
          "bg-terracotta-500 text-white shadow-soft-sm hover:bg-terracotta-600 active:bg-terracotta-700",
        link: "text-sage-600 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-lg px-3 text-body-sm",
        md: "h-10 rounded-xl px-4 text-body-sm",
        lg: "h-12 rounded-xl px-6 text-body-md",
        xl: "h-14 rounded-2xl px-8 text-body-lg",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

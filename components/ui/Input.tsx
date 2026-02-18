import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, suffix, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 [&_svg]:size-4">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border border-sand-300 bg-white px-4 py-2.5",
            "text-body-sm text-charcoal-900 placeholder:text-charcoal-400",
            "shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.04)]",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-sand-100",
            icon && "pl-10",
            suffix && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

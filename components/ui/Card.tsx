import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Card Container ──────────────────────────────────────────── */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "elevated" | "interactive" | "muted";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border",
      variant === "default" && "bg-white border-sand-200/60 shadow-soft-sm",
      variant === "elevated" && "bg-white border-sand-200/40 shadow-soft-md",
      variant === "interactive" &&
        "bg-white border-sand-200/60 shadow-soft-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-soft-lg hover:-translate-y-0.5",
      variant === "muted" && "bg-sand-50 border-sand-200/40 shadow-soft-xs",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/* ─── Card Header ─────────────────────────────────────────────── */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/* ─── Card Title ──────────────────────────────────────────────── */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-body-lg font-semibold font-display leading-none tracking-tight text-charcoal-900",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/* ─── Card Description ────────────────────────────────────────── */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body-sm text-charcoal-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/* ─── Card Content ────────────────────────────────────────────── */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/* ─── Card Footer ─────────────────────────────────────────────── */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

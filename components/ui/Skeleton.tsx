import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rectangular", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-sand-200/80 animate-pulse",
          variant === "text" && "h-4 w-full rounded-md",
          variant === "circular" && "rounded-full",
          variant === "rectangular" && "rounded-xl",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    );
  }
);
Skeleton.displayName = "Skeleton";

/* ─── Skeleton Presets ────────────────────────────────────────── */

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-sand-200/60 bg-white p-6 space-y-4", className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="h-4 w-2/3" />
          <Skeleton variant="text" className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-3 w-full" />
        <Skeleton variant="text" className="h-3 w-4/5" />
      </div>
    </div>
  );
}

function SkeletonMenuItem({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-sand-200/60 bg-white p-5 flex gap-4", className)}>
      <Skeleton className="h-20 w-20 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-3 w-full" />
        <Skeleton variant="text" className="h-4 w-16" />
      </div>
      <Skeleton className="h-9 w-16 rounded-lg self-end" />
    </div>
  );
}

function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="rounded-2xl border border-sand-200/60 bg-white p-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-8 w-48" />
          <Skeleton variant="text" className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-sand-200/60 bg-white p-5 space-y-3">
            <Skeleton variant="text" className="h-3 w-20" />
            <Skeleton variant="text" className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonMenuItem key={i} />
          ))}
        </div>
        <div className="lg:col-span-5 space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonMenuItem, SkeletonDashboard };

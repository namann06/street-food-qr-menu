import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-sand-200/80 mb-4">
        <Icon className="w-6 h-6 text-charcoal-400" />
      </div>
      <h3 className="text-body-lg font-semibold text-charcoal-800 font-display mb-1">
        {title}
      </h3>
      <p className="text-body-sm text-charcoal-500 max-w-sm mb-5">
        {description}
      </p>
      {action}
    </div>
  );
}

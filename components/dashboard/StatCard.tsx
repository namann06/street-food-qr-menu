"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  accent?: "sage" | "terracotta" | "forest" | "default";
  className?: string;
}

const accentStyles = {
  sage: {
    iconBg: "bg-sage-100",
    iconColor: "text-sage-600",
  },
  terracotta: {
    iconBg: "bg-terracotta-100",
    iconColor: "text-terracotta-600",
  },
  forest: {
    iconBg: "bg-forest-100",
    iconColor: "text-forest-600",
  },
  default: {
    iconBg: "bg-sand-200",
    iconColor: "text-charcoal-600",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "default",
  className,
}: StatCardProps) {
  const styles = accentStyles[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "bg-white rounded-2xl border border-sand-200/60 p-5 shadow-soft-xs",
        "transition-all duration-300 hover:shadow-soft-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-body-sm text-charcoal-500 font-medium">{label}</p>
          <p className="text-display-xs font-bold text-charcoal-900 font-display">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "text-body-xs font-medium",
                trend.positive ? "text-sage-600" : "text-terracotta-600"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl",
            styles.iconBg
          )}
        >
          <Icon className={cn("w-5 h-5", styles.iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Stats Grid Container ────────────────────────────────────── */
export function StatsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
}

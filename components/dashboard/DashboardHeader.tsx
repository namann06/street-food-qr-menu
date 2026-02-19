"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  pendingOrderCount?: number;
  children?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  pendingOrderCount = 0,
  children,
}: DashboardHeaderProps) {
  const { data: session } = useSession();

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 hidden lg:block bg-sand-50/80 backdrop-blur-xl border-b border-sand-200/60">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Title */}
        <div>
          <h1 className="text-display-xs font-bold text-charcoal-900 font-display">
            {title}
          </h1>
          {subtitle && (
            <p className="text-body-sm text-charcoal-500 -mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Custom actions slot */}
          {children}

          {/* Notification bell */}
          <button
            className="relative flex items-center justify-center w-10 h-10 rounded-xl text-charcoal-500 hover:bg-sand-200/60 hover:text-charcoal-700 transition-all duration-200"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            {pendingOrderCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-terracotta-500 text-white text-[0.625rem] font-semibold">
                {pendingOrderCount > 9 ? "9+" : pendingOrderCount}
              </span>
            )}
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-sand-200">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-sage-100 text-sage-700 text-body-sm font-semibold">
              {getInitials(session?.user?.name)}
            </div>
            <div className="hidden xl:block">
              <p className="text-body-sm font-medium text-charcoal-800 leading-tight">
                {session?.user?.name || "User"}
              </p>
              <p className="text-body-xs text-charcoal-400 leading-tight">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CustomerShellProps {
  children: React.ReactNode;
  shopName?: string;
  shopAddress?: string;
  className?: string;
}

export function CustomerShell({
  children,
  shopName,
  shopAddress,
  className,
}: CustomerShellProps) {
  return (
    <div className={cn("min-h-screen bg-sand-50", className)}>
      {/* ─── Elegant Hero Header ──────────────────────────────── */}
      {shopName && (
        <header className="relative bg-white border-b border-sand-200/60">
          <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 text-center">
            {/* Shop identity */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sage-100 text-sage-600 mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 2h18v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V2Z" />
                <path d="M3 8v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8" />
                <path d="M10 2v6" />
                <path d="M14 2v6" />
              </svg>
            </div>
            <h1 className="text-display-sm font-bold text-charcoal-900 font-display">
              {shopName}
            </h1>
            {shopAddress && (
              <p className="text-body-sm text-charcoal-500 mt-1">
                {shopAddress}
              </p>
            )}
          </div>

          {/* Subtle decorative bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
        </header>
      )}

      {/* ─── Content Area ─────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-28">
        {children}
      </main>
    </div>
  );
}

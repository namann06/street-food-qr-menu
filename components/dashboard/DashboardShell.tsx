"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  MobileBottomNav,
  MobileHeader,
  MobileMenu,
  DashboardHeader,
} from "@/components/dashboard";

interface DashboardShellProps {
  children: React.ReactNode;
  shopName?: string;
  headerTitle: string;
  headerSubtitle?: string;
  pendingOrderCount?: number;
  headerActions?: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardShell({
  children,
  shopName,
  headerTitle,
  headerSubtitle,
  pendingOrderCount,
  headerActions,
  currentSection,
  onSectionChange,
}: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sand-100">
      {/* Desktop Sidebar */}
      <Sidebar
        shopName={shopName}
        currentSection={currentSection}
        onSectionChange={onSectionChange}
      />

      {/* Mobile Header */}
      <MobileHeader
        shopName={shopName}
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMenuOpen={mobileMenuOpen}
      />

      {/* Mobile Slide-over Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        shopName={shopName}
        currentSection={currentSection}
        onSectionChange={onSectionChange}
      />

      {/* Main Content Area */}
      <main
        className={cn(
          "lg:pl-64", // offset for desktop sidebar
          "pb-20 lg:pb-0" // offset for mobile bottom nav
        )}
      >
        {/* Desktop Header */}
        <DashboardHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          pendingOrderCount={pendingOrderCount}
        >
          {headerActions}
        </DashboardHeader>

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentSection={currentSection}
        onSectionChange={onSectionChange}
      />
    </div>
  );
}

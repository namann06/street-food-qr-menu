"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  QrCode,
  Plus,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

/* ─── Navigation Items ────────────────────────────────────────── */
const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Menu",
    href: "/dashboard",
    icon: UtensilsCrossed,
    section: "menu",
  },
  {
    label: "Orders",
    href: "/dashboard",
    icon: ClipboardList,
    section: "orders",
  },
  {
    label: "QR Code",
    href: "/dashboard",
    icon: QrCode,
    section: "qr",
  },
];

/* ─── Sidebar Component ──────────────────────────────────────── */
export function Sidebar({
  shopName,
  currentSection,
  onSectionChange,
}: {
  shopName?: string;
  currentSection: string;
  onSectionChange: (section: string) => void;
}) {
  const pathname = usePathname();

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.section) return currentSection === item.section;
    if (item.exact) return currentSection === "overview";
    return false;
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-40">
      <div className="flex flex-col flex-1 bg-white border-r border-sand-200/80 px-4 py-6">
        {/* ─── Brand ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sage-600 text-white">
            <Store className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-semibold text-charcoal-900 truncate font-display">
              {shopName || "Servio"}
            </p>
            <p className="text-body-xs text-charcoal-400">Dashboard</p>
          </div>
        </div>

        {/* ─── Navigation ────────────────────────────────────── */}
        <nav className="flex-1 space-y-1">
          <p className="px-3 mb-2 text-body-xs font-medium text-charcoal-400 uppercase tracking-wider">
            Main
          </p>
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.label}
                onClick={() =>
                  onSectionChange(item.section || "overview")
                }
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all duration-200",
                  active
                    ? "bg-sage-50 text-sage-700 shadow-soft-xs"
                    : "text-charcoal-500 hover:bg-sand-100 hover:text-charcoal-800"
                )}
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] flex-shrink-0",
                    active ? "text-sage-600" : "text-charcoal-400"
                  )}
                />
                <span>{item.label}</span>
                {active && (
                  <ChevronRight className="w-4 h-4 ml-auto text-sage-400" />
                )}
              </button>
            );
          })}

          {/* ─── Quick Action ──────────────────────────────── */}
          <div className="pt-4">
            <p className="px-3 mb-2 text-body-xs font-medium text-charcoal-400 uppercase tracking-wider">
              Quick Actions
            </p>
            <Link
              href="/dashboard/menu/add"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all duration-200",
                pathname === "/dashboard/menu/add"
                  ? "bg-sage-50 text-sage-700 shadow-soft-xs"
                  : "text-charcoal-500 hover:bg-sand-100 hover:text-charcoal-800"
              )}
            >
              <Plus className="w-[18px] h-[18px] flex-shrink-0" />
              <span>Add Menu Item</span>
            </Link>
          </div>
        </nav>

        {/* ─── User & Logout ─────────────────────────────────── */}
        <div className="mt-auto pt-4 border-t border-sand-200">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-charcoal-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ─── Mobile Bottom Nav ──────────────────────────────────────── */
export function MobileBottomNav({
  currentSection,
  onSectionChange,
}: {
  currentSection: string;
  onSectionChange: (section: string) => void;
}) {
  const mobileNavItems = navItems.slice(0, 4);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 backdrop-blur-xl border-t border-sand-200/80 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1.5">
        {mobileNavItems.map((item) => {
          const active =
            item.section
              ? currentSection === item.section
              : currentSection === "overview";
          return (
            <button
              key={item.label}
              onClick={() =>
                onSectionChange(item.section || "overview")
              }
              className={cn(
                "flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[4rem]",
                active ? "text-sage-700" : "text-charcoal-400"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  active && "scale-110"
                )}
              />
              <span className="text-[0.625rem] font-medium">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-0.5 w-8 h-0.5 rounded-full bg-sage-500"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ─── Mobile Header ──────────────────────────────────────────── */
export function MobileHeader({
  shopName,
  onMenuToggle,
  isMenuOpen,
}: {
  shopName?: string;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 lg:hidden bg-white/90 backdrop-blur-xl border-b border-sand-200/80">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sage-600 text-white">
            <Store className="w-4 h-4" />
          </div>
          <span className="font-display font-semibold text-body-sm text-charcoal-900 truncate">
            {shopName || "Servio"}
          </span>
        </div>
        <button
          onClick={onMenuToggle}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-charcoal-500 hover:bg-sand-100 transition-colors"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}

/* ─── Mobile Slide-over Menu ─────────────────────────────────── */
export function MobileMenu({
  isOpen,
  onClose,
  shopName,
  currentSection,
  onSectionChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  shopName?: string;
  currentSection: string;
  onSectionChange: (section: string) => void;
}) {
  const pathname = usePathname();

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.section) return currentSection === item.section;
    if (item.exact) return currentSection === "overview";
    return false;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-charcoal-900/20 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-soft-2xl lg:hidden"
          >
            <div className="flex flex-col h-full p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sage-600 text-white">
                    <Store className="w-5 h-5" />
                  </div>
                  <p className="font-display font-semibold text-charcoal-900">
                    {shopName || "Servio"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-9 h-9 rounded-xl text-charcoal-500 hover:bg-sand-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item);
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        onSectionChange(item.section || "overview");
                        onClose();
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-body-sm font-medium transition-all duration-200",
                        active
                          ? "bg-sage-50 text-sage-700"
                          : "text-charcoal-500 hover:bg-sand-100 hover:text-charcoal-800"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <div className="pt-3 border-t border-sand-200 mt-3">
                  <Link
                    href="/dashboard/menu/add"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-body-sm font-medium text-charcoal-500 hover:bg-sand-100 hover:text-charcoal-800 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Menu Item</span>
                  </Link>
                </div>
              </nav>

              {/* Sign Out */}
              <div className="pt-4 border-t border-sand-200">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-body-sm font-medium text-charcoal-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

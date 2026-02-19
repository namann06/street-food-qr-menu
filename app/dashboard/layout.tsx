import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Servio",
  description: "Manage your restaurant menu, orders, and QR code",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

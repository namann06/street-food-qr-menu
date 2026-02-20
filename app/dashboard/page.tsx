'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  ClipboardList,
  CheckCircle2,
  Plus,
  Search,
  Trash2,
  Pencil,
  ExternalLink,
  QrCode,
  Package,
  Filter,
  X,
} from 'lucide-react';

import { DashboardShell, StatCard, StatsGrid } from '@/components/dashboard';
import OrdersList from '../components/OrdersList';
import {
  Button,
  Input,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Switch,
  Separator,
  EmptyState,
  SkeletonDashboard,
} from '@/components/ui';
import { cn } from '@/lib/utils';

/* ─── Types ───────────────────────────────────────────────────── */
interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  available: boolean;
  category?: string;
}

interface Shop {
  _id: string;
  name: string;
  address: string;
}

/* ─── Section Title Map ───────────────────────────────────────── */
const sectionTitles: Record<string, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'Your restaurant at a glance' },
  menu: { title: 'Menu Management', subtitle: 'Manage your menu items' },
  orders: { title: 'Orders', subtitle: 'Track and manage incoming orders' },
  qr: { title: 'QR Code', subtitle: 'Share your digital menu' },
};

/* ─── Container fade animation ────────────────────────────────── */
const sectionVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

/* ═════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
   ═════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { data: session } = useSession();
  const [shop, setShop] = useState<Shop | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('overview');

  // Menu section state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Derived stats
  const menuItemCount = menuItems.length;
  const availableItemCount = menuItems.filter((i) => i.available).length;
  const unavailableCount = menuItemCount - availableItemCount;

  // Categories
  const categories = useMemo(
    () => ['all', ...Array.from(new Set(menuItems.map((i) => i.category || 'Uncategorized')))],
    [menuItems]
  );

  // Filtered items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || (item.category || 'Uncategorized') === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, selectedCategory]);

  /* ─── Data fetch ────────────────────────────────────────────── */
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const res = await fetch('/api/shop');
        const data = await res.json();
        setShop(data.shop);
        setMenuItems(data.menuItems);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchShopData();
  }, [session]);

  /* ─── Handlers ──────────────────────────────────────────────── */
  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/menu/${shop?._id}/items/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, available: !item.available }),
      });
      if (res.ok) {
        setMenuItems((items) =>
          items.map((i) => (i._id === item._id ? { ...i, available: !i.available } : i))
        );
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/menu/${shop?._id}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  /* ─── Loading state ─────────────────────────────────────────── */
  if (loading) {
    return (
      <DashboardShell
        shopName="Loading..."
        headerTitle="Dashboard"
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      >
        <SkeletonDashboard />
      </DashboardShell>
    );
  }

  /* ─── Auth guard ────────────────────────────────────────────── */
  if (!session) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center">
        <Card className="p-8 text-center max-w-sm">
          <p className="text-charcoal-600 mb-4">Please sign in to access the dashboard.</p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const { title, subtitle } = sectionTitles[currentSection] || sectionTitles.overview;

  return (
    <DashboardShell
      shopName={shop?.name}
      headerTitle={title}
      headerSubtitle={subtitle}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      headerActions={
        currentSection === 'menu' ? (
          <Button asChild size="md">
            <Link href="/dashboard/menu/add">
              <Plus className="w-4 h-4" />
              Add Item
            </Link>
          </Button>
        ) : undefined
      }
    >
      <AnimatePresence mode="wait">
        {/* ═══ OVERVIEW SECTION ═══════════════════════════════════ */}
        {currentSection === 'overview' && (
          <motion.div key="overview" {...sectionVariants} className="space-y-6">
            {/* Stats */}
            <StatsGrid>
              <StatCard
                label="Total Items"
                value={menuItemCount}
                icon={UtensilsCrossed}
                accent="sage"
              />
              <StatCard
                label="Available"
                value={availableItemCount}
                icon={CheckCircle2}
                accent="forest"
              />
              <StatCard
                label="Unavailable"
                value={unavailableCount}
                icon={Package}
                accent="terracotta"
              />
            </StatsGrid>

            {/* Quick Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Menu Items */}
              <div className="lg:col-span-7">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle>Recent Menu Items</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentSection('menu')}
                      className="text-sage-600"
                    >
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {menuItems.length === 0 ? (
                      <EmptyState
                        icon={UtensilsCrossed}
                        title="No menu items yet"
                        description="Add your first menu item to get started."
                        action={
                          <Button asChild size="sm">
                            <Link href="/dashboard/menu/add">
                              <Plus className="w-4 h-4" />
                              Add Menu Item
                            </Link>
                          </Button>
                        }
                      />
                    ) : (
                      <div className="space-y-3">
                        {menuItems.slice(0, 5).map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between py-3 border-b border-sand-200/60 last:border-0"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-body-sm font-medium text-charcoal-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-body-xs text-charcoal-500">
                                ₹{item.price}
                              </p>
                            </div>
                            <Badge variant={item.available ? 'success' : 'warning'} dot size="sm">
                              {item.available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Orders + QR */}
              <div className="lg:col-span-5 space-y-6">
                {/* Recent Orders Preview */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentSection('orders')}
                      className="text-sage-600"
                    >
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {shop && <OrdersList shopId={shop._id} />}
                    </div>
                  </CardContent>
                </Card>

                {/* QR Quick Card */}
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sage-100 text-sage-600 mb-3">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <p className="text-body-sm font-medium text-charcoal-800 mb-1">
                      Your QR Code is ready
                    </p>
                    <p className="text-body-xs text-charcoal-500 mb-4">
                      Share it with your customers
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCurrentSection('qr')}
                    >
                      View QR Code
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ MENU SECTION ═══════════════════════════════════════ */}
        {currentSection === 'menu' && (
          <motion.div key="menu" {...sectionVariants} className="space-y-6">
            {/* Filters Bar */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full sm:w-auto">
                  <Input
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                    suffix={
                      searchQuery ? (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="p-0.5 rounded hover:bg-sand-200 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : undefined
                    }
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-charcoal-400 flex-shrink-0" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex h-10 w-full sm:w-40 rounded-xl border border-sand-300 bg-white px-3 py-2 text-body-sm text-charcoal-900 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.04)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Add Button */}
                <div className="sm:hidden w-full">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/menu/add">
                      <Plus className="w-4 h-4" />
                      Add Item
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-body-sm text-charcoal-500">
                Showing <span className="font-medium text-charcoal-800">{filteredItems.length}</span>{' '}
                of {menuItemCount} items
              </p>
            </div>

            {/* Menu Items List */}
            {filteredItems.length === 0 ? (
              <Card>
                <EmptyState
                  icon={UtensilsCrossed}
                  title="No items found"
                  description={
                    searchQuery || selectedCategory !== 'all'
                      ? 'Try adjusting your search or filter.'
                      : 'Add your first menu item to get started.'
                  }
                  action={
                    searchQuery || selectedCategory !== 'all' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    ) : (
                      <Button asChild size="sm">
                        <Link href="/dashboard/menu/add">
                          <Plus className="w-4 h-4" />
                          Add Menu Item
                        </Link>
                      </Button>
                    )
                  }
                />
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.03,
                      duration: 0.25,
                      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                    }}
                  >
                    <Card
                      variant="interactive"
                      className={cn(
                        'p-5',
                        !item.available && 'opacity-60'
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Item Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-body-md font-semibold text-charcoal-900 truncate">
                              {item.name}
                            </h3>
                            {item.category && (
                              <Badge variant="default" size="sm">
                                {item.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-body-sm text-charcoal-500 line-clamp-1">
                            {item.description}
                          </p>
                          <p className="text-body-md font-semibold text-sage-700">
                            ₹{item.price}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {/* Availability Toggle */}
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={item.available}
                              onCheckedChange={() => handleToggleAvailability(item)}
                              size="sm"
                            />
                            <span className="text-body-xs text-charcoal-500 hidden sm:inline">
                              {item.available ? 'On' : 'Off'}
                            </span>
                          </div>

                          <Separator orientation="vertical" className="h-6" />

                          {/* Edit */}
                          <Button variant="ghost" size="icon-sm" asChild>
                            <Link href={`/dashboard/menu/edit/${item._id}`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>

                          {/* Delete */}
                          {showDeleteConfirm === item._id ? (
                            <div className="flex items-center gap-1.5">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteItem(item._id)}
                              >
                                Delete
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setShowDeleteConfirm(item._id)}
                              className="text-charcoal-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ ORDERS SECTION ═════════════════════════════════════ */}
        {currentSection === 'orders' && (
          <motion.div key="orders" {...sectionVariants}>
            <Card>
              <CardContent className="pt-6">
                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {shop && <OrdersList shopId={shop._id} />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ═══ QR CODE SECTION ════════════════════════════════════ */}
        {currentSection === 'qr' && (
          <motion.div key="qr" {...sectionVariants}>
            <div className="max-w-md mx-auto">
              <Card className="text-center p-8">
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="inline-flex p-6 rounded-3xl bg-white shadow-soft-md border border-sand-200/60">
                    <QRCodeSVG
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${shop?._id}`}
                      size={200}
                      level="H"
                      bgColor="#FFFFFF"
                      fgColor="#2A2A2A"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="text-display-xs font-bold text-charcoal-900 font-display">
                      Your Menu QR Code
                    </h3>
                    <p className="text-body-sm text-charcoal-500">
                      Display this code at your restaurant. Customers can scan it to
                      view your menu and place orders.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild variant="default" size="lg">
                      <Link href={`/menu/${shop?._id}`} target="_blank">
                        <ExternalLink className="w-4 h-4" />
                        Preview Menu
                      </Link>
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => {
                        // Download QR as image
                        const svg = document.querySelector('.qr-container svg');
                        if (svg) {
                          const svgData = new XMLSerializer().serializeToString(svg);
                          const canvas = document.createElement('canvas');
                          const ctx = canvas.getContext('2d');
                          const img = new Image();
                          img.onload = () => {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx?.drawImage(img, 0, 0);
                            const link = document.createElement('a');
                            link.download = `${shop?.name || 'menu'}-qr-code.png`;
                            link.href = canvas.toDataURL();
                            link.click();
                          };
                          img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                        }
                      }}
                    >
                      Download QR
                    </Button>
                  </div>

                  {/* Menu URL */}
                  <div className="mt-4 p-3 bg-sand-100 rounded-xl">
                    <p className="text-body-xs text-charcoal-500 mb-1">Menu URL</p>
                    <p className="text-body-sm text-charcoal-700 font-mono break-all">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/menu/{shop?._id}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}

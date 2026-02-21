'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Cart from '../../components/Cart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Minus, Plus, ShoppingBag, X } from 'lucide-react';

import { CustomerShell } from '@/components/customer';
import { Badge, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Shop {
  _id: string;
  name: string;
  address: string;
  upiId: string;
}

/* ─── Animation variants ──────────────────────────────────────── */
const itemVariant = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function MenuPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = use(params);
  const router = useRouter();

  const [shop, setShop] = useState<Shop | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /* ─── Cart helpers ──────────────────────────────────────────── */
  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { _id: item._id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeCartItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
  };

  const handleCheckout = async (paymentMethod: 'upi' | 'counter', tableNumber: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId,
          items: cartItems,
          total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          tableNumber,
          paymentMethod,
        }),
      });

      if (!response.ok) throw new Error('Failed to place order');
      const data = await response.json();

      if (paymentMethod === 'upi' && shop?.upiId) {
        window.location.href = `upi://pay?pa=${shop.upiId}&pn=${shop.name}&am=${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}&tn=Order%20Payment`;
      }

      setCartItems([]);
      router.push(
        `/order-confirmation?orderId=${data.order.orderId}&items=${encodeURIComponent(JSON.stringify(cartItems))}&total=${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}&paymentMethod=${paymentMethod}`
      );
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  /* ─── Data fetch ────────────────────────────────────────────── */
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`/api/menu/${shopId}`);
        if (!res.ok) throw new Error('Failed to fetch menu');
        const data = await res.json();
        setShop(data.shop);
        setMenuItems(data.menuItems);
      } catch {
        setError('Error loading menu');
      } finally {
        setLoading(false);
      }
    };
    if (shopId) fetchMenu();
  }, [shopId]);

  /* ─── Derived data ──────────────────────────────────────────── */
  const availableItems = useMemo(
    () => menuItems.filter((i) => i.available),
    [menuItems]
  );

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(availableItems.map((i) => i.category || 'Other')))],
    [availableItems]
  );

  const filteredItems = useMemo(() => {
    return availableItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || (item.category || 'Other') === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [availableItems, searchQuery, selectedCategory]);

  const filteredByCategory = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      const cat = item.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [filteredItems]);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  /* ─── Loading ───────────────────────────────────────────────── */
  if (loading) {
    return (
      <CustomerShell shopName="Loading…">
        <div className="space-y-6">
          <Skeleton className="h-11 w-full rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-20 w-20 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </CustomerShell>
    );
  }

  if (error || !shop) {
    return (
      <CustomerShell shopName="Oops">
        <div className="text-center py-16">
          <p className="text-charcoal-500 text-body-md">{error || 'Shop not found'}</p>
        </div>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell shopName={shop.name} shopAddress={shop.address}>
      {/* ─── Search ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-sand-50/90 backdrop-blur-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search dishes…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-sand-300 bg-white text-body-sm text-charcoal-800 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-charcoal-400 hover:text-charcoal-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="mt-2.5 -mx-4 px-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'shrink-0 px-3.5 py-1.5 rounded-full text-body-xs font-medium transition-all',
                selectedCategory === cat
                  ? 'bg-sage-600 text-white shadow-soft-xs'
                  : 'bg-white border border-sand-200 text-charcoal-600 hover:border-sage-300 hover:text-sage-700'
              )}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Menu Items ─────────────────────────────────────────── */}
      <div className="mt-4 space-y-7">
        {Object.keys(filteredByCategory).length === 0 && (
          <div className="text-center py-16">
            <p className="text-charcoal-400 text-body-sm">No items found</p>
          </div>
        )}

        {Object.entries(filteredByCategory).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-body-md font-semibold text-charcoal-800 font-display mb-3">
              {category}
            </h2>

            <div className="space-y-3">
              {items.map((item, idx) => {
                const inCart = cartItems.find((c) => c._id === item._id);

                return (
                  <motion.div
                    key={item._id}
                    custom={idx}
                    variants={itemVariant}
                    initial="hidden"
                    animate="show"
                    className="flex gap-3 rounded-xl bg-white border border-sand-200/60 p-3 shadow-soft-xs hover:shadow-soft-sm transition-shadow"
                  >
                    {/* Image */}
                    {item.image && (
                      <div className="relative h-[88px] w-[88px] rounded-lg overflow-hidden shrink-0 bg-sand-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="object-cover"
                          fill
                          sizes="88px"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <h3 className="text-body-sm font-semibold text-charcoal-900 leading-snug truncate">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-body-xs text-charcoal-500 line-clamp-2 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-body-sm font-semibold text-charcoal-800">
                          ₹{item.price}
                        </span>

                        {/* Add / Quantity control */}
                        {inCart ? (
                          <div className="flex items-center gap-0 rounded-full bg-sage-600 overflow-hidden shadow-soft-xs">
                            <button
                              onClick={() => updateCartItemQuantity(item._id, Math.max(0, inCart.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center text-white hover:bg-sage-700 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-body-xs font-semibold text-white tabular-nums">
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => updateCartItemQuantity(item._id, inCart.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-white hover:bg-sage-700 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="h-8 px-4 rounded-full bg-sage-600 text-white text-body-xs font-semibold hover:bg-sage-700 active:scale-95 transition-all shadow-soft-xs"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ─── Cart ───────────────────────────────────────────────── */}
      <Cart
        items={cartItems}
        total={cartTotal}
        onRemoveItem={removeCartItem}
        onUpdateQuantity={updateCartItemQuantity}
        onCheckout={handleCheckout}
        shopUpiId={shop?.upiId}
      />
    </CustomerShell>
  );
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOrderEvents } from '@/hooks/useOrderEvents';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Banknote,
  Calendar,
  ClipboardList,
} from 'lucide-react';
import { Button, Badge, Separator, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  tableNumber: string;
  paymentMethod: 'upi' | 'counter';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface OrdersListProps {
  shopId: string;
}

export default function OrdersList({ shopId }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${shopId}`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      setError('Error loading orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  const handleNewOrder = (order: Order) => {
    setOrders(prevOrders => [order, ...prevOrders]);
  };

  useOrderEvents(shopId, handleNewOrder);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/orders/${shopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update order');
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    }
  };

  const filterOrdersByDate = (orders: Order[], date: string) => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === date;
    });
  };

  /* ─── Loading ───────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-sand-200/60 bg-sand-50 p-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 bg-sand-200 rounded w-24" />
              <div className="h-4 bg-sand-200 rounded w-16" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-sand-200 rounded w-full" />
              <div className="h-3 bg-sand-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-body-sm text-red-600">{error}</p>
        <Button variant="ghost" size="sm" className="mt-2" onClick={fetchOrders}>
          Retry
        </Button>
      </div>
    );
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const completedOrders = filterOrdersByDate(
    orders.filter(order => order.status === 'completed'),
    selectedDate
  );

  return (
    <div className="space-y-6">
      {/* ─── Pending Orders ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-terracotta-500" />
          <h3 className="text-body-md font-semibold text-charcoal-900 font-display">
            Pending Orders
          </h3>
          {pendingOrders.length > 0 && (
            <Badge variant="warning" size="sm" dot>
              {pendingOrders.length}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {pendingOrders.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-body-sm text-charcoal-400">No pending orders</p>
            </div>
          ) : (
            <AnimatePresence>
              {pendingOrders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="rounded-xl border border-sand-200/80 bg-white p-4 shadow-soft-xs hover:shadow-soft-sm transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="accent" size="sm">
                          Table {order.tableNumber}
                        </Badge>
                        <span className="text-body-xs text-charcoal-400">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-body-xs text-charcoal-400 font-mono">
                        #{order.orderId}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => updateOrderStatus(order._id, 'completed')}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Done
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                        className="text-charcoal-400 hover:text-red-600"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-1.5 mb-3">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex justify-between text-body-sm">
                        <span className="text-charcoal-700">
                          <span className="font-medium">{item.quantity}×</span> {item.name}
                        </span>
                        <span className="text-charcoal-500 tabular-nums">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <Separator className="mb-3" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-body-sm font-semibold text-charcoal-900">
                        ₹{order.total}
                      </span>
                      <Badge variant="outline" size="sm">
                        {order.paymentMethod === 'upi' ? (
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> UPI
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Banknote className="w-3 h-3" /> Counter
                          </span>
                        )}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ─── Completed Orders ───────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sage-500" />
            <h3 className="text-body-md font-semibold text-charcoal-900 font-display">
              Completed
            </h3>
          </div>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-400 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-8 pl-8 pr-2 rounded-lg border border-sand-300 bg-white text-body-xs text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          {completedOrders.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-body-sm text-charcoal-400">No completed orders for this date</p>
            </div>
          ) : (
            completedOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border border-sand-200/60 bg-sand-50/50 p-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="sm" dot>
                        Table {order.tableNumber}
                      </Badge>
                      <span className="text-body-xs text-charcoal-400">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-body-xs text-charcoal-400 font-mono">
                      #{order.orderId}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1.5 mb-3">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between text-body-sm">
                      <span className="text-charcoal-600">
                        <span className="font-medium">{item.quantity}×</span> {item.name}
                      </span>
                      <span className="text-charcoal-400 tabular-nums">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="mb-3" />
                <span className="text-body-sm font-semibold text-charcoal-800">
                  ₹{order.total}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
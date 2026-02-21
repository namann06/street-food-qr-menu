'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Minus,
  Plus,
  X,
  CreditCard,
  Banknote,
  ChevronRight,
} from 'lucide-react';
import { Button, Input, Separator, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  total: number;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: (paymentMethod: 'upi' | 'counter', tableNumber: string) => void;
  shopUpiId?: string;
}

/* ─── Overlay + panel animation ───────────────────────────────── */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const panelVariants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { type: 'spring' as const, damping: 30, stiffness: 350 },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Cart({
  items,
  total,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  shopUpiId,
}: CartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'counter'>('counter');
  const [tableNumber, setTableNumber] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleProceedToPayment = () => {
    if (!tableNumber) {
      alert('Please enter your table number');
      return;
    }
    setShowPaymentOptions(true);
  };

  const handlePayment = () => {
    onCheckout(paymentMethod, tableNumber);
    setIsOpen(false);
    setShowPaymentOptions(false);
    setTableNumber('');
  };

  return (
    <>
      {/* ─── Floating Cart Bar (visible when items > 0 & panel closed) ── */}
      <AnimatePresence>
        {items.length > 0 && !isOpen && (
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 left-4 right-4 z-40 max-w-lg mx-auto flex items-center justify-between gap-3 bg-sage-600 text-white rounded-2xl px-5 py-3.5 shadow-soft-xl active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-sage-700 text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              </div>
              <span className="text-body-sm font-medium">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-body-md font-semibold tabular-nums">₹{total}</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Bottom-sheet Cart Panel ──────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="cart-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => {
                setIsOpen(false);
                setShowPaymentOptions(false);
              }}
              className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              key="cart-panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[92vh] rounded-t-3xl bg-white shadow-soft-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h2 className="text-body-lg font-semibold text-charcoal-900 font-display">
                  Your Cart
                </h2>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowPaymentOptions(false);
                  }}
                  className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-sand-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Separator />

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <ShoppingBag className="w-10 h-10 mx-auto text-charcoal-300" />
                    <p className="text-body-md text-charcoal-500 font-medium">
                      Your cart is empty
                    </p>
                    <p className="text-body-xs text-charcoal-400">
                      Add some delicious items to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-sand-200/60 bg-sand-50/50 p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-body-sm font-medium text-charcoal-800 truncate">
                            {item.name}
                          </h3>
                          <p className="text-body-xs text-charcoal-500 mt-0.5 tabular-nums">
                            ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Quantity stepper */}
                          <div className="flex items-center rounded-full border border-sand-300 bg-white overflow-hidden">
                            <button
                              onClick={() => onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center text-charcoal-500 hover:bg-sand-100 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-body-xs font-semibold text-charcoal-800 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-charcoal-500 hover:bg-sand-100 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => onRemoveItem(item._id)}
                            className="p-1 rounded text-charcoal-300 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-sand-200 px-5 pt-4 pb-6 space-y-4 bg-white">
                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-charcoal-600">Total</span>
                    <span className="text-body-lg font-bold text-charcoal-900 tabular-nums">
                      ₹{total}
                    </span>
                  </div>

                  {!showPaymentOptions ? (
                    <>
                      {/* Table Number */}
                      <div className="space-y-1.5">
                        <label className="text-body-xs font-medium text-charcoal-600">
                          Table Number
                        </label>
                        <Input
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          placeholder="e.g. 5"
                          className="h-10"
                        />
                      </div>

                      <Button
                        onClick={handleProceedToPayment}
                        className="w-full h-12 rounded-xl text-body-sm font-semibold"
                      >
                        Proceed to Payment
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Payment method selection */}
                      <div className="space-y-2">
                        <p className="text-body-xs font-medium text-charcoal-600">
                          Payment Method
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setPaymentMethod('counter')}
                            className={cn(
                              'flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all',
                              paymentMethod === 'counter'
                                ? 'border-sage-500 bg-sage-50 text-sage-700'
                                : 'border-sand-200 bg-white text-charcoal-500 hover:border-sand-300'
                            )}
                          >
                            <Banknote className="w-5 h-5" />
                            <span className="text-body-xs font-medium">
                              Pay at Counter
                            </span>
                          </button>
                          <button
                            onClick={() => setPaymentMethod('upi')}
                            className={cn(
                              'flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all',
                              paymentMethod === 'upi'
                                ? 'border-sage-500 bg-sage-50 text-sage-700'
                                : 'border-sand-200 bg-white text-charcoal-500 hover:border-sand-300'
                            )}
                          >
                            <CreditCard className="w-5 h-5" />
                            <span className="text-body-xs font-medium">
                              Pay via UPI
                            </span>
                          </button>
                        </div>
                      </div>

                      <Button
                        onClick={handlePayment}
                        variant="success"
                        className="w-full h-12 rounded-xl text-body-sm font-semibold"
                      >
                        Place Order — ₹{total}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
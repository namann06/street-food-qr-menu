'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, CreditCard, Banknote, Copy, Check } from 'lucide-react';

import { Button, Card, CardContent, Separator, Badge, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

interface OrderDetails {
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: string;
}

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const items = searchParams.get('items');
    const total = searchParams.get('total');
    const paymentMethod = searchParams.get('paymentMethod');

    if (orderId && items && total && paymentMethod) {
      setOrderDetails({
        orderId,
        items: JSON.parse(items),
        total: parseFloat(total),
        paymentMethod,
      });
    }
  }, [searchParams]);

  const copyOrderId = () => {
    if (!orderDetails) return;
    navigator.clipboard.writeText(orderDetails.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="space-y-3">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-5 w-48 mx-auto rounded" />
            <Skeleton className="h-4 w-32 mx-auto rounded" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 px-4 py-8 flex flex-col items-center justify-start">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="w-full max-w-md"
      >
        {/* ─── Success Icon ───────────────────────────────────── */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', damping: 12, stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-100 text-sage-600 mb-4"
          >
            <CheckCircle2 className="w-8 h-8" />
          </motion.div>
          <h1 className="text-display-xs font-bold text-charcoal-900 font-display">
            Order Placed!
          </h1>
          <p className="text-body-sm text-charcoal-500 mt-1">
            Your order has been successfully submitted
          </p>
        </div>

        {/* ─── Order Card ─────────────────────────────────────── */}
        <Card>
          <CardContent className="p-5 space-y-4">
            {/* Order ID */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-xs text-charcoal-400">Order ID</p>
                <p className="text-body-sm font-semibold text-charcoal-800 font-mono">
                  #{orderDetails.orderId}
                </p>
              </div>
              <button
                onClick={copyOrderId}
                className="p-2 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-sand-100 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-sage-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <Separator />

            {/* Items */}
            <div className="space-y-2">
              <p className="text-body-xs font-medium text-charcoal-500 uppercase tracking-wider">
                Items
              </p>
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between text-body-sm">
                  <span className="text-charcoal-700">
                    <span className="font-medium">{item.quantity}×</span> {item.name}
                  </span>
                  <span className="text-charcoal-500 tabular-nums">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Total + Payment */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-semibold text-charcoal-800">Total</span>
                <span className="text-body-lg font-bold text-charcoal-900 tabular-nums">
                  ₹{orderDetails.total.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" size="sm">
                  {orderDetails.paymentMethod === 'upi' ? (
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> UPI
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Banknote className="w-3 h-3" /> Pay at Counter
                    </span>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Back Button ────────────────────────────────────── */}
        <div className="mt-6">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full h-12 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-sand-50 flex items-center justify-center">
          <div className="space-y-3 text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto rounded" />
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}

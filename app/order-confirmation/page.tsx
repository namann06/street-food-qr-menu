'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

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

  useEffect(() => {
    // Fetch order details from query parameters
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

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-black-900 text-slate-50 flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-900 text-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-orange-500">
            Order Confirmation
          </h1>
          <div className="bg-stone-800 rounded-lg p-6 mt-8">
            <div className="text-green-400 text-xl mb-4">Order Successfully Placed!</div>
            <p className="mb-4 text-lg"><span className="font-semibold">Order ID:</span> {orderDetails.orderId}</p>
            
            <div className="border-t border-gray-700 my-4 pt-4">
              <h2 className="font-semibold text-lg mb-2">Order Details:</h2>
              <ul className="space-y-2">
                {orderDetails.items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-700 my-4 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{orderDetails.total.toFixed(2)}</span>
              </div>
              <p className="mt-2"><span className="font-semibold">Payment Method:</span> {orderDetails.paymentMethod === 'upi' ? 'UPI' : 'Pay at Counter'}</p>
            </div>
          </div>
          
          <button
            onClick={() => router.back()}
            className="mt-6 px-6 py-3 rounded-lg bg-orange-700 text-black hover:bg-orange-600 font-semibold"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black-900 text-slate-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}

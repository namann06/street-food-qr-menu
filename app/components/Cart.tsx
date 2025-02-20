import { useState, useEffect } from 'react';
import Script from 'next/script';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  shopId: string;
  upiId?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Cart({ items, onUpdateQuantity, onRemoveItem, shopId, upiId = "your-upi@bank" }: CartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'counter' | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async (paymentType: 'upi' | 'counter') => {
    if (!tableNumber) {
      setError('Please enter your table number');
      return;
    }
    
    setError('');
    setIsProcessing(true);

    try {
      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total,
          tableNumber,
          paymentMethod: paymentType,
          shopId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      if (!data.orderId) {
        throw new Error('No order ID returned');
      }

      // Clear cart and reset states
      items.forEach(item => onRemoveItem(item._id));
      setTableNumber('');
      setShowPaymentOptions(false);
      setPaymentMethod(null);
      setOrderPlaced(true);
      
      // Show different messages based on payment method
      if (paymentType === 'upi') {
        alert(`Please pay ₹${total.toFixed(2)} to UPI ID: ${upiId}\nOrder ID: ${data.orderId}\nShow this message to the counter.`);
      } else {
        alert(`Order ID: ${data.orderId}\nPlease pay ₹${total.toFixed(2)} at the counter.`);
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Order error:', error);
      setError(error instanceof Error ? error.message : 'Error placing order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {/* Cart Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-gray-800 rounded-lg shadow-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Your Cart</h3>
          
          {items.length === 0 ? (
            <p className="text-gray-400">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                    <div className="flex-1">
                      <p className="text-white">{item.name}</p>
                      <p className="text-gray-400">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}
                        className="text-white hover:text-blue-500"
                      >
                        -
                      </button>
                      <span className="text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                        className="text-white hover:text-blue-500"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onRemoveItem(item._id)}
                        className="ml-2 text-red-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-4">
                {/* Table Number Input */}
                <div>
                  <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-400 mb-1">
                    Table Number
                  </label>
                  <input
                    type="text"
                    id="tableNumber"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Enter your table number"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-white mb-4">
                    <span>Total:</span>
                    <span className="font-semibold">₹{total.toFixed(2)}</span>
                  </div>

                  {!showPaymentOptions ? (
                    <button
                      onClick={() => setShowPaymentOptions(true)}
                      disabled={isProcessing || items.length === 0}
                      className={`w-full py-2 rounded ${
                        isProcessing || items.length === 0
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white transition-colors`}
                    >
                      Place Order
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => handlePlaceOrder('upi')}
                        disabled={isProcessing}
                        className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                      >
                        Pay with UPI
                      </button>
                      <button
                        onClick={() => handlePlaceOrder('counter')}
                        disabled={isProcessing}
                        className="w-full py-2 rounded bg-orange-600 hover:bg-orange-700 text-white transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                      >
                        Pay at Counter
                      </button>
                      <button
                        onClick={() => setShowPaymentOptions(false)}
                        className="w-full py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                      >
                        Back
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

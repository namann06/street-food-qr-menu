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

      // Check for order in response
      if (!data.order) {
        throw new Error('No order details returned');
      }

      // Clear cart and reset states
      items.forEach(item => onRemoveItem(item._id));
      setTableNumber('');
      setShowPaymentOptions(false);
      setPaymentMethod(null);
      setOrderPlaced(true);
      
      // Show different messages based on payment method
      if (paymentType === 'upi') {
        alert(`Please pay ₹${total.toFixed(2)} to UPI ID: ${upiId}\nOrder ID: ${data.order.orderId}\nShow this message to the counter.`);
      } else {
        alert(`Order ID: ${data.order.orderId}\nPlease pay ₹${total.toFixed(2)} at the counter.`);
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
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </div>
      </button>

      {/* Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Your Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Your cart is empty</p>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
                    >
                      <div>
                        <h3 className="text-white">{item.name}</h3>
                        <p className="text-gray-400">₹{item.price}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))
                          }
                          className="text-white bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded"
                        >
                          -
                        </button>
                        <span className="text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                          className="text-white bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table Number Input */}
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Table Number</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your table number"
                  />
                </div>

                {/* Total */}
                <div className="text-white text-lg font-semibold mb-4">
                  Total: ₹{total.toFixed(2)}
                </div>

                {error && (
                  <div className="text-red-500 mb-4">{error}</div>
                )}

                {/* Payment Options */}
                {!showPaymentOptions ? (
                  <button
                    onClick={() => setShowPaymentOptions(true)}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePlaceOrder('upi')}
                      disabled={isProcessing}
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Pay by UPI
                    </button>
                    <button
                      onClick={() => handlePlaceOrder('counter')}
                      disabled={isProcessing}
                      className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                      Pay at Counter
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

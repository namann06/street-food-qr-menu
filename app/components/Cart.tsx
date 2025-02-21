import { useState } from 'react';

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

export default function Cart({
  items,
  total,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  shopUpiId
}: CartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'counter'>('counter');
  const [tableNumber, setTableNumber] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

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
    <div className="fixed bottom-0 right-0 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >
        Cart ({items.length})
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {items.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">₹{item.price}</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onRemoveItem(item._id)}
                        className="ml-4 text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total:</span>
                    <span>₹{total}</span>
                  </div>
                  
                  {!showPaymentOptions ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Table Number
                        </label>
                        <input
                          type="text"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Enter your table number"
                        />
                      </div>
                      <button
                        onClick={handleProceedToPayment}
                        className="w-full bg-blue-500 text-white py-2 rounded"
                      >
                        Proceed to Payment
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Select Payment Method</h3>
                        <div className="space-y-2">
                          <button
                            onClick={() => setPaymentMethod('counter')}
                            className={`w-full py-2 rounded ${
                              paymentMethod === 'counter'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200'
                            }`}
                          >
                            Pay at Counter
                          </button>
                          <button
                            onClick={() => setPaymentMethod('upi')}
                            className={`w-full py-2 rounded ${
                              paymentMethod === 'upi'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200'
                            }`}
                          >
                            Pay via UPI
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={handlePayment}
                        className="w-full bg-green-500 text-white py-2 rounded"
                      >
                        Place Order
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowPaymentOptions(false);
              }}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

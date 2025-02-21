import { useState } from 'react';
import { FaShoppingCart, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { BsCashStack, BsQrCode } from 'react-icons/bs';

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
    <div className="fixed bottom-0 right-0 p-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-black p-4 rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105"
      >
        <FaShoppingCart className="text-xl" />
        <span className="font-semibold">{items.length}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="bg-blue-600 text-black p-6 relative">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowPaymentOptions(false);
                }}
                className="absolute top-4 right-4 text-black hover:text-gray-200 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item._id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-blue-600 font-medium">₹{item.price}</p>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item._id)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <FaTimes />
                          </button>
                        </div>
                        <div className="flex items-center justify-end mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-l text-gray-600 transition-colors"
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          <span className="px-4 py-1 bg-white border-y text-center min-w-[40px]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-r text-gray-600 transition-colors"
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total and Actions */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-semibold text-gray-800">Total:</span>
                      <span className="text-xl font-bold text-blue-600">₹{total}</span>
                    </div>
                    
                    {!showPaymentOptions ? (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Table Number
                          </label>
                          <input
                            type="text"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Enter your table number"
                          />
                        </div>
                        <button
                          onClick={handleProceedToPayment}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-black py-3 rounded-lg font-semibold transition-colors"
                        >
                          Proceed to Payment
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-800 mb-4">Select Payment Method</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => setPaymentMethod('counter')}
                              className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
                                paymentMethod === 'counter'
                                  ? 'bg-blue-600 text-black'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                              }`}
                            >
                              <BsCashStack className="text-2xl" />
                              <span>Pay at Counter</span>
                            </button>
                            <button
                              onClick={() => setPaymentMethod('upi')}
                              className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
                                paymentMethod === 'upi'
                                  ? 'bg-blue-600 text-black'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                              }`}
                            >
                              <BsQrCode className="text-2xl" />
                              <span>Pay via UPI</span>
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handlePayment}
                          className="w-full bg-green-600 hover:bg-green-700 text-black py-3 rounded-lg font-semibold transition-colors"
                        >
                          Place Order
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

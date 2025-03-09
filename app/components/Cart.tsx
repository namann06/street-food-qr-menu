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
        className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105"
      >
        <FaShoppingCart className="text-xl" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">{items.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div className="bg-stone-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl relative border border-stone-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 relative">
              <h2 className="text-2xl font-bold flex items-center">
                <FaShoppingCart className="mr-3" /> Your Cart
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowPaymentOptions(false);
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors bg-black bg-opacity-30 p-2 rounded-full"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <FaShoppingCart className="text-5xl text-gray-600" />
                  </div>
                  <p className="text-gray-400 text-lg">Your cart is empty</p>
                  <p className="text-gray-500 text-sm mt-2">Add some delicious items to get started</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item._id} className="bg-stone-800 rounded-xl p-4 shadow-md border border-stone-700 hover:border-orange-500 transition-all duration-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-white">{item.name}</h3>
                            <p className="text-orange-400 font-medium">₹{item.price}</p>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors bg-stone-700 p-1.5 rounded-full"
                          >
                            <FaTimes className="text-sm" />
                          </button>
                        </div>
                        <div className="flex items-center justify-end mt-3">
                          <div className="flex items-center bg-stone-700 rounded-full p-1">
                            <button
                              onClick={() => onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}
                              className="p-1.5 hover:bg-stone-600 rounded-full text-white transition-colors"
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="px-3 py-0.5 text-white text-center min-w-[30px] font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                              className="p-1.5 hover:bg-stone-600 rounded-full text-white transition-colors"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total and Actions */}
                  <div className="border-t border-stone-700 pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-semibold text-white">Total:</span>
                      <span className="text-xl font-bold text-orange-400">₹{total}</span>
                    </div>
                    
                    {!showPaymentOptions ? (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Table Number
                          </label>
                          <input
                            type="text"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="w-full p-3 bg-stone-800 text-white border border-stone-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            placeholder="Enter your table number"
                          />
                        </div>
                        <button
                          onClick={handleProceedToPayment}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-md transform hover:translate-y-[-2px]"
                        >
                          Proceed to Payment
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="mb-6">
                          <h3 className="font-semibold text-white mb-4">Select Payment Method</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => setPaymentMethod('counter')}
                              className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all ${
                                paymentMethod === 'counter'
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                  : 'bg-stone-800 border border-stone-700 hover:border-orange-500 text-white'
                              }`}
                            >
                              <BsCashStack className="text-2xl" />
                              <span>Pay at Counter</span>
                            </button>
                            <button
                              onClick={() => setPaymentMethod('upi')}
                              className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all ${
                                paymentMethod === 'upi'
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                  : 'bg-stone-800 border border-stone-700 hover:border-orange-500 text-white'
                              }`}
                            >
                              <BsQrCode className="text-2xl" />
                              <span>Pay via UPI</span>
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handlePayment}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-md transform hover:translate-y-[-2px]"
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
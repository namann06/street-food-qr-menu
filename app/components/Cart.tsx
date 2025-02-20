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
  onCheckout: () => void;
}

export default function Cart({
  items,
  total,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout
}: CartProps) {
  const [isOpen, setIsOpen] = useState(false);

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
                  <button
                    onClick={() => {
                      onCheckout();
                      setIsOpen(false);
                    }}
                    className="w-full bg-blue-500 text-white py-2 rounded"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
            <button
              onClick={() => setIsOpen(false)}
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

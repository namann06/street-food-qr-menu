'use client';

import { use, useEffect, useState } from 'react';
import Cart from '../../components/Cart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Shop {
  _id: string;
  name: string;
  address: string;
  upiId: string;
}

export default function MenuPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = use(params); // Unwrap params
  const router = useRouter();

  const [shop, setShop] = useState<Shop | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCategories, setShowCategories] = useState(false); // State to toggle category list

  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { _id: item._id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeCartItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
  };

  const handleCheckout = async (paymentMethod: 'upi' | 'counter', tableNumber: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopId,
          items: cartItems,
          total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          tableNumber,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      
      if (paymentMethod === 'upi' && shop?.upiId) {
        // Open UPI payment
        window.location.href = `upi://pay?pa=${shop.upiId}&pn=${shop.name}&am=${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}&tn=Order%20Payment`;
      }

      // Clear cart
      setCartItems([]);
      
      // Redirect to order confirmation page
      router.push(`/order-confirmation?orderId=${data.order.orderId}&items=${encodeURIComponent(JSON.stringify(cartItems))}&total=${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}&paymentMethod=${paymentMethod}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`/api/menu/${shopId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch menu');
        }
        const data = await res.json();
        setShop(data.shop);
        setMenuItems(data.menuItems);
      } catch (err) {
        setError('Error loading menu');
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchMenu();
    }
  }, [shopId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black-900 text-white flex items-center justify-center">
        Loading menu...
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-black-900 text-white flex items-center justify-center">
        {error || 'Shop not found'}
      </div>
    );
  }

  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!item.available) return acc;
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Get unique categories
  const categories = ['all', ...Object.keys(menuByCategory)];

  // Filter menu items based on search query and selected category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return item.available && matchesSearch && matchesCategory;
  });

  // Group filtered items by category
  const filteredMenuByCategory = filteredMenuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-black-900 text-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-orange-500">
            {shop.name}
          </h1>
          <p className="text-lg text-white-500 dark:text-white-400">{shop.address}</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-orange-700 text-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          />
          
          {/* Category Toggle Button */}
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="w-full px-4 py-2 rounded-lg bg-stone-800 text-white-300 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          >
            {showCategories ? 'Hide' : 'Filter by Categories'}
          </button>

          {/* Category List */}
          {showCategories && (
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowCategories(false); // Hide the list after selection
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {Object.entries(filteredMenuByCategory).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-orange-400">
              {category}
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-stone-900 p-4 rounded-lg flex justify-between items-start"
                >
                  <div className="flex items-start gap-3">
                    {item.image && (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="object-cover"
                          fill
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      {item.description && (
                        <p className="text-beige-400 text-sm mt-1">
                          {item.description}
                        </p>
                      )}
                      <p className="text-orange-400 mt-2">₹{item.price}</p>
                    </div>
                  </div>
                  {cartItems.find(cartItem => cartItem._id === item._id) ? (
                    <div className="flex items-center space-x-2 bg-orange-600 rounded-lg px-2">
                      <button
                        onClick={() => {
                          const currentQuantity = cartItems.find(cartItem => cartItem._id === item._id)?.quantity || 0;
                          updateCartItemQuantity(item._id, Math.max(0, currentQuantity - 1));
                        }}
                        className="text-white hover:text-orange-500 w-8 h-8 flex items-center justify-center text-xl font-semibold"
                      >
                        -
                      </button>
                      <span className="text-white w-8 text-center">
                        {cartItems.find(cartItem => cartItem._id === item._id)?.quantity || 0}
                      </span>
                      <button
                        onClick={() => {
                          const currentQuantity = cartItems.find(cartItem => cartItem._id === item._id)?.quantity || 0;
                          updateCartItemQuantity(item._id, currentQuantity + 1);
                        }}
                        className="text-white hover:text-orange-500 w-8 h-8 flex items-center justify-center text-xl font-semibold"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                    >
                      Add 
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Cart
        items={cartItems}
        total={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
        onRemoveItem={removeCartItem}
        onUpdateQuantity={updateCartItemQuantity}
        onCheckout={handleCheckout}
        shopUpiId={shop?.upiId}
      />
    </div>
  );
}
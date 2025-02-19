'use client';

import { use, useEffect, useState } from 'react';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

interface Shop {
  _id: string;
  name: string;
  address: string;
}

export default function MenuPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = use(params); // Unwrap params

  const [shop, setShop] = useState<Shop | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading menu...
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
          <p className="text-gray-400">{shop.address}</p>
        </div>

        {Object.entries(menuByCategory).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">
              {category}
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-800 p-4 rounded-lg flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    {item.description && (
                      <p className="text-gray-400 text-sm mt-1">
                        {item.description}
                      </p>
                    )}
                    <p className="text-green-500 mt-1">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

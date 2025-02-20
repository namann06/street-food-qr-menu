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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
          <p className="text-gray-400">{shop.address}</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
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
        </div>

        {Object.entries(filteredMenuByCategory).map(([category, items]) => (
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

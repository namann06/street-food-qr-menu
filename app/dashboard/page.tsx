'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import OrdersList from '../components/OrdersList';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  available: boolean;
  category?: string;
}

interface Shop {
  _id: string;
  name: string;
  address: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [shop, setShop] = useState<Shop | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const res = await fetch('/api/shop');
        const data = await res.json();
        setShop(data.shop);
        setMenuItems(data.menuItems);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchShopData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black-900 text-white flex items-center justify-center">
        Please sign in to access the dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-orange-500">{shop?.name}</h1>
          <Link
            href="/dashboard/menu/add"
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white transition-colors"
          >
            Add Menu Item
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Menu Items Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-orange-400">Menu Items</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1 bg-stone-800 rounded border border-stone-700 focus:outline-none focus:border-orange-500 text-white"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 bg-stone-800 rounded border border-stone-700 focus:outline-none focus:border-orange-500 text-white"
                >
                  <option value="all">All Categories</option>
                  {Array.from(new Set(menuItems.map(item => item.category || 'Uncategorized'))).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {menuItems
                .filter(item => {
                  const matchesSearch = 
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesCategory = 
                    selectedCategory === 'all' || 
                    (item.category || 'Uncategorized') === selectedCategory;
                  return matchesSearch && matchesCategory;
                })
                .map((item) => (
                  <div
                    key={item._id}
                    className="bg-stone-800 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-gray-400">{item.description}</p>
                      <p className="text-orange-400">₹{item.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/menu/${shop?._id}/items/${item._id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...item, available: !item.available })
                            });
                            if (res.ok) {
                              setMenuItems(items =>
                                items.map(i =>
                                  i._id === item._id ? { ...i, available: !i.available } : i
                                )
                              );
                            }
                          } catch (error) {
                            console.error('Error updating availability:', error);
                          }
                        }}
                        className={`px-3 py-1 rounded transition-colors ${
                          item.available
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                        } text-white`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                      <Link
                        href={`/dashboard/menu/edit/${item._id}`}
                        className="bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded text-white transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Orders Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">Orders</h2>
            {shop && <OrdersList shopId={shop._id} />}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mt-8 p-6 bg-stone-800 rounded-lg">
          <h2 className="text-xl font-semibold text-orange-400 mb-4">QR Code</h2>
          <div className="bg-white p-8 rounded-lg inline-block">
            <QRCodeSVG
              value={`${process.env.NEXT_PUBLIC_APP_URL}/menu/${shop?._id}`}
              size={200}
            />
          </div>
          <p className="mt-4 text-gray-400">
            Display this QR code at your shop for customers to scan and view your menu
          </p>
        </div>
      </div>
    </div>
  );
}
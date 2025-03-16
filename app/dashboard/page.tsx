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
  const [menuItemCount, setMenuItemCount] = useState(0);
  const [availableItemCount, setAvailableItemCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const res = await fetch('/api/shop');
        const data = await res.json();
        setShop(data.shop);
        setMenuItems(data.menuItems);
        
        // Calculate stats
        setMenuItemCount(data.menuItems.length);
        setAvailableItemCount(data.menuItems.filter((item: MenuItem) => item.available).length);
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

  const handleDeleteItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/menu/${shop?._id}/items/${itemId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Update the items list and counts
        const deletedItem = menuItems.find(item => item._id === itemId);
        if (deletedItem?.available) {
          setAvailableItemCount(prev => prev - 1);
        }
        setMenuItemCount(prev => prev - 1);
        setMenuItems(prev => prev.filter(item => item._id !== itemId));
        setShowDeleteConfirm(null);
      } else {
        console.error('Failed to delete item:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-stone-800 rounded-2xl p-6 shadow-md flex justify-between items-center">
          <div className="flex-1 flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold text-orange-500">{shop?.name}</h1>
            <p className="text-gray-400 text-sm">{shop?.address}</p>
          </div>
          <Link
            href="/dashboard/menu/add"
            className="ml-4 bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded-full text-white font-medium text-l transition-all duration-300 shadow-md"
          >
            Add Menu Item
          </Link>
        </div>
  
        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Menu Items Section */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-stone-800 rounded-2xl p-6 shadow-md flex-1 flex flex-col">
              {/* Header with Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-orange-400 w-full sm:w-auto text-center sm:text-left">
                  Menu Items
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 bg-stone-900 rounded-full border border-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white text-sm w-40"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-stone-900 rounded-full border border-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white text-sm w-40"
                  >
                    <option value="all">All</option>
                    {Array.from(new Set(menuItems.map(item => item.category || 'Uncategorized'))).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
  
              {/* Menu Items List */}
              <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1 custom-scrollbar">
                {menuItems
                  .filter(item => {
                    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.description.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesCategory = selectedCategory === 'all' ||
                      (item.category || 'Uncategorized') === selectedCategory;
                    return matchesSearch && matchesCategory;
                  })
                  .map((item) => (
                    <div
                      key={item._id}
                      className="bg-stone-900 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition-all"
                    >
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                        <p className="text-gray-400 text-sm line-clamp-1">{item.description}</p>
                        <p className="text-orange-400 font-medium">₹{item.price}</p>
                      </div>
  
                      <div className="flex flex-wrap justify-end gap-2 w-full sm:w-auto">
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(`/api/menu/${shop?._id}/items/${item._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...item, available: !item.available })
                              });
                              if (res.ok) {
                                item.available
                                  ? setAvailableItemCount(prev => prev - 1)
                                  : setAvailableItemCount(prev => prev + 1);
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
                          className={`px-4 py-2 rounded-full text-white text-sm font-medium transition-all ${
                            item.available
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          {item.available ? 'Available' : 'Unavailable'}
                        </button>
  
                        {showDeleteConfirm === item._id ? (
                          <>
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-full text-white text-sm transition-all"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="bg-stone-700 hover:bg-stone-600 px-3 py-2 rounded-full text-white text-sm transition-all"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(item._id)}
                            className="bg-stone-700 hover:bg-stone-600 p-2 rounded-full text-white text-sm flex items-center justify-center transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
  
                        <Link
                          href={`/dashboard/menu/edit/${item._id}`}
                          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full text-white text-sm font-medium transition-all"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
  
                {menuItems.filter(item => {
                  const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesCategory = selectedCategory === 'all' ||
                    (item.category || 'Uncategorized') === selectedCategory;
                  return matchesSearch && matchesCategory;
                }).length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    No menu items found matching your filters
                  </div>
                )}
              </div>
            </div>
          </div>
  
          {/* Right Column */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-6">
            {/* Orders Section */}
            <div className="bg-stone-800 rounded-2xl p-6 shadow-md flex flex-col">
              <h2 className="text-xl font-semibold text-orange-400 mb-4">Orders</h2>
              <div className="overflow-y-auto max-h-[40vh] pr-1 custom-scrollbar">
                {shop && <OrdersList shopId={shop._id} />}
              </div>
            </div>
  
            {/* QR Code Section */}
            <div className="bg-stone-800 rounded-2xl p-6 shadow-md flex flex-col">
              <h2 className="text-xl font-semibold text-orange-400 mb-4">Menu QR Code</h2>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-2xl">
                  <QRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${shop?._id}`}
                    size={150}
                  />
                </div>
                <p className="text-gray-400 text-sm text-center">
                  Scan this QR code to view your restaurant menu
                </p>
                <Link
                  href={`/menu/${shop?._id}`}
                  target="_blank"
                  className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-full text-white text-sm font-medium w-full text-center transition-all duration-300 shadow-md"
                >
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
  
        {/* Custom Scrollbar */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(28, 25, 23, 0.5);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(251, 146, 60, 0.5);
            border-radius: 10px;
            transition: all 0.3s;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(251, 146, 60, 0.8);
          }
        `}</style>
      </div>
    </div>
  );
}

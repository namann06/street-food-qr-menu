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
        console.error('Failed to delete item');
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
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Smaller */}
        <div className="bg-stone-800 rounded-lg p-3 mb-4 shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-orange-500">{shop?.name}</h1>
              <p className="text-gray-400 text-xs">{shop?.address}</p>
            </div>
            <Link
              href="/dashboard/menu/add"
              className="bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg text-white transition-colors font-medium text-center text-sm"
            >
              Add Menu Itemmm
            </Link>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Stats Row */}
          <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Menu Items */}
            <div className="bg-stone-800 rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Total Menu Items</p>
                  <p className="text-2xl font-bold text-white">{menuItemCount}</p>
                </div>
                <div className="bg-stone-700 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Available Items */}
            <div className="bg-stone-800 rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Available Items</p>
                  <p className="text-2xl font-bold text-white">{availableItemCount}</p>
                </div>
                <div className="bg-stone-700 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Unavailable Items */}
            <div className="bg-stone-800 rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Unavailable Items</p>
                  <p className="text-2xl font-bold text-white">{menuItemCount - availableItemCount}</p>
                </div>
                <div className="bg-stone-700 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Menu Items Section - 7 columns on large screens */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-stone-800 rounded-lg p-4 shadow-md h-full">
              {/* Improved Menu Items Header - Text in same line */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-orange-400">Menu Items</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-1.5 bg-stone-900 rounded-full border border-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white text-sm w-32"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1.5 bg-stone-900 rounded-full border border-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white text-sm w-32"
                  >
                    <option value="all">All</option>
                    {Array.from(new Set(menuItems.map(item => item.category || 'Uncategorized'))).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1 custom-scrollbar">
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
                      className="bg-stone-900 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all hover:shadow-lg"
                    >
                      <div>
                        <h3 className="font-medium text-white">{item.name}</h3>
                        <p className="text-gray-400 text-sm line-clamp-1">{item.description}</p>
                        <p className="text-orange-400 font-medium mt-1">₹{item.price}</p>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(`/api/menu/${shop?._id}/items/${item._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...item, available: !item.available })
                              });
                              if (res.ok) {
                                // Update counts
                                if (item.available) {
                                  setAvailableItemCount(prev => prev - 1);
                                } else {
                                  setAvailableItemCount(prev => prev + 1);
                                }
                                
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
                          className={`px-3 py-1.5 rounded-md transition-colors ${
                            item.available
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-red-600 hover:bg-red-700'
                          } text-white text-sm`}
                        >
                          {item.available ? 'Available' : 'Unavailable'}
                        </button>
                        {showDeleteConfirm === item._id ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="bg-red-600 hover:bg-red-700 px-2 py-1.5 rounded-md text-white transition-colors text-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="bg-stone-700 hover:bg-stone-600 px-2 py-1.5 rounded-md text-white transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(item._id)}
                            className="bg-stone-700 hover:bg-stone-600 px-3 py-1.5 rounded-md text-white transition-colors text-sm flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                        <Link
                          href={`/dashboard/menu/edit/${item._id}`}
                          className="bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-md text-white transition-colors text-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                  
                {menuItems.filter(item => {
                  const matchesSearch = 
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesCategory = 
                    selectedCategory === 'all' || 
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
          
          {/* Right Column - 5 columns on large screens */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {/* QR Code Section */}
            <div className="bg-stone-800 rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold text-orange-400 mb-4">Menu QR Code</h2>
              <div className="flex flex-col items-center">
                <div className="bg-white p-3 rounded-lg mb-4">
                  <QRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${shop?._id}`}
                    size={150}
                  />
                </div>
                <p className="text-gray-400 text-sm text-center mb-4">
                  Scan this QR code to view your restaurant menu
                </p>
                <Link
                  href={`/menu/${shop?._id}`}
                  target="_blank"
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white transition-colors font-medium text-center w-full"
                >
                  View Menu
                </Link>
              </div>
            </div>
            
            {/* Orders Section with improved calendar */}
            <div className="bg-stone-800 rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold text-orange-400 mb-3">Orders</h2>
              <div className="overflow-y-auto max-h-[40vh] pr-1 custom-scrollbar">
                {shop && <OrdersList shopId={shop._id} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add custom scrollbar styles */}
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
  );
}

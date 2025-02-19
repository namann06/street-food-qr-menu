'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  available: boolean;
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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Please sign in to access the dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{shop?.name}</h1>
          <Link
            href="/dashboard/menu/add"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Add Menu Item
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-400">{item.description}</p>
                    <p className="text-green-500">₹{item.price}</p>
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
                      className={`px-3 py-1 rounded ${
                        item.available
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                    <Link
                      href={`/dashboard/menu/edit/${item._id}`}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">QR Code</h2>
            <div className="bg-white p-8 rounded-lg inline-block">
              <QRCodeSVG
                value={`${process.env.NEXT_PUBLIC_APP_URL}/menu/${shop?._id}`}
                size={200}
              />
            </div>
            <p className="mt-4 text-gray-400">
              Display this QR code at your shop for customers to scan and view your
              menu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

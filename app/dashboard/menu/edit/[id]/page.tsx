'use client';

import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  shop: string;
}

export default function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const res = await fetch(`/api/shop/menu/${id}`);
        if (!res.ok) throw new Error('Failed to fetch menu item');
        const data = await res.json();
        setMenuItem(data);
      } catch (err) {
        setError('Error loading menu item');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchMenuItem();
    }
  }, [session, id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!menuItem) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/menu/${menuItem.shop}/items/${menuItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItem),
      });

      if (!res.ok) throw new Error('Failed to update menu item');

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Error updating menu item');
    } finally {
      setSaving(false);
    }
  };

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
        Please sign in to access this page.
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Menu item not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Menu Item</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={menuItem.name}
              onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
              className="w-full bg-gray-800 rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={menuItem.description}
              onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
              className="w-full bg-gray-800 rounded p-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={menuItem.price}
              onChange={(e) => setMenuItem({ ...menuItem, price: Number(e.target.value) })}
              className="w-full bg-gray-800 rounded p-2"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={menuItem.category}
              onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
              className="w-full bg-gray-800 rounded p-2"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={menuItem.available}
              onChange={(e) => setMenuItem({ ...menuItem, available: e.target.checked })}
              className="mr-2"
              id="available"
            />
            <label htmlFor="available">Available</label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

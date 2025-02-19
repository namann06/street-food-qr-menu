'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

interface EditMenuItemProps {
  menuItem: MenuItem;
  shopId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedItem: MenuItem) => void;
}

export default function EditMenuItem({ menuItem, shopId, isOpen, onClose, onUpdate }: EditMenuItemProps) {
  const [formData, setFormData] = useState(menuItem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(menuItem);
  }, [menuItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/menu/${shopId}/items/${menuItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update menu item');
      }

      const updatedItem = await res.json();
      onUpdate(updatedItem);
      onClose();
    } catch (err) {
      setError('Error updating menu item');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Menu Item</h2>
        
        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-700 rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-700 rounded p-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-gray-700 rounded p-2"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-700 rounded p-2"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="mr-2"
                id="available"
              />
              <label htmlFor="available">Available</label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

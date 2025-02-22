'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@/types/menu';

interface EditMenuItemProps {
  menuItem: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedItem: MenuItem) => void;
}

export default function EditMenuItem({ menuItem, isOpen, onClose, onUpdate }: EditMenuItemProps) {
  const [formData, setFormData] = useState(menuItem);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(menuItem);
  }, [menuItem]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!menuItem) return;

    setSaving(true);
    setError('');

    try {
      // Detailed logging of menuItem
      console.log('Full menuItem object:', JSON.stringify(menuItem, null, 2));

      // Robust shop ID extraction
      let shopId: string;
      if (typeof menuItem.shop === 'string') {
        shopId = menuItem.shop;
      } else if (typeof menuItem.shop === 'object' && menuItem.shop._id) {
        shopId = menuItem.shop._id;
      } else {
        console.error('Invalid shop object:', menuItem.shop);
        throw new Error('Invalid shop ID');
      }

      // Validate shop ID
      if (!shopId || shopId.trim() === '') {
        throw new Error('Shop ID is empty');
      }

      console.log('Extracted shopId:', shopId);

      // Prepare the request body with explicit shop ID
      const requestBody = {
        ...formData,
        shop: {
          _id: shopId
        }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const res = await fetch(`/api/menu/${shopId}/items/${menuItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const responseData = await res.json();

      if (!res.ok) {
        console.error('Server error response:', responseData);
        throw new Error(responseData.message || 'Failed to update menu item');
      }

      // Update successful
      onUpdate(responseData);
      onClose();
    } catch (err) {
      console.error('Full error:', err);
      setError(err instanceof Error ? err.message : 'Error updating menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox separately
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        available: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-stone-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-orange-400">Edit Menu Item</h2>
        
        {error && (
          <div className="bg-red-600 border border-red-700 text-white px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-stone-800 border border-stone-700 rounded-md shadow-sm py-2 px-3 text-white focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-400">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full bg-stone-800 border border-stone-700 rounded-md shadow-sm py-2 px-3 text-white focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-400">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full bg-stone-800 border border-stone-700 rounded-md shadow-sm py-2 px-3 text-white focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-400">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full bg-stone-800 border border-stone-700 rounded-md shadow-sm py-2 px-3 text-white focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="form-checkbox bg-stone-800 border-stone-700 text-orange-500 focus:ring-orange-500"
              />
              <span className="ml-2 text-gray-400">Available</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 bg-stone-700 text-white rounded hover:bg-stone-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changesss'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
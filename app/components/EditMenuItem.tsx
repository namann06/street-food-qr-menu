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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-black/90 border border-stone-800 p-8 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-white">Edit Menu Item</h2>
        
        {error && (
          <div className="bg-red-950 border border-red-900 text-red-200 px-4 py-3 rounded-lg mb-6" role="alert">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-black border border-stone-800 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Item name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-black border border-stone-800 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              placeholder="Item description"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-200 mb-2">Price</label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-gray-500">₹</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full bg-black border border-stone-800 rounded-lg py-2.5 pl-8 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-2">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-black border border-stone-800 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="e.g., Starters, Main Course"
            />
          </div>

          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-500/25 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              <span className="ms-3 text-sm font-medium text-gray-200">Available</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 bg-transparent border border-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors disabled:opacity-50"
            >
              Cancelll
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
            >
              {saving ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
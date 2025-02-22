'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddMenuItem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error adding menu item');
      }

      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-black-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-orange-400">Add Menu Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-600 text-white p-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 bg-stone-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 bg-stone-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              className="w-full px-3 py-2 bg-stone-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Category
            </label>
            <input
              type="text"
              name="category"
              className="w-full px-3 py-2 bg-stone-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white transition-colors"
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-stone-700 hover:bg-stone-600 px-4 py-2 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
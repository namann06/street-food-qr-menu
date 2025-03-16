'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AddMenuItem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setImageLoading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setImageLoading(false);
      return data.url;
    } catch (error) {
      setImageLoading(false);
      console.error('Error uploading image:', error);
      throw new Error('Error uploading image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = null;
      
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          image: imageUrl,
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
        <h1 className="text-2xl font-bold mb-8 text-orange-500">Add Menu Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-stone-800 p-6 rounded-2xl shadow-md">
          {error && (
            <div className="bg-red-600 text-white p-3 rounded-2xl">
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
              className="w-full px-4 py-3 bg-stone-900 rounded-full border border-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white"
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
              className="w-full px-4 py-3 bg-stone-900 rounded-2xl border border-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white"
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
              className="w-full px-4 py-3 bg-stone-900 rounded-full border border-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white"
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
              className="w-full px-4 py-3 bg-stone-900 rounded-full border border-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Food Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 bg-stone-900 rounded-full border border-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white"
            />
            
            {imagePreview && (
              <div className="mt-2 relative h-40 w-full">
                <Image 
                  src={imagePreview} 
                  alt="Food preview" 
                  className="rounded-2xl object-contain"
                  fill
                />
              </div>
            )}
            
            {imageLoading && (
              <div className="mt-2 text-orange-400">Uploading image...</div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={imageLoading}
              className={`bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded-full text-white font-medium transition-all duration-300 shadow-md ${
                imageLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-stone-700 hover:bg-stone-600 px-5 py-2.5 rounded-full text-white font-medium transition-all duration-300 shadow-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
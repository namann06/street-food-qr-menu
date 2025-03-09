'use client';

import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  shop: string;
  image?: string;
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const createShopIfNotExists = async () => {
      try {
        const shopRes = await fetch('/api/shop');
        
        if (shopRes.status === 404) {
          // No shop exists, create a default shop
          const createShopRes = await fetch('/api/shop', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: `${session?.user?.name}'s Shop`,
              description: 'My first shop',
            }),
          });

          if (!createShopRes.ok) {
            throw new Error('Failed to create shop');
          }
        } else if (!shopRes.ok) {
          throw new Error('Error checking shop');
        }

        // Now fetch the menu item
        const res = await fetch(`/api/shop/menu/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch menu item');
        }
        const data = await res.json();
        setMenuItem(data);
        // If the menu item has an image, set it as preview
        if (data.image) {
          setImagePreview(data.image);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Error loading menu item');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      createShopIfNotExists();
    }
  }, [session, id]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!menuItem) return;

    setSaving(true);
    setError('');

    try {
      // Handle image upload if there's a new image
      let imageUrl = menuItem.image;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const res = await fetch(`/api/menu/${menuItem.shop}/items/${menuItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...menuItem,
          image: imageUrl
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update menu item');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error updating menu item');
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center flex-col">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => router.back()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Go Back
        </button>
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

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-1">Food Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-gray-800 rounded p-2"
            />
            
            {imagePreview && (
              <div className="mt-2 relative h-40 w-full">
                <Image 
                  src={imagePreview} 
                  alt="Food preview" 
                  className="rounded-md object-contain"
                  fill
                />
              </div>
            )}
            
            {imageLoading && (
              <div className="mt-2 text-orange-400">Uploading image...</div>
            )}
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
              disabled={saving || imageLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 ${
                (saving || imageLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={saving || imageLoading}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

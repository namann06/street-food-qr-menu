'use client';

import { useSession } from 'next-auth/react';
import { use, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Save, ImagePlus, Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  Button,
  Input,
  Card,
  CardContent,
  Switch,
  Separator,
  Skeleton,
} from '@/components/ui';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const createShopIfNotExists = async () => {
      try {
        const shopRes = await fetch('/api/shop');

        if (shopRes.status === 404) {
          const createShopRes = await fetch('/api/shop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: `${session?.user?.name}'s Shop`,
              description: 'My first shop',
            }),
          });
          if (!createShopRes.ok) throw new Error('Failed to create shop');
        } else if (!shopRes.ok) {
          throw new Error('Error checking shop');
        }

        const res = await fetch(`/api/shop/menu/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch menu item');
        }
        const data = await res.json();
        setMenuItem(data);
        if (data.image) setImagePreview(data.image);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Error loading menu item');
      } finally {
        setLoading(false);
      }
    };

    if (session) createShopIfNotExists();
  }, [session, id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImage = async (file: File) => {
    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('Image is too large. Maximum size is 10MB.');
    }

    const formData = new FormData();
    formData.append('file', file);
    try {
      setImageLoading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed (${response.status})`);
      }
      const data = await response.json();
      setImageLoading(false);
      return data.url;
    } catch (error) {
      setImageLoading(false);
      console.error('Error uploading image:', error);
      throw error instanceof Error ? error : new Error('Error uploading image');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!menuItem) return;
    setSaving(true);
    setError('');
    try {
      let imageUrl = menuItem.image;
      if (image) imageUrl = await uploadImage(image);

      const res = await fetch(`/api/menu/${menuItem.shop}/items/${menuItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...menuItem, image: imageUrl }),
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

  /* ─── Loading ────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-sand-100">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-sand-200">
          <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 h-14">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-32 h-5 rounded" />
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /* ─── Auth guard ─────────────────────────────────────────────── */
  if (!session) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center">
        <Card className="p-8 text-center max-w-sm">
          <p className="text-charcoal-600 mb-4">Please sign in to access this page.</p>
          <Button onClick={() => router.push('/auth/signin')}>Sign In</Button>
        </Card>
      </div>
    );
  }

  /* ─── Error state ────────────────────────────────────────────── */
  if (error && !menuItem) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center">
        <Card className="p-8 text-center max-w-sm space-y-4">
          <p className="text-red-600 text-body-sm">{error}</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center">
        <Card className="p-8 text-center max-w-sm">
          <p className="text-charcoal-600">Menu item not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100">
      {/* ── Top Bar ───────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-sand-200">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 h-14">
          <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-body-md font-semibold text-charcoal-900 font-display">
              Edit Item
            </h1>
          </div>
        </div>
      </div>

      {/* ── Form ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="max-w-2xl mx-auto px-4 py-6"
      >
        <Card>
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Banner */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-body-sm rounded-xl px-4 py-3">
                  <X className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-body-sm font-medium text-charcoal-700">Name</label>
                <Input
                  type="text"
                  value={menuItem.name}
                  onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-body-sm font-medium text-charcoal-700">Description</label>
                <textarea
                  value={menuItem.description}
                  onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-body-sm text-charcoal-800 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all resize-none"
                  rows={3}
                />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-body-sm font-medium text-charcoal-700">Price (₹)</label>
                  <Input
                    type="number"
                    value={menuItem.price}
                    onChange={(e) => setMenuItem({ ...menuItem, price: Number(e.target.value) })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-body-sm font-medium text-charcoal-700">Category</label>
                  <Input
                    type="text"
                    value={menuItem.category}
                    onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Separator />

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-body-sm font-medium text-charcoal-700">
                  Food Image <span className="text-charcoal-400 font-normal">(optional)</span>
                </label>

                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-sand-200 bg-sand-50">
                    <div className="relative h-48 w-full">
                      <Image
                        src={imagePreview}
                        alt="Food preview"
                        className="object-contain"
                        fill
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-sand-200 text-charcoal-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-2 py-8 rounded-xl border-2 border-dashed border-sand-300 bg-sand-50/50 text-charcoal-400 hover:border-sage-400 hover:text-sage-600 hover:bg-sage-50/30 transition-all cursor-pointer"
                  >
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-body-sm font-medium">Click to upload image</span>
                    <span className="text-body-xs text-charcoal-400">PNG, JPG up to 5MB</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imageLoading && (
                  <div className="flex items-center gap-2 text-sage-600 text-body-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading image…
                  </div>
                )}
              </div>

              <Separator />

              {/* Availability Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-sm font-medium text-charcoal-700">Available</p>
                  <p className="text-body-xs text-charcoal-400">
                    Toggle to show or hide this item on the menu
                  </p>
                </div>
                <Switch
                  checked={menuItem.available}
                  onCheckedChange={(checked) =>
                    setMenuItem({ ...menuItem, available: checked })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={saving || imageLoading}
                  className="min-w-[140px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  disabled={saving || imageLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

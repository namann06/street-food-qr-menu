'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Upload, ImagePlus, Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Separator,
} from '@/components/ui';
import { cn } from '@/lib/utils';

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
    const formData = new FormData();
    formData.append('file', file);

    try {
      setImageLoading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload image');
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
    setSubmitting(true);
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.name && formData.price;

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
              Add Menu Item
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
                <label className="text-body-sm font-medium text-charcoal-700">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  required
                  placeholder="e.g. Paneer Tikka"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-body-sm font-medium text-charcoal-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="A short description of the dish..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-body-sm text-charcoal-800 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all resize-none"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Price + Category row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-body-sm font-medium text-charcoal-700">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    name="price"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-body-sm font-medium text-charcoal-700">
                    Category
                  </label>
                  <Input
                    name="category"
                    placeholder="e.g. Starters"
                    value={formData.category}
                    onChange={handleChange}
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

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={!isFormValid || imageLoading || submitting}
                  className="min-w-[120px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Add Item
                    </>
                  )}
                </Button>
                <Button type="button" variant="ghost" onClick={() => router.back()}>
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
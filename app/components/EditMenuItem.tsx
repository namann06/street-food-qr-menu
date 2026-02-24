'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Loader2, UtensilsCrossed, IndianRupee, Tag } from 'lucide-react';
import { MenuItem } from '@/types/menu';

import { Button, Input, Card, CardContent, Switch, Separator } from '@/components/ui';

interface EditMenuItemProps {
  menuItem: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedItem: MenuItem) => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: 0.2 },
  },
};

export default function EditMenuItem({ menuItem, isOpen, onClose, onUpdate }: EditMenuItemProps) {
  const [formData, setFormData] = useState(menuItem);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(menuItem);
  }, [menuItem]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!menuItem) return;

    setSaving(true);
    setError('');

    try {
      let shopId: string;
      if (typeof menuItem.shop === 'string') {
        shopId = menuItem.shop;
      } else if (typeof menuItem.shop === 'object' && menuItem.shop._id) {
        shopId = menuItem.shop._id;
      } else {
        throw new Error('Invalid shop ID');
      }

      if (!shopId || shopId.trim() === '') {
        throw new Error('Shop ID is empty');
      }

      const requestBody = {
        ...formData,
        shop: { _id: shopId },
      };

      const res = await fetch(`/api/menu/${shopId}/items/${menuItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to update menu item');
      }

      onUpdate(responseData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, available: (e.target as HTMLInputElement).checked }));
      } else {
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
      }
    },
    [],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="edit-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="shadow-xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-body-lg font-semibold text-charcoal-900 font-display">
                    Edit Menu Item
                  </h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-sand-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-body-sm rounded-xl px-4 py-3 mb-5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="edit-name" className="text-body-sm font-medium text-charcoal-700">
                      Name
                    </label>
                    <Input
                      id="edit-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Item name"
                      icon={<UtensilsCrossed className="w-4 h-4" />}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit-description" className="text-body-sm font-medium text-charcoal-700">
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-xl border border-sand-300 bg-white px-4 py-2.5 text-body-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-400 transition-all resize-none"
                      placeholder="Short description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="edit-price" className="text-body-sm font-medium text-charcoal-700">
                        Price
                      </label>
                      <Input
                        id="edit-price"
                        name="price"
                        type="number"
                        required
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        icon={<IndianRupee className="w-4 h-4" />}
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="edit-category" className="text-body-sm font-medium text-charcoal-700">
                        Category
                      </label>
                      <Input
                        id="edit-category"
                        name="category"
                        type="text"
                        placeholder="e.g. Starters"
                        icon={<Tag className="w-4 h-4" />}
                        value={formData.category}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-body-sm font-medium text-charcoal-700">Available</span>
                    <Switch
                      checked={formData.available}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, available: checked }))
                      }
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={onClose}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 gap-2" disabled={saving}>
                      {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                      {saving ? 'Saving…' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Store, MapPin, AlertCircle } from 'lucide-react';

import { Button, Input, Card, CardContent, Separator } from '@/components/ui';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      router.push('/auth/signin');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sage-100 text-sage-600 mb-4">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="text-display-xs font-bold text-charcoal-900 font-display">
          Register your shop
        </h1>
        <p className="text-body-sm text-charcoal-500 mt-1">
          Create an account to manage your menu digitally
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="w-full max-w-sm"
      >
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-body-sm rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Owner Details */}
              <fieldset className="space-y-3">
                <legend className="text-body-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
                  Your Details
                </legend>

                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-body-sm font-medium text-charcoal-700">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    icon={<User className="w-4 h-4" />}
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-body-sm font-medium text-charcoal-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    icon={<Mail className="w-4 h-4" />}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-body-sm font-medium text-charcoal-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </fieldset>

              <Separator />

              {/* Shop Details */}
              <fieldset className="space-y-3">
                <legend className="text-body-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
                  Shop Details
                </legend>

                <div className="space-y-1.5">
                  <label htmlFor="shopName" className="text-body-sm font-medium text-charcoal-700">
                    Shop Name
                  </label>
                  <Input
                    id="shopName"
                    name="shopName"
                    type="text"
                    required
                    placeholder="Tasty Bites"
                    icon={<Store className="w-4 h-4" />}
                    value={formData.shopName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="address" className="text-body-sm font-medium text-charcoal-700">
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    required
                    placeholder="123 Food Street"
                    icon={<MapPin className="w-4 h-4" />}
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </fieldset>

              <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>

            <Separator className="my-5" />

            <p className="text-center text-body-xs text-charcoal-500">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-sage-600 hover:text-sage-700 transition-colors">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

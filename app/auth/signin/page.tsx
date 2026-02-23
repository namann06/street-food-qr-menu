'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

import { Button, Input, Card, CardContent, Separator } from '@/components/ui';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2h18v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V2Z" />
            <path d="M3 8v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8" />
            <path d="M10 2v6" /><path d="M14 2v6" />
          </svg>
        </div>
        <h1 className="text-display-xs font-bold text-charcoal-900 font-display">
          Welcome back
        </h1>
        <p className="text-body-sm text-charcoal-500 mt-1">
          Sign in to manage your menu
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

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-body-sm font-medium text-charcoal-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-body-sm font-medium text-charcoal-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <Separator className="my-5" />

            <p className="text-center text-body-xs text-charcoal-500">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-sage-600 hover:text-sage-700 transition-colors">
                Register your shop
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

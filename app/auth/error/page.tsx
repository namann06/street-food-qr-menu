'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight } from 'lucide-react';

import { Button, Card, CardContent, Skeleton } from '@/components/ui';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration. Please contact support.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign in link is no longer valid. Please request a new one.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = error ? errorMessages[error] : 'An unknown error occurred. Please try again.';

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="w-full max-w-sm"
      >
        <Card>
          <CardContent className="p-8 text-center space-y-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 text-red-500 mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-display-xs font-bold text-charcoal-900 font-display">
                Something went wrong
              </h1>
              <p className="text-body-sm text-charcoal-500 leading-relaxed">
                {message}
              </p>
            </div>

            <Link href="/auth/signin">
              <Button className="w-full h-11 gap-2">
                Back to Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="p-8 space-y-5 flex flex-col items-center">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <Skeleton className="w-40 h-6 rounded-lg" />
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-full h-11 rounded-xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ErrorContent />
    </Suspense>
  );
}
